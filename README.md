# AI Benchmark Leaderboard

[English](./README.md) | [中文](./README_ZH.md)

The **AI Benchmark Leaderboard** is a comprehensive platform designed to track, visualize, and analyze the evolution of Artificial Intelligence models. By aggregating data from various sources, it provides researchers, developers, and industry practitioners with an interactive timeline and detailed benchmark comparisons, facilitating a deeper understanding of the rapidly evolving AI landscape.

## 🌐 Web Access

Experience the interactive leaderboard and timeline here:
👉 **[https://king-jingxiang.github.io/ai_benchmark_leaderboard](https://king-jingxiang.github.io/ai_benchmark_leaderboard)**

## 📂 Project Structure

The project consists of two main components designed to work in tandem:

### 1. Web Client (`/web`)
The frontend application is built with **React** and **Vite**, offering a modern and responsive user interface. Key features include:
- **Timeline View**: A chronological visualization of major AI model releases.
- **Benchmark Analysis**: Detailed performance metrics across various evaluation tasks.
- **Model Details**: In-depth information about individual models.

### 2. Crawler Service (`/crawler`)
The backend is powered by a scheduled data fetching service that ensures the leaderboard remains up-to-date.
- **Automated Updates**: Periodically fetches the latest model data and benchmark results.
- **Data Processing**: Aggregates and normalizes data for frontend consumption.
- *Note: The crawler module is currently closed-source. We plan to open-source this component following further optimization and code refinement.*

## 🚀 Future Plans

We are continuously working to enhance the platform. Our upcoming roadmap includes:

1.  **Best Model Selection Interface**:
    - A dedicated page providing tailored model recommendations based on different deployment scenarios (e.g., edge devices, cloud inference, specific modalities).
    
2.  **Agent Skill Integration**:
    - Implementing intelligent Agent capabilities to assist users in selecting the most suitable model for their specific business requirements and use cases.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=king-jingxiang/ai_benchmark_leaderboard&type=Date)](https://star-history.com/#king-jingxiang/ai_benchmark_leaderboard&Date)
