# Project Structure

当前项目先按“轻整理、不断功能”的原则收了一轮，目的是让后续继续聚焦学生做题主线时不再继续失控。

## 当前目录

- [index.html](/C:/Users/Jiang/Documents/New%20project/index.html)
  - 静态入口页
- [app.js](/C:/Users/Jiang/Documents/New%20project/app.js)
  - 当前主应用逻辑
  - 仍然偏大，后续会继续拆分
- [styles.css](/C:/Users/Jiang/Documents/New%20project/styles.css)
  - 全局样式
- [server.js](/C:/Users/Jiang/Documents/New%20project/server.js)
  - 本地 Node 服务
  - 提供学生端和题库相关 API

## src/config

- [view-config.js](/C:/Users/Jiang/Documents/New%20project/src/config/view-config.js)
  - 角色菜单
  - 页面标题
- [feature-flags.js](/C:/Users/Jiang/Documents/New%20project/src/config/feature-flags.js)
  - 当前功能开关
  - 目前老师题库页关闭，后续如要改成 admin 题库录入，可以从这里统一控制
- [quiz-catalog.js](/C:/Users/Jiang/Documents/New%20project/src/config/quiz-catalog.js)
  - 学生做题流的本地目录配置
  - 当前仍保留作前端兜底

## src/state

- [app-state.js](/C:/Users/Jiang/Documents/New%20project/src/state/app-state.js)
  - 应用初始状态
  - 学生做题流状态
  - 提示与草稿状态

## src/utils

- [scheduling.js](/C:/Users/Jiang/Documents/New%20project/src/utils/scheduling.js)
  - 排课相关规则

## src/features

- [student-quiz-flow.js](/C:/Users/Jiang/Documents/New%20project/src/features/student-quiz-flow.js)
  - 学生做题主线
  - 包含：
    - 学科
    - 知识点
    - 难度
    - 随机 5 题
    - 提交后错题讲解闭环
  - 现在作为独立 feature 挂载，减少主文件继续膨胀

## data

- [student-s1.json](/C:/Users/Jiang/Documents/New%20project/data/student-s1.json)
  - 学生示例数据
- [question-bank.json](/C:/Users/Jiang/Documents/New%20project/data/question-bank.json)
  - 标准讲解题库资源
- [quiz-catalog.json](/C:/Users/Jiang/Documents/New%20project/data/quiz-catalog.json)
  - 学科 / 知识点目录数据

## prisma

- [schema.prisma](/C:/Users/Jiang/Documents/New%20project/prisma/schema.prisma)
  - PostgreSQL 表结构

## scripts

- [seed-student-s1.js](/C:/Users/Jiang/Documents/New%20project/scripts/seed-student-s1.js)
  - 本地 seed
  - 会导入学生数据、课程、题库、知识点与讲解

## 当前整理结论

这轮先不继续扩展老师题库页，而是明确收口：

- 产品主线先聚焦学生端做题
- 题库录入后续改走 admin
- 老师题库管理功能暂时不继续推进

## 下一轮建议

下一次真正值得做的整理是：

1. 继续把老师 / admin 各自页面逻辑拆成 feature 文件
2. 收掉 [app.js](/C:/Users/Jiang/Documents/New%20project/app.js) 里残留的旧版学生做题逻辑
3. 让 `app.js` 只保留入口、路由切换和公共状态同步
