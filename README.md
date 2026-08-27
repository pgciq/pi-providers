# pi-providers

Pi 扩展，提供 Agnes AI、SenseNova 和 CodeMie 模型提供商支持。

🔗 [GitHub 仓库](https://github.com/pgciq/pi-providers)

## 安装

### 从 npm（发布后）

```bash
pi install npm:pi-providers
```

### 从 git

```bash
pi install git:github.com/pgciq/pi-providers
```

### 本地路径

```bash
pi install ./path/to/pi-providers
```

## 提供商

### Agnes AI

注册两个提供商：

- `agnes` - 国际版 (apihub.agnes-ai.com)
- `agnes-cn` - 中国版 (api.agnes-ai.cn)

**环境变量：**
- `AGNES_API_KEY` - 国际版 API 密钥
- `AGNES_CN_API_KEY` - 中国版 API 密钥

### SenseNova

- `sensenova` - 讯飞星火平台

**环境变量：**
- `SENSENOVA_API_KEY` - SenseNova API 密钥

## 可用模型

| 提供商 | 模型 ID | 名称 | 上下文窗口 |
|--------|---------|------|-----------|
| agnes | agnes-2.5-flash | Agnes 2.5 Flash | 1M |
| agnes | agnes-2.5-pro | Agnes 2.5 Pro | 1M |
| agnes | agnes-2.5-pro-alpha | Agnes 2.5 Pro Alpha | 1M |
| agnes | agnes-2.0-flash | Agnes 2.0 Flash | 1M |
| sensenova | sensenova-6.8-flash-lite | SenseNova 6.8 Flash Lite | 256K |
| sensenova | deepseek-v4-flash | DeepSeek V4 Flash | 1M |
| sensenova | glm-5.2 | GLM-5.2 | 1M |

## 使用示例

```bash
# 使用 Agnes 国际版
pi --model agnes/agnes-2.5-flash "你好"

# 使用 Agnes 中国版
pi --model agnes-cn/agnes-2.5-pro "你好"

# 使用 SenseNova
pi --model sensenova/deepseek-v4-flash "你好"
```

### CodeMie

注册 [CodeMie (AI/Run)](https://github.com/codemie-ai/codemie-code) 企业网关的单个提供商：

- `codemie` - 全部模型。非 Claude 模型走 OpenAI 兼容协议（`/v1`），
  Claude 模型自动走原生 Anthropic Messages 协议（保留 thinking / caching）。

**环境变量：**
- `CODEMIE_BASE_URL` - CodeMie 实例地址（如 `https://codemie.lab.epam.com`）
- `CODEMIE_JWT_TOKEN` / `CODEMIE_API_KEY` / `CODEMIE_COOKIE` - 可选，直接指定凭证（CI 场景）
- `CODEMIE_MODEL` - 模型列表获取失败时的静态回退模型 ID

**OAuth SSO 登录（推荐，类似 GitHub Copilot）：**

启动时不会弹出浏览器。未登录时提供商处于待登录状态，首次主动使用 CodeMie 模型或
执行 `/login codemie` 时才会打开浏览器完成 EPAM SSO 登录并持久化凭证到
`~/.pi/agent/auth.json`。会话过期后，下次实际请求 CodeMie 时自动刷新。

模型列表在启动时从 `{CODEMIE_BASE_URL}/v1/llm_models?include_all=true` 动态发现。

```bash
# 使用示例
pi --model codemie/gpt-5.1-codex "你好"
pi --model codemie-anthropic/claude-sonnet-4-5 "你好"
```

## 模型发现（非阻塞启动）

本包内置的 `agnes` / `sensenova` / `codemie` 三个提供商均遵循同一原则：**加载时立即用种子模型列表注册，pi 启动即可用，绝不等待网络发现而阻塞**。完整的模型目录在**后台**通过 pi 的 `refreshModels` 回调（或后台热重注册）刷新：

- 种子列表始终立即可用，即使离线或未设置 API Key；
- 后台发现成功后替换种子列表，并持久化到 pi 的 provider 缓存（或 `~/.pi/cache/` 下的本地缓存文件），重启 / 离线启动也能用；
- 每个网络请求都有超时保护，任何失败都回退到已有列表，注册永不中断。

## Skills

### modlens

为纯文本模型提供图像识别能力的插件 skill，运行在本地。

**依赖：** Node 22.19+（通过 npx）或 Bun（bunx），或直接安装 `modlens` CLI。

**配置：**
```bash
npm install -g @liustack/modlens
modlens config set gemini-api.apiKey <your-key>
```

**使用：** 当对话中出现图片时，会自动触发 modlens 进行图像分析，输出结构化 JSON（OCR 文字、版面区域、语义描述等）。

详细配置见 `skills/modlens/references/configure.md`。
