// Agnes AI provider (OpenAI-compatible) — https://agnes-ai.com
// Docs: https://agnes-ai.com/zh-Hans/docs/overview
// Auth: AGNES_API_KEY env var (user-level Windows env var)
//
// Model discovery: fetches /v1/models dynamically at startup.
// Falls back to the built-in seed list when the API is unreachable.

// ---------------------------------------------------------------------------
// Model helpers
// ---------------------------------------------------------------------------

function detectLimits(id) {
  if (id.startsWith("agnes-2.5")) return { contextWindow: 1048576, maxTokens: 65536 };
  if (id.startsWith("agnes-2.0")) return { contextWindow: 1048576, maxTokens: 32768 };
  // Sensible defaults for unknown models
  return { contextWindow: 131072, maxTokens: 32768 };
}

function convertModel(model) {
  const id = model.id;
  return {
    id,
    name: model.id || id,
    reasoning: false,
    input: ["text", "image"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    ...detectLimits(id),
  };
}

// ---------------------------------------------------------------------------
// Seed models (fallback when API discovery fails)
// ---------------------------------------------------------------------------

const AGNES_SEED = [
  "agnes-2.5-flash",
  "agnes-2.5-pro",
  "agnes-2.5-pro-alpha",
  "agnes-2.0-flash",
];

// ---------------------------------------------------------------------------
// Dynamic model fetch
// ---------------------------------------------------------------------------

async function fetchModels(baseUrl, apiKeyEnv) {
  const apiKey = process.env[apiKeyEnv];
  const headers = {};
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const res = await fetch(`${baseUrl}/models`, { headers, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const payload = await res.json();
  // OpenAI /v1/models returns { data: [{ id, ... }] }
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return data
    .filter((m) => m && m.id)
    .map(convertModel);
}

// ---------------------------------------------------------------------------
// Extension entry point
// ---------------------------------------------------------------------------

export default async function (pi) {
  const providers = [
    { id: "agnes", name: "Agnes AI", baseUrl: "https://apihub.agnes-ai.com/v1", apiKeyEnv: "AGNES_API_KEY" },
    { id: "agnes-cn", name: "Agnes AI (CN)", baseUrl: "https://api.agnes-ai.cn/v1", apiKeyEnv: "AGNES_CN_API_KEY" },
  ];

  for (const p of providers) {
    let models = [];
    try {
      models = await fetchModels(p.baseUrl, p.apiKeyEnv);
    } catch (error) {
      console.error(
        `[agnes] Live model fetch failed for ${p.id} (${error instanceof Error ? error.message : String(error)}). Using seed list.`
      );
    }

    if (models.length === 0) {
      models = AGNES_SEED.map((id) => convertModel({ id }));
    }

    pi.registerProvider(p.id, {
      name: p.name,
      baseUrl: p.baseUrl,
      apiKey: `$${p.apiKeyEnv}`,
      api: "openai-completions",
      models,
    });
  }
}
