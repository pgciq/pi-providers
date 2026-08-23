# pi-providers

Pi 扩展，提供 Agnes AI 和 SenseNova 模型提供商支持。

🔗 [GitHub 仓库](https://github.com/pgciq/pi-providers)

## 安装

### 从 npm（发布后）

```bash
pi install npm:pi-providers
```

### 从 git

```bash
pi install git:github.com/yourusername/pi-providers
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
