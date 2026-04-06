# Juku AI Demo

这是一个面向私塾场景的本地演示项目，当前重点是学生做题主线、题库录入和讲题体验。

## 当前重点

- 学生端在线做题
- 5 题一组的结果页复盘
- 题库支持多空填空题
- 题目、标准答案、标准解答持久化到 PostgreSQL

## 本地运行

```powershell
node .\server.js
```

浏览器打开：

```text
http://localhost:4173
```

## 数据来源

- `data/student-s1.json`
  - 学生示例数据
- `data/question-bank.json`
  - 当前主用题库源文件
- `data/quiz-catalog.json`
  - 学科、知识点、难度目录

## 题库相关文档

- `docs/QUESTION_BANK.md`
  - 题库结构说明
- `docs/QUESTION_BANK_WORKFLOW.md`
  - 题目录入、修题、导库、验证工作流

## 当前代码重点

- `server.js`
  - 本地 Node 服务与 API
- `app.js`
  - 前端主状态与页面编排
- `src/features/student-quiz-experience.js`
  - 学生做题与结果页 UI
- `styles.css`
  - 全局样式与数学题排版
- `scripts/seed-student-s1.js`
  - 数据库 seed 入口

## 下一步

- 继续重写标准解答，让讲义风格更统一
- 重做 AI 讲题模块
- 把 AI 回答严格绑定到题目上下文和标准解答
