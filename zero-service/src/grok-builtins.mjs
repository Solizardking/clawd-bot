/**
 * xAI server-side tools + request extras (priority tier, MCP).
 * These run on xAI, not locally. Client-side trading tools stay in grok-tools.mjs.
 */

export function envFlag(name, defaultOn = true) {
  const v = process.env[name];
  if (v == null || v === "") return defaultOn;
  return /^(1|true|yes|on)$/i.test(v);
}

export const XAI_SERVICE_TIER = (process.env.XAI_SERVICE_TIER ?? "priority").trim() || "default";
export const XAI_COMPACT_EVERY = Number(process.env.XAI_COMPACT_EVERY ?? 6);

export function builtinGrokTools() {
  const tools = [];
  if (envFlag("XAI_WEB_SEARCH", true)) {
    tools.push({ type: "web_search" });
  }
  if (envFlag("XAI_X_SEARCH", true)) {
    const xSearch = { type: "x_search" };
    if (envFlag("XAI_X_SEARCH_IMAGES", true)) xSearch.enable_image_understanding = true;
    if (envFlag("XAI_X_SEARCH_VIDEOS", true)) xSearch.enable_video_understanding = true;
    const allowed = csv("XAI_X_SEARCH_ALLOWED_HANDLES");
    const excluded = csv("XAI_X_SEARCH_EXCLUDED_HANDLES");
    if (allowed.length) xSearch.allowed_x_handles = allowed.slice(0, 20);
    else if (excluded.length) xSearch.excluded_x_handles = excluded.slice(0, 20);
    if (process.env.XAI_X_SEARCH_FROM) xSearch.from_date = process.env.XAI_X_SEARCH_FROM;
    if (process.env.XAI_X_SEARCH_TO) xSearch.to_date = process.env.XAI_X_SEARCH_TO;
    tools.push(xSearch);
  }
  if (envFlag("XAI_CODE_EXECUTION", true)) {
    tools.push({ type: "code_interpreter" });
  }
  if (envFlag("XAI_IMAGE_TOOL", true)) {
    tools.push({ type: "image_generation" });
  }
  if (envFlag("XAI_MCP", false) && process.env.XAI_MCP_URL) {
    const mcp = {
      type: "mcp",
      server_url: process.env.XAI_MCP_URL,
      server_label: process.env.XAI_MCP_LABEL || "mcp",
    };
    if (process.env.XAI_MCP_DESCRIPTION) mcp.server_description = process.env.XAI_MCP_DESCRIPTION;
    const allowedTools = csv("XAI_MCP_ALLOWED_TOOLS");
    if (allowedTools.length) mcp.allowed_tools = allowedTools;
    if (process.env.XAI_MCP_AUTHORIZATION) mcp.authorization = process.env.XAI_MCP_AUTHORIZATION;
    tools.push(mcp);
  }
  return tools;
}

function csv(name) {
  return (process.env[name] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function grokServiceTier(override) {
  const tier = String(override ?? XAI_SERVICE_TIER ?? "default").toLowerCase();
  return tier === "priority" ? "priority" : "default";
}

export function shouldCompact(turn, inputLength) {
  const every = Number.isFinite(XAI_COMPACT_EVERY) ? XAI_COMPACT_EVERY : 0;
  if (every <= 0) return false;
  if (turn > 0 && turn % every === 0) return true;
  return Number(inputLength) > 24;
}
