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
    name: "Foyera Media",
    subtitle: "AI-powered onchain marketing studio",
    description: "Launch and measure campaigns with autonomous, trustless workflows.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/foyera-logo.svg`,
    splashImageUrl: `${ROOT_URL}/hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social", 
    tags: ["marketing", "onchain", "automation", "waitlist"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: "Smarter omnichannel growth for crypto teams.",
    ogTitle: "Foyera Media | Autonomous onchain marketing studio",
    ogDescription: "Join the early-access waitlist for Foyera Media and orchestrate high-converting onchain campaigns with confidence.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;
