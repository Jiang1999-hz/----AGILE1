# Question Bank Workflow

这份文档记录当前项目里“录题、修题、导库、验证”的实际工作流。

## 1. 录题入口

当前统一从：

- `data/question-bank.json`

录入或修正题目。

不要优先改数据库里的单条记录，因为后续重新 seed 会被源文件覆盖。

## 2. 录题原则

### 题干

- 题干要能直接读懂
- 要明确条件、公式、提问位置
- 尽量贴近原 PDF 的阅读顺序
- 不保留 `???`、乱码、残缺 OCR 结果

### 空位

- 空位直接放在题面里
- 用 `math-boxed-letter` 或 `math-boxed-letter-wide`
- 不额外在题目底部重复列一排 `A B C D`

### 分数和公式

- 分数统一用 `inline-fraction` 或 `math-fraction`
- 公式行优先放进 `math-answer-line`
- 目标是看起来像讲义，不像代码块

### 答案

- `answer` 必须和 `blankLabels` 顺序一致
- 多空答案统一用英文逗号连接

示例：

```json
{
  "blankLabels": ["J", "KL", "M", "N"],
  "answer": "6,9,2,1"
}
```

## 3. 修题步骤

1. 在 `data/question-bank.json` 找到对应题号。
2. 重写 `question`，必要时同时补 `blankLabels`。
3. 校对 `answer`。
4. 把 `explanation.summary` 改成学生能读懂的版本。
5. 如果旧 seed 里有覆盖逻辑，也一起清掉。

## 4. 导库

当前导库命令：

```powershell
npm run db:seed
```

如果 schema 有变化，先执行：

```powershell
npm run db:push -- --accept-data-loss
npm run db:generate
```

## 5. 验证

导库后至少做三层验证：

### 接口验证

检查 `/api/quiz/session` 返回的题面是不是最新版本。

### 页面验证

确认这几件事：

- 题干顺序是否正常
- 空位是否醒目
- 分数线是否没有断掉
- 结果页的答案显示是否按空位拆开

### 内容验证

确认：

- 题目在问哪里
- 标准答案顺序是否正确
- 标准解答有没有明显机器语气或乱码

## 6. 当前已踩过的坑

- 只改数据库，不改 `question-bank.json`，重新 seed 后会被覆盖
- 题面里额外再列一排空位，会打断阅读节奏
- OCR 损坏后的问号文本不能靠 CSS 修复，只能人工补正
- 标准答案如果和 `blankLabels` 顺序不一致，结果页会全部错位

## 7. 推荐顺序

以后继续录题时，建议始终按这个顺序：

1. 先修题面
2. 再修答案
3. 再修标准解答
4. 再导库
5. 最后进页面验证
