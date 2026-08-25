// SenseNova provider (OpenAI-compatible) — https://platform.sensenova.cn/docs
// Base URL: https://token.sensenova.cn/v1 ; auth via SENSENOVA_API_KEY env var
//
// Model discovery: fetches /v1/models dynamically at startup.
// Falls back to the built-in seed list when the API is unreachable.

// ---------------------------------------------------------------------------
// Model helpers
// ---------------------------------------------------------------------------

const effortMap = { minimal: null, low: "low", medium: "medium", high: "high", xhigh: null, max: null };

const REASONING_IDS = new Set([
  "sensenova-6.8-flash-lite",
  "deepseek-v4-flash",
  "deepseek-v4-pro",
  "glm-5.2",
]);

const TEXT_ONLY_IDS = new Set([
  "deepseek-v4-flash",
  "deepseek-v4-pro",
  "glm-5.2",
]);

function detectLimits(id) {
  if (id === "sensenova-6.8-flash-lite") return { contextWindow: 262144, maxTokens: 65536 };
  if (id.startsWith("deepseek-v4")) return { contextWindow: 1048576, maxTokens: 65536 };
  if (id.startsWith("glm-5")) return { contextWindow: 1048576, maxTokens: 131072 };
  if (id.startsWith("sensenova")) return { contextWindow: 262144, maxTokens: 65536 };
  // Sensible defaults for unknown models
  return { contextWindow: 131072, maxTokens: 32768 };
}

function isReasoningModel(id) {
  if (REASONING_IDS.has(id)) return true;
  if (id.startsWith("deepseek") || id.startsWith("glm-")) return true;
  return false;
}

function convertModel(model) {
  const id = model.id;
  const entry = {
    id,
    name: model.id || id,
    reasoning: false,
    input: TEXT_ONLY_IDS.has(id) ? ["text"] : ["text", "image"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    ...detectLimits(id),
  };

  if (isReasoningModel(id)) {
    entry.reasoning = true;
    entry.thinkingLevelMap = effortMap;
    entry.compat = { supportsReasoningEffort: true, supportsDeveloperRole: false };
  }

  return entry;
}

// ---------------------------------------------------------------------------
// Seed models (fallback when API discovery fails)
// ---------------------------------------------------------------------------

const SENSENOVA_SEED = [
  "sensenova-6.8-flash-lite",
  "deepseek-v4-flash",
  "glm-5.2",
];

// ---------------------------------------------------------------------------
// Dynamic model fetch
// ---------------------------------------------------------------------------

async function fetchModels(baseUrl) {
  const apiKey = process.env["SENSENOVA_API_KEY"];
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
  let models = [];
  try {
    models = await fetchModels("https://token.sensenova.cn/v1");
  } catch (error) {
    console.error(
      `[sensenova] Live model fetch failed (${error instanceof Error ? error.message : String(error)}). Using seed list.`
    );
  }

  if (models.length === 0) {
    models = SENSENOVA_SEED.map((id) => convertModel({ id }));
  }

  pi.registerProvider("sensenova", {
    name: "SenseNova",
    baseUrl: "https://token.sensenova.cn/v1",
    apiKey: "$SENSENOVA_API_KEY",
    api: "openai-completions",
    models,
  });
}
