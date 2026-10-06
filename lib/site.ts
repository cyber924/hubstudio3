const PRODUCTION_ORIGIN = "https://hubstudioai.co.kr";
const RETIRED_HOSTS = new Set([
  "hubstudio3.vercel.app",
  "hub-studio3.herestay-4226.chatgpt.site",
  "your-project.vercel.app",
]);

export function siteOrigin(env: Record<string, string | undefined> = process.env) {
  const explicit = env.SITE_URL?.trim();
  if (!explicit) return PRODUCTION_ORIGIN;
  const url = new URL(explicit.includes("://") ? explicit : `https://${explicit}`);
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("SITE_URL은 HTTP 또는 HTTPS 주소여야 합니다.");
  }
  // Ignore previous deployment origins still present in Vercel settings.
  if (RETIRED_HOSTS.has(url.hostname) || url.hostname === "www.hubstudioai.co.kr") {
    return PRODUCTION_ORIGIN;
  }
  return url.origin;
}

export const SITE_ORIGIN = siteOrigin();
