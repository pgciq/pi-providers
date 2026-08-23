// Agnes AI provider (OpenAI-compatible) — https://agnes-ai.com
// Docs: https://agnes-ai.com/zh-Hans/docs/overview
// Auth: AGNES_API_KEY env var (user-level Windows env var)
export default function (pi) {

  // — Agnes International —
  pi.registerProvider("agnes", {
    name: "Agnes AI",
    baseUrl: "https://apihub.agnes-ai.com/v1",
    apiKey: "$AGNES_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "agnes-2.5-flash",
        name: "Agnes 2.5 Flash",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "agnes-2.5-pro",
        name: "Agnes 2.5 Pro",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "agnes-2.5-pro-alpha",
        name: "Agnes 2.5 Pro Alpha",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "agnes-2.0-flash",
        name: "Agnes 2.0 Flash",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 32768,
      },
    ],
  });

  // — Agnes China —
  pi.registerProvider("agnes-cn", {
    name: "Agnes AI (CN)",
    baseUrl: "https://api.agnes-ai.cn/v1",
    apiKey: "$AGNES_CN_API_KEY",
    api: "openai-completions",
    models: [
      {
        id: "agnes-2.5-flash",
        name: "Agnes 2.5 Flash",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "agnes-2.5-pro",
        name: "Agnes 2.5 Pro",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "agnes-2.5-pro-alpha",
        name: "Agnes 2.5 Pro Alpha",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 65536,
      },
      {
        id: "agnes-2.0-flash",
        name: "Agnes 2.0 Flash",
        reasoning: false,
        input: ["text", "image"],
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
        contextWindow: 1048576,
        maxTokens: 32768,
      },
    ],
  });
}
