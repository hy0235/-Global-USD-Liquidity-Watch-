# 🌍 全球美元宏观流动性监测看板 (2025-2026)

这是一个专为宏观交易员和研究员设计的专业级监测工具。它通过交互式气泡图（Bubble Map）展示流动性指标关联，并集成 Gemini AI 提供深度宏观推演。

## 🚀 零基础一键上线 (Vercel 方案)

由于您没有编程背景，请按照以下最简路径操作：

### 1. 准备代码 (GitHub)
- 在 GitHub 上创建一个新仓库（Repository），命名为 `usd-monitor`。
- 将本项目的所有文件上传到该仓库的根目录下。

### 2. 部署到 Vercel
- 登录 [Vercel](https://vercel.com/)（建议直接用 GitHub 账号登录）。
- 点击 **"Add New..."** -> **"Project"**。
- 导入你刚才创建的 `usd-monitor` 仓库。
- **关键步骤：** 在 **Environment Variables** 区域：
    - **Key**: `API_KEY`
    - **Value**: 填入你从 [Google AI Studio](https://aistudio.google.com/) 获取的 API Key。
- 点击 **"Deploy"**。

### 3. 获取 API Key
- 访问 [Google AI Studio](https://aistudio.google.com/)。
- 点击 **"Get API key"** 并创建一个。
- 复制该 Key 填入上述 Vercel 的环境变量中。

## 📊 核心功能
- **全景概览 (Bubble Map)**: 直观展示 TGA、RRP、SOFR、日元套息等指标的相互影响逻辑。
- **AI 首席策略师分析**: 针对 2025 年降息周期及 2026 年中性利率（Neutral Rate）提供深度推演。
- **实时发布日历**: 利用 Google Search Grounding 自动获取最新的宏观指标发布日程。
- **演示视频生成**: 集成 Google Veo 模型，一键生成看板演示短片。

## ⚠️ 注意事项
- **安全性**: 永远不要把 API Key 直接写在代码文件里上传到公开的 GitHub。务必使用 Vercel 的环境变量。
- **更新**: 修改代码后只需在 GitHub 提交，Vercel 会自动为您同步更新线上网站。
- **成本**: Vercel 个人版免费；Gemini Flash 模型在免费额度内足以支持个人日常监测。
