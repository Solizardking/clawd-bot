/**
 * Pure install-plan resolution for clawdbot-install.
 * No network, no filesystem side effects — safe for dry-run and unit tests.
 */

/** Primary public one-shot surface (Cheshire Terminal install host). */
export const DEFAULT_EDGE_INSTALL_URL = "https://install.cheshireterminal.ai";
/** Path alias on the terminal SPA host (only if CF proxies the apex). */
export const PATH_EDGE_INSTALL_URL = "https://cheshireterminal.ai/install";
/** Legacy Cloudflare custom-domain alias (still served by the same Worker). */
export const LEGACY_EDGE_INSTALL_URL = "https://install.onchainai.fund";
export const DEFAULT_RAW_INSTALL_URL =
  "https://raw.githubusercontent.com/Solizardking/clawdbot-go/main/install.sh";
export const DEFAULT_ZK_METADATA_URL =
  "https://install.cheshireterminal.ai/.well-known/clawdbot-zk.json";
export const DEFAULT_INSTALL_DIR_SUFFIX = ".clawdbot";

/**
 * @typedef {object} PlanOptions
 * @property {string} [platform] process.platform override
 * @property {string} [arch] process.arch override
 * @property {string} [home] $HOME override
 * @property {string} [installDir] CLAWDBOT_INSTALL_DIR override
 * @property {string} [binDir] CLAWDBOT_BIN_DIR override
 * @property {string} [ref] CLAWDBOT_REF (git/archive ref)
 * @property {string} [sourceMode] archive|git
 * @property {boolean} [complete] CLAWDBOT_INSTALL_COMPLETE
 * @property {boolean} [coreAi] CLAWDBOT_INSTALL_CORE_AI
 * @property {boolean|null} [vulcan] CLAWDBOT_INSTALL_VULCAN (null = default)
 * @property {string} [installUrl] primary installer script URL
 * @property {string} [rawInstallUrl] GitHub raw fallback
 * @property {string} [prefer] "edge" | "raw"
 * @property {string[]} [extraEnv] extra env KEY=VALUE pairs for bash
 */

/**
 * Normalize Node platform → uname-style os label used by install.sh messaging.
 * @param {string} platform
 * @returns {string}
 */
export function resolveOs(platform) {
  switch (platform) {
    case "darwin":
      return "darwin";
    case "linux":
      return "linux";
    case "win32":
      return "windows";
    default:
      return platform || "unknown";
  }
}

/**
 * Normalize Node arch → install.sh arch labels (amd64|arm64).
 * @param {string} arch
 * @returns {string}
 */
export function resolveArch(arch) {
  switch (arch) {
    case "x64":
    case "x86_64":
      return "amd64";
    case "arm64":
    case "aarch64":
      return "arm64";
    default:
      return arch || "unknown";
  }
}

/**
 * Build the resolved one-shot install plan.
 * @param {PlanOptions} [opts]
 */
export function resolveInstallPlan(opts = {}) {
  const platform = opts.platform || process.platform;
  const arch = opts.arch || process.arch;
  const home = opts.home || process.env.HOME || process.env.USERPROFILE || "";
  const os = resolveOs(platform);
  const installArch = resolveArch(arch);

  const installDir =
    opts.installDir ||
    process.env.CLAWDBOT_INSTALL_DIR ||
    (home ? `${home.replace(/\/+$/, "")}/${DEFAULT_INSTALL_DIR_SUFFIX}` : `~/${DEFAULT_INSTALL_DIR_SUFFIX}`);

  const binDir =
    opts.binDir ||
    process.env.CLAWDBOT_BIN_DIR ||
    (home ? `${home.replace(/\/+$/, "")}/.local/bin` : "~/.local/bin");

  const ref = opts.ref || process.env.CLAWDBOT_REF || "main";
  const sourceMode = opts.sourceMode || process.env.CLAWDBOT_SOURCE_MODE || "archive";

  const complete =
    opts.complete === true ||
    process.env.CLAWDBOT_INSTALL_COMPLETE === "1" ||
    process.env.CLAWDBOT_INSTALL_COMPLETE === "true";

  const coreAi =
    opts.coreAi === true ||
    complete ||
    process.env.CLAWDBOT_INSTALL_CORE_AI === "1" ||
    process.env.CLAWDBOT_INSTALL_CORE_AI === "true";

  let vulcan = opts.vulcan;
  if (vulcan === undefined || vulcan === null) {
    if (process.env.CLAWDBOT_INSTALL_VULCAN === "0") vulcan = false;
    else if (process.env.CLAWDBOT_INSTALL_VULCAN === "1") vulcan = true;
    else vulcan = true; // install.sh default
  }

  const prefer = opts.prefer || process.env.CLAWDBOT_INSTALL_PREFER || "edge";
  const edgeUrl = opts.installUrl || process.env.CLAWDBOT_INSTALL_URL || DEFAULT_EDGE_INSTALL_URL;
  const rawUrl =
    opts.rawInstallUrl || process.env.CLAWDBOT_RAW_INSTALL_URL || DEFAULT_RAW_INSTALL_URL;
  const primaryUrl = prefer === "raw" ? rawUrl : edgeUrl;
  // Live install probe order: preferred edge → legacy CF host → raw GitHub install.sh
  const candidateUrls =
    prefer === "raw"
      ? [rawUrl, edgeUrl, LEGACY_EDGE_INSTALL_URL]
      : [edgeUrl, LEGACY_EDGE_INSTALL_URL, rawUrl];
  const fallbackUrl = candidateUrls.find((u) => u !== primaryUrl) || rawUrl;

  /** @type {Record<string, string>} */
  const env = {
    CLAWDBOT_INSTALL_DIR: installDir,
    CLAWDBOT_BIN_DIR: binDir,
    CLAWDBOT_REF: ref,
    CLAWDBOT_SOURCE_MODE: sourceMode,
    CLAWDBOT_INSTALL_CORE_AI: coreAi ? "1" : "0",
    CLAWDBOT_INSTALL_VULCAN: vulcan ? "1" : "0",
  };
  if (complete) env.CLAWDBOT_INSTALL_COMPLETE = "1";

  if (Array.isArray(opts.extraEnv)) {
    for (const pair of opts.extraEnv) {
      const eq = pair.indexOf("=");
      if (eq > 0) env[pair.slice(0, eq)] = pair.slice(eq + 1);
    }
  }

  const curlOneShot = `curl -fsSL ${primaryUrl} | bash`;
  const npxOneShot = "npx clawdbot-install";

  return {
    package: "clawdbot-install",
    version: null, // filled by caller when package.json is available
    dryRun: true,
    platform,
    arch,
    os,
    installArch,
    home: home || null,
    installDir,
    binDir,
    ref,
    sourceMode,
    complete,
    coreAi,
    vulcan: Boolean(vulcan),
    prefer,
    primaryUrl,
    fallbackUrl,
    candidateUrls: [...new Set(candidateUrls.filter(Boolean))],
    edgeUrl,
    rawUrl,
    zkMetadataUrl: DEFAULT_ZK_METADATA_URL,
    installer: "install.sh",
    upstream: {
      edge: DEFAULT_EDGE_INSTALL_URL,
      pathEdge: PATH_EDGE_INSTALL_URL,
      legacyEdge: LEGACY_EDGE_INSTALL_URL,
      rawGitHub: DEFAULT_RAW_INSTALL_URL,
      zkMetadata: DEFAULT_ZK_METADATA_URL,
      repo: "https://github.com/Solizardking/clawdbot-go",
      terminal: "https://cheshireterminal.ai",
    },
    env,
    commands: {
      curl: curlOneShot,
      npx: npxOneShot,
      bashFetch: `curl -fsSL ${primaryUrl} | env ${Object.entries(env)
        .map(([k, v]) => `${k}=${shellQuote(v)}`)
        .join(" ")} bash`,
    },
    notes: [
      "Dry-run resolves the install plan only; it does not mutate $HOME or run install.sh.",
      "Live install probes candidateUrls in order and pipes the first script response to bash.",
      "If install.cheshireterminal.ai returns a Cloudflare Bot Fight 403, legacy install.onchainai.fund is used next.",
      "CLAWDBOT_INSTALL_COMPLETE=1 enables core-ai sidecar + full stack defaults.",
    ],
  };
}

/**
 * Minimal shell quoting for plan display (not a full shell escape).
 * @param {string} value
 */
export function shellQuote(value) {
  if (/^[A-Za-z0-9_./:@%+=,-]+$/.test(value)) return value;
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

/**
 * Parse CLI argv into plan options + runtime flags.
 * @param {string[]} argv
 */
export function parseArgs(argv) {
  /** @type {PlanOptions & { dryRun: boolean, help: boolean, json: boolean, version: boolean }} */
  const out = {
    dryRun: false,
    help: false,
    json: false,
    version: false,
    complete: false,
    coreAi: false,
    prefer: undefined,
    installDir: undefined,
    ref: undefined,
    installUrl: undefined,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--help" || a === "-h") out.help = true;
    else if (a === "--version" || a === "-V") out.version = true;
    else if (a === "--dry-run" || a === "--dryrun" || a === "-n") out.dryRun = true;
    else if (a === "--json") out.json = true;
    else if (a === "--complete") out.complete = true;
    else if (a === "--core-ai") out.coreAi = true;
    else if (a === "--no-vulcan") out.vulcan = false;
    else if (a === "--vulcan") out.vulcan = true;
    else if (a === "--prefer-raw") out.prefer = "raw";
    else if (a === "--prefer-edge") out.prefer = "edge";
    else if (a === "--dir" || a === "--install-dir") {
      out.installDir = argv[++i];
    } else if (a === "--ref") {
      out.ref = argv[++i];
    } else if (a === "--url" || a === "--install-url") {
      out.installUrl = argv[++i];
    } else if (a === "install" || a === "oneshot") {
      /* subcommand aliases — default action */
    } else if (a.startsWith("-")) {
      throw new Error(`Unknown flag: ${a}`);
    }
  }

  // Env dry-run also honored
  if (
    process.env.CLAWDBOT_INSTALL_DRY_RUN === "1" ||
    process.env.CLAWDBOT_INSTALL_DRY_RUN === "true" ||
    process.env.npm_config_dry_run === "true"
  ) {
    out.dryRun = true;
  }

  return out;
}
