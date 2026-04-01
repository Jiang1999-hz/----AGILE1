# Git 连接说明

## 当前状态

当前本地仓库已经初始化，但还没有连接远程仓库。

## 常见流程

### 1. 在 GitHub 新建一个仓库

例如仓库名:

`juku-ai-cloud`

### 2. 在本地连接远程仓库

如果你使用 HTTPS:

```powershell
git remote add origin https://github.com/你的用户名/juku-ai-cloud.git
```

如果你使用 SSH:

```powershell
git remote add origin git@github.com:你的用户名/juku-ai-cloud.git
```

### 3. 查看是否连接成功

```powershell
git remote -v
```

### 4. 提交当前代码

```powershell
git add .
git commit -m "Initial POC for Juku AI Cloud"
```

### 5. 推送到 GitHub

如果默认分支是 `main`:

```powershell
git branch -M main
git push -u origin main
```

## 如果你还没有配置 Git 用户信息

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 如果你想用 SSH

先检查本机有没有 SSH key:

```powershell
Get-ChildItem $HOME\\.ssh
```

如果没有，可以生成:

```powershell
ssh-keygen -t ed25519 -C "你的邮箱"
```

然后把公钥内容复制到 GitHub 的 SSH keys 设置里。

查看公钥:

```powershell
Get-Content $HOME\\.ssh\\id_ed25519.pub
```

## 推荐

如果你是第一次配 GitHub，先用 HTTPS 最快。

如果你后面会频繁推送，SSH 更方便。
