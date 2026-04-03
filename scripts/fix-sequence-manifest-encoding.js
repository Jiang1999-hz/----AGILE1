const fs = require("fs");
const path = require("path");

const manifestPath = path.join(__dirname, "..", "data", "sequence-question-manifest.csv");

const updates = {
  "sequence-006": {
    original_prompt: "初項 7，公比 2 の等比数列 {a_n} と，初項 13，公差 15 の等差数列 {b_n} を考え，共通項を調べる。",
    rewritten_prompt: "等比数列と等差数列の情報を使い，個数・一般項・共通項を整理して求める。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>(1) 初項 7，公比 2 の等比数列 {a<sub>n</sub>} (n = 1,2,3, …) を考える。</strong></p><p class="math-jp-line">値が 1000 より小さい項は全部で L 個あり，それらの項の中で最大の値は MNO である。</p><p class="math-jp-line"><strong>(2) 初項 13，公差 15 の等差数列 {b<sub>n</sub>} (n = 1,2,3, …) を考える。</strong></p><div class="math-answer-line"><span>b<sub>n</sub> = </span><span class="math-boxed-letter-wide">PQ</span><span>n - </span><span class="math-boxed-letter">R</span></div><p class="math-jp-line">であり，</p><div class="math-answer-line"><span>b<sub>66</sub> = </span><span class="math-boxed-letter-wide">STU</span></div><p class="math-jp-line">である。</p><p class="math-jp-line"><strong>(3)</strong> (1) の数列 {a<sub>n</sub>} にも (2) の数列 {b<sub>n</sub>} にも現れる数の中で，最小の値は VW であり，1000 より小さい最大の値は XYZ である。</p></div>`,
    teacher_explanation: "等比数列は 7, 14, 28, … と増えるので 1000 未満を順に数える。等差数列は一般項を作って b_66 を出し，共通する値は両方に現れる 28 を確認する。",
    notes: "7 と 13 を使う複合問題。display_html に 3 段構成を保存。"
  },
  "sequence-007": {
    original_prompt: "4, p, q がこの順に等差数列をなし，p, q, 18 がこの順に等比数列をなす。",
    rewritten_prompt: "4, p, q の等差条件と p, q, 18 の等比条件を連立して，p・q・公差・公比を求める。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>p，q を正の数とする。</strong></p><p class="math-jp-line">3 つの数 4，p，q はこの順に等差数列をなし，3 つの数 p，q，18 はこの順に等比数列をなす。このとき</p><div class="math-answer-line"><span>p = </span><span class="math-boxed-letter">J</span><span>， q = </span><span class="math-boxed-letter-wide">KL</span></div><p class="math-jp-line">であり，等差数列の公差は</p><div class="math-answer-line"><span class="math-boxed-letter">M</span></div><p class="math-jp-line">で，等比数列の公比は</p><div class="math-fraction"><div class="math-fraction-top">N</div><div class="math-fraction-bottom">O</div></div><p class="math-jp-line">である。</p></div>`,
    teacher_explanation: "等差条件から q = 2p - 4，等比条件から q^2 = 18p とおける。これを連立して p = 8，q = 12 を求めれば，公差は 4，公比は 3/2 とわかる。",
    notes: "等差と等比を同時に使う条件整理問題。"
  },
  "sequence-008": {
    original_prompt: "数列 {a_n} の和 S_n = n a_n - 2n^3 + 2n を用いて，一般項と極限を求める。",
    rewritten_prompt: "和 S_n の条件式から差分 a_n - a_(n-1) を作り，一般項と極限を順に求める。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>数列 {a<sub>n</sub>} の初項から第 n 項までの和を S<sub>n</sub> とする。</strong></p><p class="math-jp-line">条件</p><div class="math-answer-line"><span>a<sub>1</sub> = 1，　S<sub>n</sub> = n a<sub>n</sub> - 2n<sup>3</sup> + 2n　(n = 1,2,3, …)</span></div><p class="math-jp-line">を満たす数列 {a<sub>n</sub>} を考える。このとき</p><div class="math-answer-line"><span>S<sub>n-1</sub> = (n - 1)a<sub>n-1</sub> - </span><span class="math-boxed-letter">G</span><span>n<sup>3</sup> + </span><span class="math-boxed-letter">H</span><span>n<sup>2</sup> - </span><span class="math-boxed-letter">I</span><span>n</span></div><p class="math-jp-line">であるから</p><div class="math-answer-line"><span>a<sub>n</sub> - a<sub>n-1</sub> = </span><span class="math-boxed-letter">J</span><span>n　(n = 2,3,4, …)</span></div><p class="math-jp-line">が成り立つ。したがって</p><div class="math-answer-line"><span>a<sub>n</sub> = </span><span class="math-boxed-letter">K</span><span>n<sup>2</sup> + </span><span class="math-boxed-letter">L</span><span>n - </span><span class="math-boxed-letter">M</span><span>　(n = 1,2,3, …)</span></div><p class="math-jp-line">である。また</p><div class="math-answer-line"><span>lim<sub>n→∞</sub> </span><span class="inline-fraction"><span class="inline-fraction-top">S<sub>n</sub></span><span class="inline-fraction-bottom">n a<sub>n</sub></span></span><span> = </span><span class="math-fraction"><span class="math-fraction-top">N</span><span class="math-fraction-bottom">O</span></span></div><p class="math-jp-line">である。</p></div>`,
    teacher_explanation: "S_n - S_(n-1) = a_n を使って差をとると a_n - a_(n-1) = 6n が出る。そこから一般項 a_n = 3n^2 + 3n - 5 を求め，最後に S_n/(n a_n) の最高次項比を見れば 1/3。",
    notes: "和から一般項を復元する典型問題。極限までまとめて扱う。"
  }
};

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  values.push(current);
  return values;
}

function serializeCsvLine(values) {
  return values.map((value) => {
    const stringValue = value == null ? "" : String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  }).join(",");
}

const raw = fs.readFileSync(manifestPath, "utf8");
const lines = raw.replace(/^\uFEFF/, "").split(/\r?\n/);
const header = parseCsvLine(lines[0]);
const keyIndex = header.indexOf("question_id");

const patched = lines.map((line, index) => {
  if (index === 0 || !line.trim()) {
    return line;
  }
  const values = parseCsvLine(line);
  const id = values[keyIndex];
  if (!updates[id]) {
    return line;
  }
  const update = updates[id];
  for (const [field, value] of Object.entries(update)) {
    const fieldIndex = header.indexOf(field);
    if (fieldIndex >= 0) {
      values[fieldIndex] = value;
    }
  }
  return serializeCsvLine(values);
});

fs.writeFileSync(manifestPath, `\uFEFF${patched.join("\r\n")}`, "utf8");
console.log("Fixed sequence-question-manifest.csv for sequence-006..008");
