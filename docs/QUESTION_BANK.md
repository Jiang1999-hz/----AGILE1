# Question Bank

当前题库主文件：

- `data/question-bank.json`

数据库导入入口：

- `scripts/seed-student-s1.js`

## 一道题的数据结构

每道题至少包含这些字段：

- `id`
- `subjectId`
- `topicId`
- `levelId`
- `type`
- `question`
- `answer`
- `blankLabels`
- `explanation`

## 字段说明

### `question`

题面使用 HTML 字符串存储，当前主要是数学讲义风格：

- `math-rich-prompt`
- `math-jp-line`
- `math-answer-line`
- `math-boxed-letter`
- `inline-fraction`
- `math-fraction`

目标是让题面尽量接近原 PDF 的阅读顺序，而不是普通文本堆叠。

### `answer`

填空题答案统一按空位顺序保存：

- 单空：`"4"`
- 多空：`"6,9,2,1"`
- 连续字母空位也按一个空处理
  - 例如 `KL`、`CDE`、`HIJ`

前端显示时会按 `blankLabels` 拆开。

### `blankLabels`

表示题面中的空位标签，例如：

```json
["A", "B", "C"]
```

或者：

```json
["J", "KL", "M", "N"]
```

### `explanation`

当前保留：

- `assetType`
- `assetLabel`
- `assetUrl`
- `summary`
- `steps`
- `followUp`

目前学生端主要使用 `summary`，后续会继续补完整的分步讲解。

## 当前原则

- 题干必须让学生一眼看出“题目在问什么”
- 空位必须和题面融合，不额外重复列一遍
- 公式优先做成讲义式排版
- 标准答案必须和 `blankLabels` 顺序严格一致
- 如果原始 OCR 内容已坏，直接人工补正，不再保留乱码文本
