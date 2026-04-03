const fs = require("fs");
const path = require("path");

const manifestPath = path.join(__dirname, "..", "data", "sequence-question-manifest.csv");

const updates = {
  "sequence-014": {
    original_prompt: "3で割ると余りが2，4で割ると余りが3となる自然数を小さい順に並べた数列を考える。",
    rewritten_prompt: "合同条件を満たす自然数列の一般項・和・積の和を求める。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>3で割ると余りが2，4で割ると余りが3となる自然数を小さい順に並べた数列 {a<sub>n</sub>} を考える。</strong></p><p class="math-jp-line">一般項は a<sub>n</sub> = <span class="math-boxed-letter-wide">A</span>n − <span class="math-boxed-letter">B</span> である。</p><p class="math-jp-line">また，初項から第n項までの和は n(<span class="math-boxed-letter">C</span>n + <span class="math-boxed-letter">D</span>)，各項の2乗の和は n(<span class="math-boxed-letter-wide">E</span>n<sup>2</sup> + <span class="math-boxed-letter-wide">F</span>n + <span class="math-boxed-letter-wide">G</span>) である。</p><p class="math-jp-line">異なる2項の積の総和をSとすると，S = n/2(36n<sup>3</sup> + <span class="math-boxed-letter-wide">H</span>n<sup>2</sup> − 35n − <span class="math-boxed-letter-wide">I</span>) である。</p></div>`,
    teacher_explanation: "最小の項は11，公差は12なので a_n = 12n - 1。和と2乗和を公式で出し，(和)^2 = 2S + 2乗和 を使えば積の総和が求まる。",
    answer: "12,1,6,5,48,60,13,12,13",
    blank_labels: "A|B|C|D|E|F|G|H|I",
    notes: "合同条件から始まる数列整理問題。",
    status: "ready_for_import"
  },
  "sequence-015": {
    original_prompt: "等差数列 {a_n} と等比数列 {b_n} は，どちらも初項が c で，共通差と公比が同じ d である。",
    rewritten_prompt: "等差条件と等比条件から c と d を決め，有理数となる項の和を求める。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>等差数列 {a<sub>n</sub>} と等比数列 {b<sub>n</sub>} は，どちらも初項がcで，共通差と公比が同じdである。</strong></p><p class="math-jp-line">a<sub>5</sub> = b<sub>3</sub>, a<sub>7</sub> = b<sub>5</sub> のとき，c + <span class="math-boxed-letter">A</span>d = cd<sup><span class="math-boxed-letter">B</span></sup>，c + <span class="math-boxed-letter">C</span>d = cd<sup><span class="math-boxed-letter">D</span></sup>。</p><p class="math-jp-line">これより d = √<span class="math-boxed-letter">E</span> / <span class="math-boxed-letter">F</span>，c = <span class="math-boxed-letter">G</span>√<span class="math-boxed-letter">H</span> である。</p><p class="math-jp-line">さらに，有理数となる項の和は <span class="math-boxed-letter-wide">I</span>{(<span class="math-fraction"><span class="math-fraction-top">J</span><span class="math-fraction-bottom">K</span></span>)<sup>m</sup> − <span class="math-boxed-letter">L</span>} となる。</p></div>`,
    teacher_explanation: "a_5=c+4d，a_7=c+6d，b_3=cd^2，b_5=cd^4 から d^2=3/2，d=√6/2，c=4√6。偶数番目の b_n だけが有理数となり，その和は 24((3/2)^m−1)。",
    answer: "4,2,6,4,6,2,4,6,24,3,2,1",
    blank_labels: "A|B|C|D|E|F|G|H|I|J|K|L",
    notes: "等差と等比を同時に扱う問題。",
    status: "ready_for_import"
  },
  "sequence-016": {
    original_prompt: "a_1 = 1，a_(n+1) = 2a_n^2 で定まる数列について，a_n < 10^60 を満たす自然数 n の個数を求める。",
    rewritten_prompt: "常用対数をとって等比型に直し，条件を満たす n の個数を数える。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>1</sub> = 1，a<sub>n+1</sub> = 2a<sub>n</sub><sup>2</sup> で定まる数列 {a<sub>n</sub>} を考える。</strong></p><p class="math-jp-line">log<sub>10</sub>a<sub>n+1</sub> = log<sub>10</sub><span class="math-boxed-letter">A</span> + <span class="math-boxed-letter">B</span>log<sub>10</sub>a<sub>n</sub> であり，b<sub>n</sub> = log<sub>10</sub>a<sub>n</sub> + log<sub>10</sub>2 とおくと公比 <span class="math-boxed-letter">C</span> の等比数列になる。</p><p class="math-jp-line">したがって log<sub>10</sub>a<sub>n</sub> = (<span class="math-boxed-letter">D</span><sup>n−1</sup> − <span class="math-boxed-letter">E</span>)log<sub>10</sub>2 であり，a<sub>n</sub> &lt; 10<sup>60</sup> を満たす n の個数は <span class="math-boxed-letter-wide">F</span> 個である。</p></div>`,
    teacher_explanation: "対数をとると log a_(n+1)=log2+2log a_n。b_n=log a_n+log2 とおけば b_(n+1)=2b_n。よって log a_n=(2^(n-1)-1)log2 となり，条件を満たす n は8個。",
    answer: "2,2,2,2,1,8",
    blank_labels: "A|B|C|D|E|F",
    notes: "対数で漸化式を一次化する問題。",
    status: "ready_for_import"
  },
  "sequence-017": {
    original_prompt: "初項から第 n 項までの和が Σa_k = n^2 + 3n で表される数列を考える。",
    rewritten_prompt: "和から一般項を出し，別の二次式 b_n と組み合わせた総和を求める。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>初項から第n項までの和が Σa<sub>k</sub> = n<sup>2</sup> + 3n である数列 {a<sub>n</sub>} を考える。</strong></p><p class="math-jp-line">一般項は a<sub>n</sub> = <span class="math-boxed-letter">A</span>n + <span class="math-boxed-letter">B</span>。</p><p class="math-jp-line">b<sub>n</sub> = n<sup>2</sup> − 5n − 6 とすると，b<sub>n</sub> &lt; 0 となる項は <span class="math-boxed-letter">C</span> 個で，その和は −<span class="math-boxed-letter-wide">D</span>。</p><p class="math-jp-line">さらに Σ(k<sup>2</sup>b<sub>k</sub>/a<sub>k</sub>) = (1/<span class="math-boxed-letter">E</span>)n(n + <span class="math-boxed-letter">F</span>)(n<sup>2</sup> − <span class="math-boxed-letter">G</span>n − <span class="math-boxed-letter">H</span>) である。</p></div>`,
    teacher_explanation: "和の差をとれば a_n = 2n + 2。b_n = (n-6)(n+1) だから負になるのは n=1 から5までで和は -50。さらに k^2b_k/a_k を整理して総和公式を使う。",
    answer: "2,2,5,50,8,1,7,4",
    blank_labels: "A|B|C|D|E|F|G|H",
    notes: "和から一般項を作る問題。",
    status: "ready_for_import"
  },
  "sequence-018": {
    original_prompt: "正の数列 a_1=1, a_2=10, (a_n)^2 a_(n-2) = (a_(n-1))^3 から lim a_n を求める。",
    rewritten_prompt: "両辺の対数をとって階差数列を作り，極限値を復元する。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>1</sub> = 1，a<sub>2</sub> = 10，(a<sub>n</sub>)<sup>2</sup>a<sub>n-2</sub> = (a<sub>n-1</sub>)<sup>3</sup> を満たす正の数列を考える。</strong></p><p class="math-jp-line">b<sub>n</sub> = log<sub>10</sub>a<sub>n</sub> とおくと <span class="math-boxed-letter">A</span>b<sub>n</sub> + b<sub>n-2</sub> = <span class="math-boxed-letter">B</span>b<sub>n-1</sub>，したがって b<sub>n</sub> − b<sub>n-1</sub> = (1/<span class="math-boxed-letter">C</span>)(b<sub>n-1</sub> − b<sub>n-2</sub>)。</p><p class="math-jp-line">これより b<sub>n</sub> = <span class="math-boxed-letter">D</span> − (1/<span class="math-boxed-letter">C</span>)<sup>n−<span class="math-boxed-letter">E</span></sup>，よって lim a<sub>n</sub> = <span class="math-boxed-letter-wide">F</span> である。</p></div>`,
    teacher_explanation: "対数をとると 2b_n + b_(n-2) = 3b_(n-1)。差分 d_n=b_n-b_(n-1) とおけば d_n=(1/2)d_(n-1)。b_1=0,b_2=1 より b_n=2-(1/2)^(n-2)，極限は100。",
    answer: "2,3,2,2,2,100",
    blank_labels: "A|B|C|D|E|F",
    notes: "対数と階差を使う極限問題。",
    status: "ready_for_import"
  },
  "sequence-019": {
    original_prompt: "a_1 = 18，a_(n+1) − 12a_n + 3^(n+2) = 0 で定まる数列 {a_n} の一般項を求める。",
    rewritten_prompt: "指数で割って一次漸化式に変え，等比数列へ落として一般項を作る。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>1</sub> = 18，a<sub>n+1</sub> − 12a<sub>n</sub> + 3<sup>n+2</sup> = 0 で定まる数列 {a<sub>n</sub>} を考える。</strong></p><p class="math-jp-line">b<sub>n</sub> = a<sub>n</sub> / <span class="math-boxed-letter">A</span><sup>n</sup> とおくと，b<sub>1</sub> = <span class="math-boxed-letter">B</span>，b<sub>n+1</sub> − <span class="math-boxed-letter">C</span>b<sub>n</sub> + <span class="math-boxed-letter">D</span> = 0。</p><p class="math-jp-line">したがって a<sub>n</sub> = <span class="math-boxed-letter">E</span><sup>n</sup>(<span class="math-boxed-letter">F</span>·<span class="math-boxed-letter">G</span><sup>n−1</sup> + <span class="math-boxed-letter">H</span>)。</p></div>`,
    teacher_explanation: "3^n で割ると b_(n+1)-4b_n+3=0。b_(n+1)-1=4(b_n-1) と直すと等比数列になり，a_n=3^n(5·4^(n-1)+1)。",
    answer: "3,6,4,3,3,5,4,1",
    blank_labels: "A|B|C|D|E|F|G|H",
    notes: "指数で割る漸化式の定番。",
    status: "ready_for_import"
  },
  "sequence-020": {
    original_prompt: "a_1 = 2/9，a_n = ((n+1)(2n−3))/(3n(2n+1)) a_(n−1) に対して，一般項と無限級数を求める。",
    rewritten_prompt: "補助数列を導入して一般項を作り，差分表示で無限和を出す。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>1</sub> = 2/9，a<sub>n</sub> = ((n+1)(2n−3))/(3n(2n+1)) a<sub>n−1</sub> とする。</strong></p><p class="math-jp-line">一般項は a<sub>n</sub> = (n + <span class="math-boxed-letter">A</span>) / [3<sup>n + <span class="math-boxed-letter">B</span></sup>(<span class="math-boxed-letter">C</span>n − <span class="math-boxed-letter">D</span>)(2n + 1)] と表せる。</p><p class="math-jp-line">また，無限級数の和は <span class="math-fraction"><span class="math-fraction-top">E</span><span class="math-fraction-bottom"><span class="math-boxed-letter-wide">F</span></span></span> である。</p></div>`,
    teacher_explanation: "b_n=(n+1)/(3^n a_n) とおくと比が簡単になり，一般項が出る。さらに c_n を導入すると差分和になり，無限和は 1/12。",
    answer: "1,1,2,1,1,12",
    blank_labels: "A|B|C|D|E|F",
    notes: "補助数列と telescoping。",
    status: "ready_for_import"
  },
  "sequence-021": {
    original_prompt: "初項から第n項までの和 S_n = (n^2 − 17n)/4 をもつ数列 {a_n} について，b_n = a_n a_(n+5) とおく。",
    rewritten_prompt: "和から a_n を出し，積 b_n とその総和 T_n の最小値を調べる。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>初項から第n項までの和 S<sub>n</sub> が S<sub>n</sub> = (n<sup>2</sup> − 17n)/4 で表される数列 {a<sub>n</sub>} に対して，b<sub>n</sub> = a<sub>n</sub>a<sub>n+5</sub> と定める。</strong></p><p class="math-jp-line">一般項は a<sub>n</sub> = (n − <span class="math-boxed-letter">B</span>) / <span class="math-boxed-letter">A</span>，したがって b<sub>n</sub> = (n<sup>2</sup> − <span class="math-boxed-letter-wide">CD</span>n + <span class="math-boxed-letter-wide">EF</span>) / <span class="math-boxed-letter">G</span>。</p><p class="math-jp-line">T<sub>n</sub> = b<sub>1</sub> + … + b<sub>n</sub> が最小になるのは n = <span class="math-boxed-letter">H</span> または <span class="math-boxed-letter">I</span> で，その最小値は <span class="math-boxed-letter">J</span> である。</p></div>`,
    teacher_explanation: "S_n−S_(n−1) から a_n=(n−9)/2。よって b_n=(n−9)(n−4)/4=(n^2−13n+36)/4。b_n は 5〜8 で負なので T_n は 8 と 9 で最小になり，値は 6。",
    answer: "2,9,13,36,4,8,9,6",
    blank_labels: "A|B|CD|EF|G|H|I|J",
    notes: "和→一般項→最小値。",
    status: "ready_for_import"
  },
  "sequence-022": {
    original_prompt: "第n項が a_n = 4n^2 + 5n − 6 で与えられる数列について，5の倍数となる項を調べる。",
    rewritten_prompt: "因数分解と合同条件を使って，5の倍数になる項を分類する。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>第n項が a<sub>n</sub> = 4n<sup>2</sup> + 5n − 6 で与えられる数列 {a<sub>n</sub>} を考える。</strong></p><p class="math-jp-line">a<sub>n</sub> = (n + <span class="math-boxed-letter">A</span>)(<span class="math-boxed-letter">B</span>n − <span class="math-boxed-letter">C</span>) と因数分解できる。したがって a<sub>n</sub> が 5 の倍数になるのは n = 5k − <span class="math-boxed-letter">D</span> または n = 5k − <span class="math-boxed-letter">E</span> のときである。</p><p class="math-jp-line">最初の20項でそのような項の個数は <span class="math-boxed-letter">F</span> 個，和は <span class="math-boxed-letter-wide">G</span> である。</p></div>`,
    teacher_explanation: "a_n=(n+2)(4n−3) と因数分解できるので，n+2 または 4n−3 が 5 の倍数。1〜20 では 8 個あり，和は 4048。",
    answer: "2,4,3,2,3,8,4048",
    blank_labels: "A|B|C|D|E|F|G",
    notes: "合同条件で分類する問題。",
    status: "ready_for_import"
  },
  "sequence-023": {
    original_prompt: "a_n = 4n^2 + 5n − 6 で与えられる数列について，最初の20項の中の5の倍数の和を求める。",
    rewritten_prompt: "5の倍数となる2つのケースを分けて，合計を別表現でも確認する。",
    display_html: `<div class="math-rich-prompt"><p class="math-jp-line"><strong>a<sub>n</sub> = 4n<sup>2</sup> + 5n − 6 の最初の20項を考える。</strong></p><p class="math-jp-line">5の倍数となる項を2つのケースに分けて足し合わせると S = <span class="math-boxed-letter-wide">A</span> となる。したがって，第22題で求めた総和も <span class="math-boxed-letter-wide">B</span> である。</p></div>`,
    teacher_explanation: "n=5k−2 と n=5k−3 の2系列に分けて a_n を足し上げると，どちらも4項ずつ現れ，合計は 4048 で一致する。",
    answer: "4048,4048",
    blank_labels: "A|B",
    notes: "第22題の結果確認。",
    status: "ready_for_import"
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
const statusIndex = header.indexOf("status");

const patched = lines.map((line, index) => {
  if (index === 0 || !line.trim()) {
    return line;
  }
  const values = parseCsvLine(line);
  const id = values[keyIndex];
  const update = updates[id];
  if (!update) {
    return line;
  }
  for (const [field, value] of Object.entries(update)) {
    const fieldIndex = header.indexOf(field);
    if (fieldIndex >= 0) {
      values[fieldIndex] = value;
    }
  }
  values[statusIndex] = "ready_for_import";
  return serializeCsvLine(values);
});

fs.writeFileSync(manifestPath, `\uFEFF${patched.join("\r\n")}`, "utf8");
console.log("repaired sequence-014..023");
