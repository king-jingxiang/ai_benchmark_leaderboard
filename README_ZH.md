# AI Benchmark Leaderboard (AI 模型基准排行榜)

[English](./README.md) | [中文](./README_ZH.md)

**AI Benchmark Leaderboard** 是一个综合性平台，旨在追踪、可视化和分析人工智能模型的演变。通过聚合来自各种来源的数据，它为研究人员、开发者和行业从业者提供了交互式的时间线和详细的基准比较，促进对快速发展的 AI 领域的深入理解。

## 🌐 网页访问

点击此处体验交互式排行榜和时间线：
👉 **[https://king-jingxiang.github.io/ai_benchmark_leaderboard](https://king-jingxiang.github.io/ai_benchmark_leaderboard)**

## 📂 项目结构

本项目包含两个主要组件，协同工作：

### 1. Web 客户端 (`/web`)
前端应用使用 **React** 和 **Vite** 构建，提供现代且响应式的用户界面。主要功能包括：
- **时间线视图**：主要 AI 模型发布的按时间顺序可视化。
- **基准分析**：各种评估任务的详细性能指标。
- **模型详情**：关于各个模型的深入信息。

### 2. 爬虫服务 (`/crawler`)
后端由定时数据抓取服务驱动，确保排行榜保持最新。
- **自动更新**：定期获取最新的模型数据和基准测试结果。
- **数据处理**：聚合和标准化数据以供前端使用。
- *注意：爬虫模块目前尚未开源。我们计划在进一步优化和代码完善后开源此组件。*

## 🚀 后续计划

我们致力于持续增强平台功能。接下来的路线图包括：

1.  **最佳模型选型界面**：
    - 一个专用页面，根据不同的部署场景（例如边缘设备、云端推理、特定模态）提供定制的模型推荐。
    
2.  **Agent 能力集成**：
    - 实现智能 Agent 能力，协助用户根据其特定业务需求和用例选择最合适的模型。

## 🌟 Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=king-jingxiang/ai_benchmark_leaderboard&type=Date)](https://star-history.com/#king-jingxiang/ai_benchmark_leaderboard&Date)
