# Question Bank Structure

当前学生做题 + 老师标准讲解的资源，已经整理成独立题库文件：

- [question-bank.json](/C:/Users/Jiang/Documents/New%20project/data/question-bank.json)

当前后端读取顺序是：

1. 先读数据库题库表
2. 如果数据库还没有题目，再回退到本地 `question-bank.json`

## 当前结构

每一道题包含两部分：

1. 题目本体
- `id`
- `abilityIndex`
- `type`
- `question`
- `choices`
- `answer`

2. 老师讲解资源
- `assetType`
- `assetLabel`
- `assetUrl`
- `summary`
- `steps`
- `followUp`

## 设计意图

这套结构的目标是把：

- 学生作答
- 老师标准讲解
- AI 围绕讲解追问

拆成可以独立维护的资源层。

这样后续可以自然扩展到：

- 老师后台录入题目
- 老师上传视频 / 图片 / 图文讲解
- 数据库存储题库
- AI 回答时按题目和步骤做上下文限定

## 已落地的数据库设计

目前 Prisma 已经补上这几张表：

- `QuestionSubject`
- `QuestionTopic`
- `Question`
- `QuestionChoice`
- `QuestionExplanation`
- `QuestionExplanationStep`

对应文件：

- [schema.prisma](/C:/Users/Jiang/Documents/New%20project/prisma/schema.prisma)

## 表关系

- `Question`
  - 一道题的题干、答案、题型、能力维度
- `QuestionChoice`
  - 选择题选项
- `QuestionExplanation`
  - 这道题对应的一份老师标准讲解
- `QuestionExplanationStep`
  - 标准讲解里的逐步拆解

关系是：

- `QuestionSubject 1 - n QuestionTopic`
- `QuestionSubject 1 - n Question`
- `QuestionTopic 1 - n Question`
- `Question 1 - n QuestionChoice`
- `Question 1 - 1 QuestionExplanation`
- `QuestionExplanation 1 - n QuestionExplanationStep`

## Seed

题库 seed 现在也已经接入：

- [seed-student-s1.js](/C:/Users/Jiang/Documents/New%20project/scripts/seed-student-s1.js)

它会把：

- 学生数据
- 课程 / 课次
- 题库
- 标准讲解
- 讲解步骤

一起导入数据库。
