// SenseNova provider (OpenAI-compatible) — https://platform.sensenova.cn/docs
// Base URL: https://token.sensenova.cn/v1 ; auth via SENSENOVA_API_KEY env var
export default function (pi) {
  const effortMap = { minimal: null, low: "low", medium: "medium", high: "high", xhigh: null, max: null };
  pi.registerProvider("sensenova", {
    name: "SenseNova",
    baseUrl: "https://token.sensenova.cn/v1",
    apiKey: "$SENSENOVA_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "sensenova-6.8-flash-lite",
        name: "SenseNova 6.8 Flash Lite (vision)",
        reasoning: true,
        thinkingLevelMap: effortMap,
        compat: { supportsReasoningEffort: true, supportsDeveloperRole: false },
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 262144,
        maxTokens: 65536,
      },
      {
        id: "deepseek-v4-flash",
        name: "DeepSeek V4 Flash (via SenseNova)",
        reasoning: true,
        thinkingLevelMap: effortMap,
        compat: { supportsReasoningEffort: true, supportsDeveloperRole: false },
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "glm-5.2",
        name: "GLM-5.2 (via SenseNova)",
        reasoning: true,
        thinkingLevelMap: effortMap,
        compat: { supportsReasoningEffort: true, supportsDeveloperRole: false },
        input: ["text"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 131072,
      },
    ],
  });
}
