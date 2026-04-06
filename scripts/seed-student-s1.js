require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const storePath = path.join(__dirname, "..", "data", "student-s1.json");
const questionBankPath = path.join(__dirname, "..", "data", "question-bank.json");
const quizCatalogPath = path.join(__dirname, "..", "data", "quiz-catalog.json");

function readStore() {
  return JSON.parse(fs.readFileSync(storePath, "utf8"));
}

function readQuestionBank() {
  return JSON.parse(fs.readFileSync(questionBankPath, "utf8"));
}

function readQuizCatalog() {
  return JSON.parse(fs.readFileSync(quizCatalogPath, "utf8"));
}

function buildExplanation(subject, topic, level, index, answer) {
  return {
    assetType: index % 3 === 0 ? "video" : index % 3 === 1 ? "image" : "text",
    assetLabel: `${subject.label} · ${topic.label} · ${level.label} 讲解`,
    assetUrl: `demo://quiz/${subject.id}/${topic.id}/${level.id}/${index}`,
    summary: `老师会先用标准方法讲清 ${topic.label} 这个知识点，再让学生围绕具体步骤提问。`,
    steps: [
      { line: "第 1 行", title: "定位知识点", detail: `先确认这题属于 ${topic.label}，避免一开始就用错方法。` },
      { line: "第 2 行", title: "按标准流程拆解", detail: `按照老师事先准备的 ${level.label} 解题流程，一步一步往下做。` },
      { line: "第 3 行", title: "回看答案与错因", detail: `标准答案是 ${answer}。如果出错，要记录是概念问题还是步骤问题。` }
    ],
    followUp: "看完后可以继续追问“第 2 行是什么意思”或者“为什么这里要这样判断”。"
  };
}

function buildGeneratedQuestion(subject, topic, level, index) {
  const prefix = `${subject.label} · ${topic.label} · ${level.label}`;

  if (subject.id.startsWith("math")) {
    const base = level.id === "basic" ? 2 : level.id === "intermediate" ? 4 : 6;
    const x = base + index;
    const answer = String(x);
    return {
      id: `${subject.id}-${topic.id}-${level.id}-${index}`,
      subjectId: subject.id,
      topicId: topic.id,
      levelId: level.id,
      abilityIndex: 0,
      type: "text",
      question: `${prefix} 第 ${index + 1} 题：若 x + ${base + 1} = ${x + base + 1}，求 x。`,
      answer,
      explanation: buildExplanation(subject, topic, level, index, answer),
      choices: []
    };
  }

  const choiceSets = {
    japanese: {
      reading: ["概括段落中心", "列举细节", "解释单词", "说明顺序"],
      grammar: ["根据句子关系选助词", "跳过助词", "只看最后一个词", "只看标点"],
      vocab: ["结合语境判断词义", "死记单个中文义", "忽略上下文", "随机选择"]
    },
    english: {
      reading: ["Find the main idea", "Memorize one sentence only", "Ignore the title", "Translate every word"],
      grammar: ["Check tense and sentence structure", "Only look at the last word", "Guess by length", "Skip the subject"],
      vocab: ["Use context to infer meaning", "Choose the shortest option", "Ignore collocation", "Match by pronunciation"]
    },
    science: {
      physics: ["先判断受力或条件关系", "直接背答案", "只看数字大小", "跳过图示"],
      chemistry: ["先判断物质和反应类型", "先猜结论", "忽略实验现象", "只看颜色"],
      biology: ["先看结构与功能对应", "只记一个名词", "忽略过程顺序", "只看图大小"]
    },
    humanities: {
      history: ["先抓背景再看影响", "只记年份", "忽略材料立场", "只选最长选项"],
      geography: ["先看图表信息再判断", "只背地名", "忽略气候条件", "跳过比例尺"],
      civics: ["先分清观点和依据", "只看态度词", "忽略制度背景", "按直觉选择"]
    }
  };

  const choices = (choiceSets[subject.id] && choiceSets[subject.id][topic.id]) || ["先定位核心信息", "直接猜", "跳过条件", "只看表面词"];
  const answer = choices[0];
  return {
    id: `${subject.id}-${topic.id}-${level.id}-${index}`,
    subjectId: subject.id,
    topicId: topic.id,
    levelId: level.id,
    abilityIndex: 0,
    type: "choice",
    question: `${prefix} 第 ${index + 1} 题：这类题最合理的第一步是什么？`,
    choices,
    answer,
    explanation: buildExplanation(subject, topic, level, index, answer)
  };
}

function buildGeneratedQuestionBank(catalog) {
  const generated = [];
  for (const subject of catalog.subjects) {
    for (const topic of subject.topics) {
      for (const level of catalog.levels) {
        for (let index = 0; index < 8; index += 1) {
          generated.push(buildGeneratedQuestion(subject, topic, level, index));
        }
      }
    }
  }
  return generated;
}

const repairedQuestionOverrides = {
  "sequence-014": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>3 で割ると 2 余り，4 で割ると 3 余る自然数を，小さい方から順に並べた数列 {a<sub>n</sub>} を考える。</strong></p><p class="math-jp-line"><strong>(1)</strong> 一般項は</p><div class="math-answer-line"><span>a<sub>n</sub> = </span><span class="math-boxed-letter-wide">A</span><span>n − </span><span class="math-boxed-letter">B</span></div><p class="math-jp-line"><strong>(2)</strong> 初項から第 n 項までの和は</p><div class="math-answer-line"><span>a<sub>1</sub> + … + a<sub>n</sub> = n(</span><span class="math-boxed-letter">C</span><span>n + </span><span class="math-boxed-letter">D</span><span>)</span></div><p class="math-jp-line">また，その平方和は</p><div class="math-answer-line"><span>a<sub>1</sub><sup>2</sup> + … + a<sub>n</sub><sup>2</sup> = n(</span><span class="math-boxed-letter-wide">E</span><span>n<sup>2</sup> + </span><span class="math-boxed-letter-wide">F</span><span>n + </span><span class="math-boxed-letter-wide">G</span><span>)</span></div><p class="math-jp-line"><strong>(3)</strong> 異なる 2 項の積の和を S とすると</p><div class="math-answer-line"><span>S = </span><span class="inline-fraction"><span class="inline-fraction-top">n</span><span class="inline-fraction-bottom">2</span></span><span>(36n<sup>3</sup> + </span><span class="math-boxed-letter-wide">H</span><span>n<sup>2</sup> − 35n − </span><span class="math-boxed-letter-wide">I</span><span>)</span></div></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "3 で割ると 2 余り，4 で割ると 3 余る数は 12n−1 の形になる。和と平方和を求めたあと，(和)^2 = 平方和 + 2S を使えば S を整理できる。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "合同条件から一般項を作り，和・平方和・2 項積の和へ順に進む問題。",
    notes: "12n−1 型の数列を使った整理問題。"
  },
  "sequence-015": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>等差数列 {a<sub>n</sub>} と等比数列 {b<sub>n</sub>} があり，どちらも初項を c とし，それぞれ公差・公比を d とする。</strong></p><p class="math-jp-line"><strong>(1)</strong> a<sub>5</sub> = b<sub>3</sub>，a<sub>7</sub> = b<sub>5</sub> であるから</p><div class="math-answer-line"><span>c + </span><span class="math-boxed-letter">A</span><span>d = cd<sup><span class="math-boxed-letter">B</span></sup>，　c + </span><span class="math-boxed-letter">C</span><span>d = cd<sup><span class="math-boxed-letter">D</span></sup></span></div><p class="math-jp-line">が成り立つ。これより</p><div class="math-answer-line"><span>d = </span><span class="inline-fraction"><span class="inline-fraction-top">√<span class="math-boxed-letter">E</span></span><span class="inline-fraction-bottom"><span class="math-boxed-letter">F</span></span></span><span>，　c = </span><span class="math-boxed-letter">G</span><span>√</span><span class="math-boxed-letter">H</span></div><p class="math-jp-line"><strong>(2)</strong> {b<sub>n</sub>} の偶数番目の項を第 2m 項まで足すと</p><div class="math-answer-line"><span class="math-boxed-letter-wide">I</span><span>{(</span><span class="math-fraction"><span class="math-fraction-top">J</span><span class="math-fraction-bottom">K</span></span><span>)<sup>m</sup> − </span><span class="math-boxed-letter">L</span><span>}</span></div><p class="math-jp-line">となる。</p></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "a_5=c+4d，a_7=c+6d，b_3=cd^2，b_5=cd^4 とおいて連立すると d^2=3/2，d=√6/2，c=4√6。偶数番目の項は初項 12，公比 3/2 の等比数列になるので，和は 24{(3/2)^m−1}。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "等差条件と等比条件を同時に使って c, d を求め，偶数項の和へ進む問題。",
    notes: "等差と等比をつなぐ典型問題。"
  },
  "sequence-016": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>数列 {a<sub>n</sub>} は，a<sub>1</sub> = 1，a<sub>n+1</sub> = 2a<sub>n</sub><sup>2</sup> で定められている。</strong></p><p class="math-jp-line">このとき</p><div class="math-answer-line"><span>log<sub>10</sub>a<sub>n+1</sub> = log<sub>10</sub></span><span class="math-boxed-letter">A</span><span> + </span><span class="math-boxed-letter">B</span><span>log<sub>10</sub>a<sub>n</sub></span></div><p class="math-jp-line">である。ここで b<sub>n</sub> = log<sub>10</sub>a<sub>n</sub> + log<sub>10</sub>2 とおくと，{b<sub>n</sub>} は公比</p><div class="math-answer-line"><span class="math-boxed-letter">C</span></div><p class="math-jp-line">の等比数列になる。したがって</p><div class="math-answer-line"><span>log<sub>10</sub>a<sub>n</sub> = (</span><span class="math-boxed-letter">D</span><span><sup>n−1</sup> − </span><span class="math-boxed-letter">E</span><span>)log<sub>10</sub>2</span></div><p class="math-jp-line">であり，a<sub>n</sub> &lt; 10<sup>60</sup> を満たす最大の n は</p><div class="math-answer-line"><span class="math-boxed-letter-wide">F</span></div><p class="math-jp-line">である。</p></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "両辺の常用対数をとると log a_(n+1) = log 2 + 2 log a_n。b_n = log a_n + log 2 とおけば b_(n+1) = 2b_n となるので，そこから log a_n を求め，最後に 10^60 と比べればよい。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "漸化式を対数で一次化して，一般項と範囲を求める問題。",
    notes: "対数変換の典型。"
  },
  "sequence-017": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>数列 {a<sub>n</sub>} は，初項から第 n 項までの和が</strong></p><div class="math-answer-line"><span><span class="math-sigma">∑<sub>k=1</sub><sup>n</sup></span>a<sub>k</sub> = n<sup>2</sup> + 3n</span></div><p class="math-jp-line"><strong>を満たしている。</strong></p><p class="math-jp-line"><strong>(1)</strong> 一般項は</p><div class="math-answer-line"><span>a<sub>n</sub> = </span><span class="math-boxed-letter">A</span><span>n + </span><span class="math-boxed-letter">B</span></div><p class="math-jp-line"><strong>(2)</strong> b<sub>n</sub> = n<sup>2</sup> − 5n − 6 とおくと，b<sub>n</sub> &lt; 0 となる項は</p><div class="math-answer-line"><span class="math-boxed-letter">C</span><span>個あり，その和は −</span><span class="math-boxed-letter-wide">D</span></div><p class="math-jp-line"><strong>(3)</strong></p><div class="math-answer-line"><span><span class="math-sigma">∑<sub>k=1</sub><sup>n</sup></span></span><span class="inline-fraction"><span class="inline-fraction-top">k<sup>2</sup>b<sub>k</sub></span><span class="inline-fraction-bottom">a<sub>k</sub></span></span><span> = </span><span class="inline-fraction"><span class="inline-fraction-top">1</span><span class="inline-fraction-bottom"><span class="math-boxed-letter">E</span></span></span><span>n(n + </span><span class="math-boxed-letter">F</span><span>)(n<sup>2</sup> − </span><span class="math-boxed-letter">G</span><span>n − </span><span class="math-boxed-letter">H</span><span>)</span></div></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "S_n − S_(n−1) を計算すると a_n = 2n + 2。b_n = (n−6)(n+1) だから，負になるのは n=1 から 5 までで，和は −50。さらに k^2b_k/a_k を整理すると (k^3−6k^2)/2 になり，公式で和を求められる。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "部分和から一般項を出し，別の数列 b_n と組み合わせて和を整理する問題。",
    notes: "S_n から a_n を作る定番。"
  },
  "sequence-018": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>数列 {a<sub>n</sub>} は，a<sub>1</sub> = 1，a<sub>2</sub> = 10，</strong></p><div class="math-answer-line"><span>(a<sub>n</sub>)<sup>2</sup>a<sub>n-2</sub> = (a<sub>n-1</sub>)<sup>3</sup>　(n = 3,4, …)</span></div><p class="math-jp-line"><strong>を満たしている。</strong></p><p class="math-jp-line">b<sub>n</sub> = log<sub>10</sub>a<sub>n</sub> とおくと</p><div class="math-answer-line"><span class="math-boxed-letter">A</span><span>b<sub>n</sub> + b<sub>n-2</sub> = </span><span class="math-boxed-letter">B</span><span>b<sub>n-1</sub></span></div><p class="math-jp-line">である。したがって</p><div class="math-answer-line"><span>b<sub>n</sub> − b<sub>n-1</sub> = </span><span class="inline-fraction"><span class="inline-fraction-top">1</span><span class="inline-fraction-bottom"><span class="math-boxed-letter">C</span></span></span><span>(b<sub>n-1</sub> − b<sub>n-2</sub>)</span></div><p class="math-jp-line">となり，さらに</p><div class="math-answer-line"><span>b<sub>n</sub> = </span><span class="math-boxed-letter">D</span><span> − (</span><span class="inline-fraction"><span class="inline-fraction-top">1</span><span class="inline-fraction-bottom"><span class="math-boxed-letter">C</span></span></span><span>)<sup>n − </span><span class="math-boxed-letter">E</span><span></span></div><p class="math-jp-line">が得られる。よって</p><div class="math-answer-line"><span>lim a<sub>n</sub> = </span><span class="math-boxed-letter-wide">F</span></div></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "対数をとると 2b_n + b_(n−2) = 3b_(n−1)。差分 d_n = b_n − b_(n−1) をおくと d_n = (1/2)d_(n−1) なので，b_1=0，b_2=1 から b_n = 2 − (1/2)^(n−2)。したがって a_n は 100 に近づく。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "対数変換で線形漸化式に直し，極限まで求める問題。",
    notes: "積の漸化式を log で処理する。"
  },
  "sequence-019": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>1</sub> = 18，a<sub>n+1</sub> − 12a<sub>n</sub> + 3<sup>n+2</sup> = 0　(n = 1,2,3, …)</strong></p><p class="math-jp-line">を満たす数列 {a<sub>n</sub>} を考える。</p><p class="math-jp-line">b<sub>n</sub> = a<sub>n</sub> / </p><div class="math-answer-line"><span class="math-boxed-letter">A</span><span><sup>n</sup></span></div><p class="math-jp-line">とおくと，b<sub>1</sub> = </p><div class="math-answer-line"><span class="math-boxed-letter">B</span></div><p class="math-jp-line">であり，さらに</p><div class="math-answer-line"><span>b<sub>n+1</sub> − </span><span class="math-boxed-letter">C</span><span>b<sub>n</sub> + </span><span class="math-boxed-letter">D</span><span> = 0</span></div><p class="math-jp-line">が成り立つ。したがって</p><div class="math-answer-line"><span>a<sub>n</sub> = </span><span class="math-boxed-letter">E</span><span><sup>n</sup>(</span><span class="math-boxed-letter">F</span><span>・</span><span class="math-boxed-letter">G</span><span><sup>n−1</sup> + </span><span class="math-boxed-letter">H</span><span>)</span></div></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "3^n で割って b_n = a_n / 3^n とおくと，b_(n+1) − 4b_n + 3 = 0。さらに b_(n+1) − 1 = 4(b_n − 1) と変形すれば，b_n = 5・4^(n−1) + 1 がわかる。よって a_n = 3^n(5・4^(n−1) + 1)。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "3^n で割って一次化し，一般項を求める漸化式の問題。",
    notes: "差分の置き換えで整理する。"
  },
  "sequence-020": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>1</sub> = 2/9，</strong></p><div class="math-answer-line"><span>a<sub>n</sub> = </span><span class="inline-fraction"><span class="inline-fraction-top">(n + 1)(2n − 3)</span><span class="inline-fraction-bottom">3n(2n + 1)</span></span><span>a<sub>n−1</sub>　(n = 2,3,4, …)</span></div><p class="math-jp-line">を満たす数列 {a<sub>n</sub>} を考える。このとき</p><div class="math-answer-line"><span>a<sub>n</sub> = </span><span class="inline-fraction"><span class="inline-fraction-top">n + </span><span class="math-boxed-letter">A</span><span></span><span class="inline-fraction-bottom">3<sup>n + </sup><span class="math-boxed-letter">B</span><span>(</span><span class="math-boxed-letter">C</span><span>n − </span><span class="math-boxed-letter">D</span><span>)(2n + 1)</span></span></span></div><p class="math-jp-line">であり，したがって</p><div class="math-answer-line"><span><span class="math-sigma">∑<sub>n=1</sub><sup>∞</sup></span> a<sub>n</sub> = </span><span class="math-fraction"><span class="math-fraction-top">E</span><span class="math-fraction-bottom"><span class="math-boxed-letter-wide">F</span></span></span></div><p class="math-jp-line">である。</p></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "b_n = (n+1)/(3^n a_n) とおくと b_n = 3(2n−1)(2n+1) となるので，a_n = (n+1)/(3^(n+1)(2n−1)(2n+1))。さらに a_n を望ましい差の形に直すと無限和は 1/12 に収束する。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "積の漸化式を telescoping しやすい一般項に直し，無限和を求める問題。",
    notes: "一般項から部分分数型へ。"
  },
  "sequence-021": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>数列 {a<sub>n</sub>} の初項から第 n 項までの和を S<sub>n</sub> とする。S<sub>n</sub> = (n<sup>2</sup> − 17n)/4 を満たす数列 {a<sub>n</sub>} を考え，b<sub>n</sub> = a<sub>n</sub>a<sub>n+5</sub> とおく。</strong></p><p class="math-jp-line"><strong>(1)</strong> 一般項は</p><div class="math-answer-line"><span>a<sub>n</sub> = </span><span class="inline-fraction"><span class="inline-fraction-top">n − </span><span class="math-boxed-letter">B</span><span></span><span class="inline-fraction-bottom"><span class="math-boxed-letter">A</span></span></span></div><p class="math-jp-line">であるから</p><div class="math-answer-line"><span>b<sub>n</sub> = </span><span class="inline-fraction"><span class="inline-fraction-top">n<sup>2</sup> − </span><span class="math-boxed-letter-wide">CD</span><span>n + </span><span class="math-boxed-letter-wide">EF</span><span></span><span class="inline-fraction-bottom"><span class="math-boxed-letter">G</span></span></span></div><p class="math-jp-line">となる。</p><p class="math-jp-line"><strong>(2)</strong> T<sub>n</sub> = b<sub>1</sub> + … + b<sub>n</sub> とおくと，T<sub>n</sub> が最小になるのは</p><div class="math-answer-line"><span>n = </span><span class="math-boxed-letter">H</span><span> または </span><span class="math-boxed-letter">I</span></div><p class="math-jp-line">のときで，その最小値は</p><div class="math-answer-line"><span class="math-boxed-letter">J</span></div><p class="math-jp-line">である。</p></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "a_n = S_n − S_(n−1) より a_n = (n−9)/2。したがって b_n = ((n−9)(n−4))/4 = (n^2−13n+36)/4。T_n を順に見ると最小になるのは n=8 または 9 のときで，最小値は 6。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "部分和から一般項を作り，積の数列 b_n とその部分和 T_n の最小値を調べる問題。",
    notes: "T_n の最小化まで含む整理問題。"
  },
  "sequence-022": {
    question: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>n</sub> = 4n<sup>2</sup> + 5n − 6 で与えられる数列 {a<sub>n</sub>} を考える。</strong></p><p class="math-jp-line">このとき</p><div class="math-answer-line"><span>a<sub>n</sub> = (n + </span><span class="math-boxed-letter">A</span><span>)(</span><span class="math-boxed-letter">B</span><span>n − </span><span class="math-boxed-letter">C</span><span>)</span></div><p class="math-jp-line">と因数分解できる。したがって a<sub>n</sub> が 5 の倍数になるのは</p><div class="math-answer-line"><span>n = 5k − </span><span class="math-boxed-letter">D</span><span> または n = 5k − </span><span class="math-boxed-letter">E</span></div><p class="math-jp-line">である。初項から第 20 項までのうち，5 の倍数である項の個数は</p><div class="math-answer-line"><span class="math-boxed-letter">F</span></div><p class="math-jp-line">個であり，それらの和は</p><div class="math-answer-line"><span class="math-boxed-letter-wide">G</span></div><p class="math-jp-line">である。</p></div>`,
    explanation: {
      assetType: "text",
      assetLabel: "老师标准讲解",
      assetUrl: null,
      summary: "a_n = (n+2)(4n−3) と因数分解すると，5 の倍数になる条件は n ≡ 2,3 (mod 5)。1 から 20 までに 8 個あり，実際に足し合わせると 4048 になる。",
      steps: [],
      followUp: ""
    },
    rewrittenPrompt: "因数分解して合同条件に落とし，個数と総和を求める問題。",
    notes: "mod 5 の整理問題。"
  }
};

async function main() {
  const store = readStore();
  const questionBank = readQuestionBank();
  const quizCatalog = readQuizCatalog();
  const { student, courses, lessons } = store;
  const disabledQuestionIds = new Set([
    "sequence-023"
  ]);

  await prisma.message.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.quizSubmission.deleteMany();
  await prisma.questionExplanationStep.deleteMany();
  await prisma.questionExplanation.deleteMany();
  await prisma.questionChoice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionTopic.deleteMany();
  await prisma.questionSubject.deleteMany();
  await prisma.studentAbility.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.studentCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();

  const createdStudent = await prisma.student.create({
    data: {
      id: student.id,
      name: student.name,
      grade: student.grade,
      groupName: student.group,
      goal: student.goal,
      score: student.score,
      attendance: student.attendance,
      risk: student.risk,
      summary: student.summary,
      parentNote: student.parentNote,
      teacherFeedback: student.teacherFeedback
    }
  });

  await prisma.studentAbility.createMany({
    data: student.abilities.map((ability) => ({
      studentId: createdStudent.id,
      label: ability.label,
      value: ability.value
    }))
  });

  await prisma.quizSubmission.createMany({
    data: student.quizHistory.map((item) => ({
      studentId: createdStudent.id,
      name: item.name,
      score: item.score,
      note: item.note,
      dateLabel: item.date
    }))
  });

  await prisma.message.createMany({
    data: [
      ...student.teacherMessages.map((item) => ({
        studentId: createdStudent.id,
        channel: "teacher",
        fromRole: item.from,
        title: item.title,
        body: item.body,
        timeLabel: item.time
      })),
      ...student.aiMessages.map((item) => ({
        studentId: createdStudent.id,
        channel: "ai",
        fromRole: item.from,
        title: item.title,
        body: item.body,
        timeLabel: item.time
      }))
    ]
  });

  for (const course of courses) {
    await prisma.course.create({
      data: {
        id: course.id,
        title: course.title,
        subject: course.subject,
        totalLessons: course.totalLessons,
        completedLessons: course.completedLessons,
        nextLessonAt: course.nextLesson,
        schedule: course.schedule,
        teacherName: course.teacher
      }
    });

    await prisma.studentCourse.create({
      data: {
        studentId: createdStudent.id,
        courseId: course.id
      }
    });
  }

  for (const lesson of lessons) {
    const course = courses.find((item) => item.lessonIds.includes(lesson.id));
    if (!course) continue;

    await prisma.lesson.create({
      data: {
        id: lesson.id,
        courseId: course.id,
        dateLabel: lesson.date,
        weekday: lesson.weekday,
        timeLabel: lesson.time,
        title: lesson.title,
        ppt: lesson.ppt,
        notes: lesson.notes,
        completion: lesson.completion,
        understanding: lesson.understanding,
        homeworkStatus: lesson.homeworkStatus,
        requiresHomework: lesson.requiresHomework !== false,
        wrongCount: lesson.wrongCount,
        metrics: lesson.metrics,
        highlights: lesson.highlights,
        mistakes: lesson.mistakes
      }
    });
  }

  for (const item of student.homework) {
    await prisma.homework.create({
      data: {
        studentId: createdStudent.id,
        lessonId: item.title.includes("一次函数") ? "lesson-1" : null,
        title: item.title,
        status: item.status,
        score: item.score,
        content: null,
        dateLabel: item.date
      }
    });
  }

  for (const subject of quizCatalog.subjects) {
    await prisma.questionSubject.create({
      data: {
        id: subject.id,
        label: subject.label,
        shortLabel: subject.shortLabel,
        accent: subject.accent,
        description: subject.description,
        mapTitle: subject.mapTitle
      }
    });

    for (const topic of subject.topics) {
      await prisma.questionTopic.create({
        data: {
          id: topic.id,
          subjectId: subject.id,
          label: topic.label,
          summary: topic.summary,
          keywords: topic.keywords
        }
      });
    }
  }

  const allQuestions = questionBank.questions.map((question) => ({
    ...question,
    ...(repairedQuestionOverrides[question.id] || {}),
    subjectId: question.subjectId || "math2",
    topicId: question.topicId || "sequence",
    levelId: question.levelId || "basic"
  }));

  for (const question of allQuestions) {
    await prisma.question.create({
      data: {
        id: question.id,
        subjectId: question.subjectId,
        topicId: question.topicId,
        levelId: question.levelId,
        abilityIndex: Number.isInteger(question.abilityIndex) ? question.abilityIndex : 0,
        type: question.type,
        prompt: question.question,
        answer: question.answer,
        blankLabels: question.blankLabels || null,
        active: !disabledQuestionIds.has(question.id),
        choices: {
          create: (question.choices || []).map((choice, index) => ({
            label: choice,
            sortOrder: index
          }))
        },
        explanation: question.explanation ? {
          create: {
            assetType: question.explanation.assetType,
            assetLabel: question.explanation.assetLabel,
            assetUrl: question.explanation.assetUrl || null,
            summary: question.explanation.summary,
            followUp: question.explanation.followUp || null,
            steps: {
              create: (question.explanation.steps || []).map((step, index) => ({
                lineLabel: step.line,
                title: step.title,
                detail: step.detail,
                sortOrder: index
              }))
            }
          }
        } : undefined
      }
    });
  }

  console.log("Student S1 seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
