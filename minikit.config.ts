const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "Trend_Pulse", 
    subtitle: "Onchain trend intelligence for Base founders", 
    description: "Market intelligence, alerts, and revenue-ready launch flows for Base Mini Apps",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "business",
    tags: ["marketing", "analytics", "subscriptions", "waitlist"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "14-day free trial, revenue tiers ready for Base App and Farcaster",
    ogTitle: "Trend_Pulse | Onchain trend intelligence",
    ogDescription: "Publish to Base, run a 14-day free trial, and convert with three monthly tiers.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;
