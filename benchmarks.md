# 大模型评测任务与榜单：分类与特点整理

本文将当前清单中的项目按“主要评测能力”进行归类，并补充每个评测/榜单的任务特点。需要注意：其中有一部分是“评测任务/基准（benchmark）”，另一部分是“榜单/聚合平台（leaderboard）”。前者通常可复现实验、可本地跑分；后者更多是展示结果、统一口径对比，未必直接提供可离线复现的完整评测脚本或私有测试集。

## 能力维度速览

- **真实环境代理（Computer/GUI/Terminal）**：在交互环境中规划、执行、纠错（OS/浏览器/终端/手机等）
- **工具使用与对话式代理**：多轮对话中调用 API/工具达成目标（订票/零售/检索等）
- **软件工程与仓库级编码**：在真实仓库中修改代码、修复问题、通过测试与评审
- **数据理解与SQL**：跨库泛化、复杂查询、鲁棒语义解析、真实业务数据库
- **数学与严谨推理**：形式化推导、多步计算、证明与竞赛级题目
- **知识问答与多跳推理**：跨文档/多证据整合、引用与归因、事实一致性
- **多模态理解（图像/文档/视频/机器人）**：图文推理、文档解析、视频质量、具身任务理解
- **可靠性与对齐**：幻觉/忠实性/指令遵循、污染控制、可验证评分

## A. 真实环境代理与工具使用

### OSWorld（真实电脑环境多模态代理）
- 链接：https://os-world.github.io/
- 主要评测：在真实桌面/应用环境中的**长程规划、GUI操作、跨应用协作、错误恢复**
- 适用模型：多模态模型（VLM）与带工具的Agent
- 特点：
  - 任务开放式、步骤多，常见失败来自“看懂界面但操作序列不稳定”
  - 对环境状态建模与中途纠错能力要求高（例如误点、窗口切换、权限弹窗）

### AgentCLUE-Mobile（手机GUI Agent，离线）
- 链接：https://www.superclueai.com/specificpage?category=agent&name=AgentCLUE-Mobile%E6%89%8B%E6%9C%BAGUI+Agent%EF%BC%88%E7%A6%BB%E7%BA%BF%EF%BC%89&folder=Mobile
- 主要评测：移动端GUI理解与操作的**目标分解、点击/输入/返回等动作策略**
- 适用模型：VLM/多模态Agent
- 特点：
  - 通常强调离线可控环境与可复现评测
  - 强依赖界面元素定位、状态转移与多步任务稳定性

### Terminal-Bench（终端环境Agent）
- 链接：https://www.tbench.ai/leaderboard/terminal-bench/2.0
- 主要评测：在终端中完成端到端任务的**命令行工具使用、环境配置、脚本编写与调试**
- 适用模型：具备工具调用/执行反馈闭环的Agent
- 特点：
  - 强调“可执行结果”，而不是只写出看起来合理的命令
  - 任务往往涉及依赖、权限、路径、版本等真实世界细节

### τ-Bench（Tau-Bench，对话式工具代理）
- 链接：https://taubench.com/#leaderboard
- 主要评测：在多轮对话中使用工具/API解决业务问题的**对话管理、工具选择、约束/政策遵循**
- 适用模型：对话式Agent
- 特点：
  - 常见场景为零售/航旅等，需要在政策限制下完成操作
  - 评价更关注“是否成功完成目标（Pass^k）”而非语言花哨程度

### Mind2Web 2（Agentic Search + Agent-as-a-Judge）
- 链接：https://osu-nlp-group.github.io/Mind2Web-2/
- 主要评测：长时程、时间变化的Web检索任务的**检索规划、信息综合、引用归因与可验证性**
- 适用模型：检索型Agent、Deep Research类系统
- 特点：
  - 任务强调“答案+证据链接”的对应关系（归因/引用）
  - 评估方法更细粒度，能给“部分完成”的信用分

### FutureSearch Benchmarks（Deep Research Bench / 预测类）
- 链接：https://evals.futuresearch.ai/
- 主要评测：面向真实工作的研究/检索代理能力，以及部分基准的**预测/研判**能力
- 适用模型：研究型Agent、检索增强系统
- 特点：
  - 关注“白领式任务”的复杂性：信息源多、要求多、过程长
  - 往往强调稳健评分与任务可复现（例如通过离线快照降低网页变化影响）

### DeepSearch Leaderboard（xbench）
- 链接：https://xbench.org/agi/aisearch
- 主要评测：搜索/检索相关能力的综合表现（以榜单形式展示）
- 适用模型：检索增强LLM与Agent
- 特点：
  - 更偏“榜单聚合展示”，具体任务与口径需参考其页面说明

### BrowseComp（Web browsing 高难检索与导航）
- 链接：https://llm-stats.com/benchmarks/browsecomp
- 主要评测：在开放互联网中完成高难“找信息”任务的**检索规划、网页导航、信息综合与事实核验**
- 适用模型：带浏览/检索工具的Agent、Deep Research类系统
- 特点：
  - 题目通常“答案短、验证容易，但信息很难找”，强调持久搜索与策略多样性
  - 多为多跳/纠缠信息（跨站点、跨线索），对证据一致性与抗幻觉要求高

### BrowseComp-Plus（固定语料的可复现 Deep Research 评测）
- 链接：https://huggingface.co/spaces/Tevatron/BrowseComp-Plus
- 主要评测：在固定语料库上衡量Deep-Research链路的**检索质量（retriever）、检索-生成协同与端到端问答正确性**
- 适用模型：RAG/检索增强Agent（可替换retriever与LLM）
- 特点：
  - 将BrowseComp的高难查询迁移到约10万篇整理后的网页文档语料，减少网页变化带来的不可复现
  - 同时支持“只评检索器”和“端到端评Agent”，便于做可控对比与消融

### SuperCLUE-DeepSearch（SuperCLUE子榜）
- 链接：https://www.superclueai.com/specificpage?category=agent&name=SuperCLUE-DeepSearch%E3%80%8C%E6%B7%B1%E5%BA%A6%E6%90%9C%E7%B4%A2%E3%80%8D&folder=DeepSearch
- 主要评测：中文场景下的深度检索/研究型任务能力（以榜单形式呈现）
- 适用模型：中文LLM/Agent
- 特点：
  - 与通用对话榜不同，更聚焦“检索-整合-输出”的链路质量

### Vending-Bench（长时程一致性/经营代理）
- 链接：https://andonlabs.com/evals/vending-bench
- 主要评测：长时间跨度下代理的**长期一致性（long-term coherence）、状态跟踪与计划执行**
- 适用模型：具备外部记忆/工具的Agent
- 特点：
  - 任务表面简单（经营售货机），但跨度长，容易出现“状态误解→行为崩坏”
  - 非常适合暴露“记忆使用策略/自我监控”缺陷

### Cybench（网络安全/CTF代理能力）
- 链接：https://cybench.github.io/
- 主要评测：网络安全场景下Agent的**漏洞分析、利用、工具链使用、命令执行与验证**
- 适用模型：安全Agent、终端型Agent
- 特点：
  - 常在隔离环境中执行（如Linux/Kali容器），可观测命令输出形成闭环
  - 相比纯“问答安全题”，更强调可落地操作与真实技能链

## B. 软件工程与仓库级编码（Coding / SWE / Web / ML工程）

### SWE-bench（真实GitHub issue修复）
- 链接：https://www.swebench.com/
- 主要评测：在真实仓库修复issue的**代码理解、定位、修改、回归测试通过**
- 适用模型：代码LLM、软件工程Agent
- 特点：
  - 以“能否让测试通过/补丁是否正确”为核心信号，强可验证
  - 对依赖安装、测试执行、边界case等工程细节要求高

### Multi-SWE-bench（多语言/多仓库扩展）
- 链接：https://multi-swe-bench.github.io/#/
- 主要评测：跨更多项目/生态的**软件工程修复与泛化能力**
- 适用模型：软件工程Agent、代码LLM
- 特点：
  - 通常比单一生态更难：仓库风格差异大、工具链多样
  - 更能衡量“通用工程能力”而非对单一框架的熟练度

### LiveCodeBench（动态收集题目、抗污染的编程评测）
- 榜单：https://livecodebench.github.io/leaderboard.html
- 主页：https://livecodebench.github.io/
- 代码与数据：https://github.com/LiveCodeBench/LiveCodeBench
- 主要评测：面向真实竞赛题的编程能力，覆盖**代码生成（functional correctness）、代码执行、测试输出预测、self-repair（自修复）**等多种场景
- 适用模型：代码LLM、具备执行/自修复闭环的编码Agent
- 特点：
  - 持续从 LeetCode / AtCoder / Codeforces 等平台收集新题，并标注题目发布时间，可按模型训练截止日做“时间窗评测”以降低数据污染影响
  - 以隐藏测试用例验证为核心，更贴近“写出能跑通的解”而非只看表面代码质量
  - 常用指标为 pass@1 / pass@5，适合跟踪模型在不同时期新题上的泛化趋势

### Web-Bench（真实Web开发顺序任务）
- 代码库：https://github.com/bytedance/web-bench
- 榜单：https://huggingface.co/spaces/bytedance-research/Web-Bench-Leaderboard
- 主要评测：真实Web项目中的**前端/全栈开发、标准/框架知识、顺序任务依赖管理**
- 适用模型：代码LLM、Web开发Agent
- 特点：
  - 任务存在前后依赖，模拟“人类按迭代实现功能”的工作流
  - 比单题代码生成更能暴露“改坏旧功能/不理解项目结构”的问题

### ML-Bench（仓库级ML任务：脚本与调用）
- 链接：https://ml-bench.github.io/
- 主要评测：在ML代码仓库中完成任务的**长上下文代码理解、参数抽取、可执行脚本生成**
- 适用模型：代码LLM、能执行反馈的Agent
- 特点：
  - 强调“用仓库已有能力完成目标”，而非从零写模型
  - 常见难点是参数、路径、README/文档与代码实现的不一致处理

### MLE-bench（机器学习工程端到端）
- 链接：https://github.com/openai/mle-bench
- 主要评测：真实ML工程流程的**数据处理、训练/评估、实验管理、结果提交/复现**
- 适用模型：ML工程Agent
- 特点：
  - 更接近“在Kaggle/竞赛或生产环境做ML”的综合能力
  - 对资源约束、实验迭代与工程化细节更敏感

## C. 数据库与SQL能力

### Spider 2.0（Text-to-SQL升级版）
- 链接：https://spider2-sql.github.io/
- 主要评测：跨数据库的**自然语言到SQL生成、复杂查询、跨域泛化**
- 适用模型：LLM（文本为主），也常结合检索/执行反馈
- 特点：
  - 相比早期Text-to-SQL更强调现实复杂度与鲁棒性
  - 评测往往基于执行正确性/结果一致性，而非只比对SQL字符串

### BIRD-bench（真实业务数据库Text-to-SQL）
- 链接：https://bird-bench.github.io/
- 主要评测：面向真实数据与业务语义的**Text-to-SQL、数据库理解、复杂推理查询**
- 适用模型：LLM/代码模型
- 特点：
  - 常包含更贴近生产的schema与数据分布，难在“理解业务含义”
  - 对歧义消解、分组/聚合/时间过滤等细节更敏感

### BIRD-CRITIC（SQL自检/批判与修复）
- 链接：https://bird-critic.github.io/
- 主要评测：对生成SQL进行**批判审查、错误定位与修复（critic/reflect）**的能力
- 适用模型：带自我反思/验证链路的LLM或Agent
- 特点：
  - 关注“第一次写错后能否自纠”，更贴合真实使用方式
  - 有利于评估“验证、解释与纠错策略”而非仅一次性生成

## D. 数学、严谨推理与高难知识

### AIME（竞赛数学）
- 链接：https://www.vals.ai/benchmarks/aime
- 主要评测：中高难竞赛数学的**多步推导与精确计算**
- 适用模型：LLM（尤其强调推理与计算准确性）
- 特点：
  - 对中间步骤的稳定性要求高，常用来区分“会讲但算不对”的模型

### MATH 500（数学推理子集）
- 链接：https://www.vals.ai/benchmarks/math500
- 主要评测：数学题的**系统化推理与解题稳健性**
- 适用模型：LLM
- 特点：
  - 规模相对小但难度集中，适合快速回归对比

### GPQA（研究生水平问答/高难知识）
- 链接：https://www.vals.ai/benchmarks/gpqa
- 主要评测：高难领域知识的**理解、推理与抗猜测能力**
- 适用模型：LLM
- 特点：
  - 常用于衡量“看似懂但其实不懂”的区分度（难度高、投机空间小）

### Humanity’s Last Exam（HLE，高难综合）
- 官方榜单：https://scale.com/leaderboard/humanitys_last_exam
- 聚合解读：https://artificialanalysis.ai/evaluations/humanitys-last-exam
- 主要评测：极高难度的**综合推理、知识整合、稳健作答**
- 适用模型：LLM（部分任务也可能涉及多模态/工具，视版本而定）
- 特点：
  - 更像“压力测试”：题目难、覆盖广，旨在拉开顶级模型差距

### ARC Prize（抽象推理与泛化）
- 链接：https://arcprize.org/leaderboard
- 主要评测：抽象规则归纳的**类人泛化、少样本学习与组合推理**
- 适用模型：LLM/推理系统（常结合搜索/程序归纳）
- 特点：
  - 对“从少量示例归纳隐含规则”的能力要求极高
  - 传统语言能力强不一定能带来高分，常促使引入结构化搜索

## E. 长上下文、指令遵循与污染控制

### LongBench v2（长上下文理解）
- 链接：https://longbench2.github.io/
- 主要评测：长上下文下的**信息定位、跨段整合、长期依赖处理**
- 适用模型：长上下文LLM
- 特点：
  - 更能反映“上下文变长后”模型是否仍保持可用的阅读/抽取能力
  - 适合观察“注意力漂移、遗忘、信息混淆”等现象

### LiveBench（动态更新、污染控制、可验证评分）
- 链接：https://livebench.ai/#/
- 主要评测：在尽量减少数据污染的前提下，覆盖多类任务的**通用能力**（含数学/编码/推理/指令遵循等）
- 适用模型：LLM
- 特点：
  - 设计目标之一是降低“刷题/训练集泄露”带来的虚高
  - 倾向使用可自动验证的评分方式，减少纯主观评判偏差

### SuperCLUE-CPIF（中文精确指令遵循）
- 链接：https://www.superclueai.com/specificpage?category=specialized&name=SuperCLUE-CPIF%E4%B8%AD%E6%96%87%E7%B2%BE%E7%A1%AE%E6%8C%87%E4%BB%A4%E9%81%B5%E5%BE%AA&folder=CPIF
- 主要评测：中文场景的**精确指令遵循、格式约束、细粒度要求满足**
- 适用模型：中文LLM
- 特点：
  - 对“不要多写/不要漏写/严格按格式输出”等非常敏感
  - 适合用来评估可控性与落地可用性

## F. 知识问答与多跳推理

### HotpotQA（多跳问答）
- 链接：https://hotpotqa.github.io/
- 主要评测：跨文档多证据的**多跳推理、证据整合与解释**
- 适用模型：LLM（常结合检索）
- 特点：
  - 典型难点是“必须组合多个来源”而非单段落抽取
  - 很适合作为检索增强与多步推理的基础评测集

### GAIA Leaderboard（通用Agent任务榜）
- 链接：https://huggingface.co/spaces/gaia-benchmark/leaderboard
- 主要评测：通用任务解决能力（以榜单展示为主，通常面向Agent/工具使用）
- 适用模型：LLM/Agent
- 特点：
  - 更偏“对比入口”，具体任务形式与评测口径需参照其说明

## G. 多模态理解、文档理解与具身/机器人

### MMMU（多学科多模态理解）
- 链接：https://www.vals.ai/benchmarks/mmmu
- 主要评测：跨学科图文题的**视觉理解、图表/图形推理与知识应用**
- 适用模型：VLM
- 特点：
  - 覆盖学科广，能够测试“图像+文本+知识”的综合推理

### MathVista（视觉数学推理）
- 链接：https://mathvista.github.io/
- 主要评测：图中数学信息的**识别（读图/读表/读公式）+推理计算**
- 适用模型：VLM
- 特点：
  - 既考“看懂图里数字/结构”，也考“算得对/推得对”

### ScienceQA（科学多模态问答，榜单展示）
- 链接：https://xbench.org/agi/scienceqa
- 主要评测：图文结合的科学题**理解与推理**
- 适用模型：VLM/LLM
- 特点：
  - 常用于衡量基础教育/常识科学推理的多模态能力

### OmniDocBench（文档解析：版面/OCR/表格/公式）
- 链接：https://opendatalab.com/omnidocbench
- 主要评测：真实PDF文档解析的**版面检测、OCR、表格识别、公式识别与阅读顺序**
- 适用模型：OCR/VLM/文档解析系统
- 特点：
  - 覆盖文档类型多（学术、财报、报纸、手写等），标注信息丰富
  - 既可做端到端（文档→结构化输出），也可拆模块分别评测

### VLABench（语言条件机器人操作/长程规划）
- 链接：https://vlabench.github.io/
- 主要评测：语言指令驱动的操作任务中的**常识迁移、空间理解、物理直觉与长程规划**
- 适用模型：VLA（Vision-Language-Action）、具身Agent、VLM工作流
- 特点：
  - 更强调长时程、多步骤的具身推理与动作策略，而非短技能
  - 可用于评估“策略（policy）能力”与“语言模型能力”的结合

### RoboVQA（机器人/具身多模态长程推理）
- 链接：https://robovqa.github.io/
- 主要评测：面向机器人场景的**多模态理解与长时程推理（VQA形式）**
- 适用模型：VLM/具身相关模型
- 特点：
  - 相比通用VQA，通常更强调任务链、时序信息与行动相关语义

## H. 生成式多模态（视频/图像）

### VBench（视频生成评测，榜单）
- 链接：https://huggingface.co/spaces/Vchitect/VBench_Leaderboard
- 主要评测：视频生成的**画质、时序一致性、运动合理性、文本对齐**等多维度（以榜单呈现）
- 适用模型：Text-to-Video / Image-to-Video 等生成模型
- 特点：
  - 更注重“多维度拆解”而非单一总分，有助于定位模型短板

### Arena-T2I（文本生图榜单）
- 链接：https://aiarena.alibaba-inc.com/corpora/arena/leaderboard?arenaType=T2I
- 主要评测：Text-to-Image生成质量（以对战/偏好或综合指标形式呈现，依其说明）
- 适用模型：文生图模型
- 特点：
  - 通常更贴近用户主观偏好与审美一致性

### Arena-TI2I（参考图/指令到图像，榜单）
- 链接：https://aiarena.alibaba-inc.com/corpora/arena/leaderboard?arenaType=TI2I
- 主要评测：Text+Image条件下的图像生成/编辑能力（风格/身份保持/局部编辑等）
- 适用模型：图像编辑/条件生成模型
- 特点：
  - 对“保持参考图内容一致性”与“遵循文本指令修改”的平衡要求高

## I. 综合性榜单

### SuperCLUE（中文综合评测平台）
- 总站：https://www.superclueai.com/homepage
- 通用榜：https://www.superclueai.com/generalpage
- 主要评测：中文模型的多维能力（通用对话、专项能力、Agent、多模态等分榜）
- 适用模型：中文LLM/VLM
- 特点：
  - 更像“评测体系+榜单集合”，便于快速横向对比

### Vals AI（模型/基准聚合平台）
- 模型页：https://www.vals.ai/models
- 基准页：https://www.vals.ai/benchmarks
- 主要评测：对多种公开基准进行统一展示与对比（AIME/GPQA/MMMU/MATH500等）
- 适用模型：LLM/VLM（取决于具体子基准）
- 特点：
  - 便于快速“同口径”对比多个基准成绩
  - 具体数据集与评分细节仍以各子基准为准

### LMArena（综合榜单）
- 链接：https://lmarena.ai/zh/leaderboard
- 主要评测：多基准的综合对比与评测流程（以榜单形式展示）
- 适用模型：LLM/VLM
- 特点：
  - 常作为“评测框架+榜单”，便于组织批量评测与复现

### OpenCompass 司南（综合评测榜单/工具链）
- 链接：https://rank.opencompass.org.cn/leaderboard-llm
- 主要评测：多基准的综合对比与评测流程（以榜单形式展示）
- 适用模型：LLM/VLM
- 特点：
  - 常作为“评测框架+榜单”，便于组织批量评测与复现

### Vellum LLM Leaderboard 2025（综合榜单）
- 链接：https://www.vellum.ai/llm-leaderboard?utm_source=google&utm_medium=organic
- 主要评测：汇总多个基准/维度的模型对比（以平台展示为主）
- 适用模型：LLM
- 特点：
  - 更偏“行业视角的汇总”，需关注其纳入哪些基准与权重口径


## J. 幻觉/忠实性基准

### SuperCLUE-Faith（忠实性/幻觉）
- 链接：https://www.superclueai.com/specificpage?category=specialized&name=SuperCLUE-Faith%E5%BF%A0%E5%AE%9E%E6%80%A7%E5%B9%BB%E8%A7%89&folder=Faith
- 主要评测：输出与证据/输入的一致性，聚焦**幻觉、编造与忠实性**
- 适用模型：中文LLM
- 特点：
  - 常用于评估“看似合理但不真实”的风险