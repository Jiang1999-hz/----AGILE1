## 数列知识点方案

### 目标

- 让每道题不只是一道题，而是挂到一个明确的“能力点”上。
- 让错题本能从“我错了哪题”升级成“我不会哪一类题”。
- 让后续 AI 讲题可以围绕知识点解释，而不只是围绕答案。

### 设计原则

- 每道题必须有 1 个主知识点。
- 每道题可以有 0 到 2 个辅助知识点。
- 第一版只做数列，不一次铺开到全部科目。
- 第一版先用独立数据文件维护，不急着改数据库 schema。

### 第一版知识点层级

#### 第一梯队：核心基础

- `ap-basic`
  等差数列基础
- `gp-basic`
  等比数列基础
- `sum-basic`
  前 n 项和

#### 第二梯队：大题高频点

- `sum-sn-an`
  `S_n` 与 `a_n` 转化
- `recurrence-transform`
  递推式变形
- `log-transform`
  对数变换递推

#### 第三梯队：进阶技巧

- `special-sum`
  复杂构造与特殊求和
- `extreme-inequality`
  最值与不等式
- `limit`
  极限

#### 第四梯队：数论与条件构造

- `number-theory-sequence`
  数论型数列

### 数据落点

- 知识点字典与题目映射放在：
  [data/sequence-knowledge-map.json](C:/Users/Jiang/.codex/worktrees/e9ff/New%20project/data/sequence-knowledge-map.json)

文件里包含两部分：

- `knowledgePoints`
  数列知识点字典
- `questionMappings`
  现有 `sequence-001` 到 `sequence-023` 的题目挂载关系

### 当前挂载策略

- 基础计算、已知项求通项、等差等比中项：
  挂到 `ap-basic` 或 `gp-basic`
- 求和、平方和、和的整理：
  挂到 `sum-basic`
- 已知 `S_n` 反推 `a_n`：
  挂到 `sum-sn-an`
- 递推化等比、除指数项、平移构造：
  挂到 `recurrence-transform`
- 取对数再转化：
  挂到 `log-transform`
- 裂项、交错和、两两乘积和：
  挂到 `special-sum`
- 最小值、项数判断、范围问题：
  挂到 `extreme-inequality`
- 极限单独作为辅助点使用较多：
  多数时候配在 `log-transform` 或 `sum-sn-an` 后面
- 倍数、余数、同余筛选：
  挂到 `number-theory-sequence`

### 后续接入顺序

1. 错题本记录错题时，同时写入题目的主知识点和辅助知识点。
2. 错题本页面支持按知识点筛选。
3. 单独增加“知识点”tab，展示：
   - 知识点名称
   - 相关题数
   - 错题数
   - 最近练习记录
4. 再决定是否把知识点正式迁到数据库表里。

### 为什么第一版不用数据库表

- 现在题库规模还不大，数列题只有 23 道。
- 先把知识点字典和题目挂载定下来，比一开始改 schema 更稳。
- 等错题本和知识点页面方向跑顺后，再迁到数据库成本更低。
