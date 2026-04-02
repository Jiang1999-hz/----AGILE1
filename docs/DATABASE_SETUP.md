# Supabase / PostgreSQL 设置

## 1. 创建本地 `.env`

复制 `.env.example` 为 `.env`，然后把真实密码填进去：

```env
DATABASE_URL="postgresql://postgres:你的真实密码@db.uavwyubqknpxxwueamkp.supabase.co:5432/postgres"
```

注意：

- 不要把 `.env` 提交到 Git
- `[YOUR-PASSWORD]` 必须替换成真实密码

## 2. 安装依赖

```powershell
npm.cmd install
```

## 3. 生成 Prisma Client

```powershell
npm.cmd run db:generate
```

## 4. 推送表结构到 Supabase

```powershell
npm.cmd run db:push
```

## 5. 后续开发

当前已经定义的核心表：

- `Student`
- `Course`
- `StudentCourse`
- `Lesson`
- `StudentAbility`
- `QuizSubmission`
- `Homework`
- `Message`

这套结构足够支撑学生端 S1：

- 登录后读取学生信息
- 读取课程列表
- 读取课程与课次详情
- 保存做题结果
- 保存作业和消息

## 6. 导入 Student S1 示例数据

建表完成后执行：

```powershell
npm.cmd run db:seed
```

这样会把 `data/student-s1.json` 里的学生端 S1 示例数据导入数据库。
