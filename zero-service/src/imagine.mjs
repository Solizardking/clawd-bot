/**
 * xAI Imagine API: images, edits, and async video.
 * Used by grok function tools, /imagine HTTP routes, and pumpfun trade cards.
 */
const BASE = () => (process.env.XAI_BASE_URL ?? "https://api.x.ai/v1").replace(/\/$/, "");
const IMAGE_MODEL = () => process.env.XAI_IMAGE_MODEL ?? "grok-imagine-image-quality";
const VIDEO_MODEL = () => process.env.XAI_VIDEO_MODEL ?? "grok-imagine-video-1.5";
const VIDEO_EDIT_MODEL = () => process.env.XAI_VIDEO_EDIT_MODEL ?? "grok-imagine-video";

function apiKey() {
  return (process.env.XAI_API_KEY ?? "").trim();
}

function requireKey() {
  const key = apiKey();
  if (!key) throw new Error("XAI_API_KEY is not set");
  return key;
}

async function xaiFetch(path, { method = "POST", body } = {}) {
  const res = await fetch(`${BASE()}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireKey()}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`xAI ${res.status}: ${data.error?.message || data.message || text.slice(0, 300)}`);
  }
  return data;
}

export function mediaRef(input) {
  if (!input) return null;
  if (typeof input === "string") {
    if (/^file_[0-9a-f-]{8,}$/i.test(input)) return { file_id: input };
    return { url: input };
  }
  if (input.file_id || input.fileId) return { file_id: input.file_id || input.fileId };
  if (input.url) return { url: input.url };
  return null;
}

export function storageOptions(opts = {}, filename) {
  if (opts.persist === false) return undefined;
  const raw = opts.storage_options || opts.storageOptions;
  if (!raw && !opts.persist && !opts.filename && opts.publicUrl !== true) return undefined;
  return {
    filename: raw?.filename || opts.filename || filename,
    public_url: raw?.public_url ?? opts.publicUrl ?? true,
    ...(raw?.expires_after || opts.expiresAfter
      ? { expires_after: Number(raw?.expires_after || opts.expiresAfter) }
      : {}),
  };
}

function imagesFrom(data) {
  return (data?.data ?? []).map((row) => ({
    url: row.url ?? null,
    publicUrl: row.file_output?.public_url ?? null,
    displayUrl: row.file_output?.public_url || row.url || null,
    b64: row.b64_json ?? null,
    fileId: row.file_output?.file_id ?? null,
    fileOutput: row.file_output ?? null,
  })).filter((row) => row.displayUrl || row.b64);
}

export async function generateImages({ prompt, n, aspectRatio, resolution, filename, persist = true, publicUrl = true } = {}) {
  if (!String(prompt || "").trim()) throw new Error("Image prompt is empty");
  const body = {
    model: IMAGE_MODEL(),
    prompt,
    response_format: "url",
  };
  if (n > 1) body.n = n;
  if (aspectRatio) body.aspect_ratio = aspectRatio;
  if (resolution) body.resolution = resolution;
  const storage = storageOptions({ persist, publicUrl, filename }, "imagine.jpg");
  if (storage) body.storage_options = storage;
  const data = await xaiFetch("/images/generations", { body });
  const images = imagesFrom(data);
  if (!images.length) throw new Error("xAI returned no images");
  return { ...data, images };
}

export async function editImages({ prompt, image, images, filename, persist = true, publicUrl = true } = {}) {
  if (!String(prompt || "").trim()) throw new Error("Edit prompt is empty");
  const sources = [image, ...(images || [])].map(mediaRef).filter(Boolean).slice(0, 3);
  if (!sources.length) throw new Error("Image edit needs a url or file_id");
  const body = {
    model: IMAGE_MODEL(),
    prompt,
    response_format: "url",
  };
  if (sources.length === 1) body.image = sources[0];
  else body.images = sources;
  const storage = storageOptions({ persist, publicUrl, filename }, "edit.jpg");
  if (storage) body.storage_options = storage;
  const data = await xaiFetch("/images/edits", { body });
  const out = imagesFrom(data);
  if (!out.length) throw new Error("xAI returned no edited images");
  return { ...data, images: out };
}

export async function startVideo({ prompt, image, video, duration = 5, aspectRatio = "16:9", resolution = "720p", extend = false, filename, persist = true, publicUrl = true } = {}) {
  if (!String(prompt || "").trim()) throw new Error("Video prompt is empty");
  const body = { model: VIDEO_MODEL(), prompt, duration, aspect_ratio: aspectRatio, resolution };
  const storage = storageOptions({ persist, publicUrl, filename }, "imagine.mp4");
  if (storage) body.storage_options = storage;
  let path = "/videos/generations";
  const videoRef = mediaRef(video);
  const imageRef = mediaRef(image);
  if (videoRef && extend) {
    path = "/videos/extensions";
    body.video = videoRef;
  } else if (videoRef) {
    path = "/videos/edits";
    body.model = VIDEO_EDIT_MODEL();
    body.video = videoRef;
    delete body.duration;
    delete body.aspect_ratio;
    delete body.resolution;
  } else if (imageRef) {
    body.image = imageRef;
  }
  return xaiFetch(path, { body });
}

export async function getVideo(requestId) {
  return xaiFetch(`/videos/${encodeURIComponent(requestId)}`, { method: "GET" });
}

export async function waitForVideo(requestId, { intervalMs = 5000, timeoutMs = 600000, onStatus } = {}) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const data = await getVideo(requestId);
    onStatus?.(data);
    if (data.status === "done") {
      const url = data.video?.file_output?.public_url || data.video?.url;
      if (!url) throw new Error("Video finished without a URL");
      return {
        ...data,
        request_id: requestId,
        url,
        publicUrl: data.video?.file_output?.public_url ?? null,
        fileId: data.video?.file_output?.file_id ?? null,
      };
    }
    if (data.status === "failed" || data.status === "expired") {
      throw new Error(`Video ${data.status}: ${data.error?.message || data.status}`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Video generation timed out");
}

export async function generateVideo(opts = {}) {
  const started = await startVideo(opts);
  if (!started.request_id) throw new Error("xAI video did not return request_id");
  if (opts.wait === false) return { ...started, status: "pending" };
  return waitForVideo(started.request_id, opts);
}

export function imagineHealth() {
  return {
    configured: Boolean(apiKey()),
    imageModel: IMAGE_MODEL(),
    videoModel: VIDEO_MODEL(),
  };
}
