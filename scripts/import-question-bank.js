"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { withTransaction, closePool } = require("../lib/pg");

const root = path.resolve(__dirname, "..");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getInputPath() {
  const supplied = process.argv[2];
  if (supplied) {
    return path.resolve(process.cwd(), supplied);
  }
  return path.join(root, "data", "sequence-question-bank.json");
}

function buildCatalogMaps() {
  const catalog = readJson(path.join(root, "data", "quiz-catalog.json"));
  const subjectMap = new Map();
  const topicMap = new Map();

  for (const subject of catalog.subjects || []) {
    subjectMap.set(subject.id, subject);
    for (const topic of subject.topics || []) {
      topicMap.set(`${subject.id}:${topic.id}`, topic);
    }
  }

  return { subjectMap, topicMap };
}

async function upsertQuestionSubject(client, question, subjectMeta) {
  const now = new Date();
  await client.query(
    `insert into "QuestionSubject"
      ("id", "label", "shortLabel", "accent", "description", "mapTitle", "createdAt", "updatedAt")
     values ($1, $2, $3, $4, $5, $6, $7, $7)
     on conflict ("id") do update
     set "label" = excluded."label",
         "shortLabel" = excluded."shortLabel",
         "accent" = excluded."accent",
         "description" = excluded."description",
         "mapTitle" = excluded."mapTitle",
         "updatedAt" = excluded."updatedAt"`,
    [
      question.subjectId,
      subjectMeta?.label || question.subjectId,
      subjectMeta?.shortLabel || subjectMeta?.label || question.subjectId,
      subjectMeta?.accent || "#2f7e79",
      subjectMeta?.description || `${question.subjectId} imported from PDF pipeline`,
      subjectMeta?.mapTitle || `${subjectMeta?.label || question.subjectId} knowledge map`,
      now
    ]
  );
}

async function upsertQuestionTopic(client, question, topicMeta) {
  const now = new Date();
  await client.query(
    `insert into "QuestionTopic"
      ("id", "subjectId", "label", "summary", "keywords", "createdAt", "updatedAt")
     values ($1, $2, $3, $4, $5::jsonb, $6, $6)
     on conflict ("subjectId", "id") do update
     set "label" = excluded."label",
         "summary" = excluded."summary",
         "keywords" = excluded."keywords",
         "updatedAt" = excluded."updatedAt"`,
    [
      question.topicId,
      question.subjectId,
      topicMeta?.label || question.topicId,
      topicMeta?.summary || `${question.topicId} imported from PDF pipeline`,
      JSON.stringify(topicMeta?.keywords || []),
      now
    ]
  );
}

async function upsertQuestion(client, question) {
  const now = new Date();
  await client.query(
    `insert into "Question"
      ("id", "subjectId", "topicId", "levelId", "abilityIndex", "type", "prompt", "answer", "blankLabels", "active", "createdAt", "updatedAt")
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $11)
     on conflict ("id") do update
     set "subjectId" = excluded."subjectId",
         "topicId" = excluded."topicId",
         "levelId" = excluded."levelId",
         "abilityIndex" = excluded."abilityIndex",
         "type" = excluded."type",
         "prompt" = excluded."prompt",
         "answer" = excluded."answer",
         "blankLabels" = excluded."blankLabels",
         "active" = excluded."active",
         "updatedAt" = excluded."updatedAt"`,
    [
      question.id,
      question.subjectId,
      question.topicId,
      question.levelId || "basic",
      Number.isInteger(question.abilityIndex) ? question.abilityIndex : 0,
      question.type || "text",
      question.question || question.prompt || "",
      question.answer || "",
      JSON.stringify(question.blankLabels || []),
      true,
      now
    ]
  );
}

async function replaceChoices(client, question) {
  await client.query(`delete from "QuestionChoice" where "questionId" = $1`, [question.id]);
  const choices = Array.isArray(question.choices) ? question.choices : [];
  for (const [index, label] of choices.entries()) {
    await client.query(
      `insert into "QuestionChoice" ("questionId", "label", "sortOrder", "createdAt")
       values ($1, $2, $3, $4)`,
      [question.id, label, index, new Date()]
    );
  }
}

async function replaceExplanation(client, question) {
  const explanation = question.explanation;
  if (!explanation) {
    await client.query(`delete from "QuestionExplanation" where "questionId" = $1`, [question.id]);
    return;
  }

  const explanationResult = await client.query(
    `insert into "QuestionExplanation"
      ("questionId", "assetType", "assetLabel", "assetUrl", "summary", "followUp", "createdAt", "updatedAt")
     values ($1, $2, $3, $4, $5, $6, $7, $7)
     on conflict ("questionId") do update
     set "assetType" = excluded."assetType",
         "assetLabel" = excluded."assetLabel",
         "assetUrl" = excluded."assetUrl",
         "summary" = excluded."summary",
         "followUp" = excluded."followUp",
         "updatedAt" = excluded."updatedAt"
     returning "id"`,
    [
      question.id,
      explanation.assetType || "text",
      explanation.assetLabel || "老师标准讲解",
      explanation.assetUrl || null,
      explanation.summary || "",
      explanation.followUp || "",
      new Date()
    ]
  );

  const explanationId = explanationResult.rows[0].id;
  await client.query(`delete from "QuestionExplanationStep" where "explanationId" = $1`, [explanationId]);

  for (const [index, step] of (explanation.steps || []).entries()) {
    await client.query(
      `insert into "QuestionExplanationStep"
        ("explanationId", "lineLabel", "title", "detail", "sortOrder", "createdAt")
       values ($1, $2, $3, $4, $5, $6)`,
      [
        explanationId,
        step.line || step.lineLabel || `Step ${index + 1}`,
        step.title || "",
        step.detail || "",
        index,
        new Date()
      ]
    );
  }
}

async function main() {
  const inputPath = getInputPath();
  const payload = readJson(inputPath);
  const questions = Array.isArray(payload.questions) ? payload.questions : [];
  if (!questions.length) {
    throw new Error(`No questions found in ${inputPath}`);
  }

  const { subjectMap, topicMap } = buildCatalogMaps();

  await withTransaction(async (client) => {
    for (const question of questions) {
      const subjectMeta = subjectMap.get(question.subjectId);
      const topicMeta = topicMap.get(`${question.subjectId}:${question.topicId}`);
      await upsertQuestionSubject(client, question, subjectMeta);
      await upsertQuestionTopic(client, question, topicMeta);
      await upsertQuestion(client, question);
      await replaceChoices(client, question);
      await replaceExplanation(client, question);
    }
  });

  console.log(`Imported ${questions.length} question(s) from ${path.relative(root, inputPath)}`);
}

main()
  .catch((error) => {
    console.error(error.stack || error.message || String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool().catch(() => {});
  });
