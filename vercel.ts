import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand: "npm run build",
  outputDirectory: "dist",
  framework: null,

  headers: [
    // Cache static assets aggressively — hashed filenames mean safe immutable caching
    routes.cacheControl("/assets/(.*)", {
      public: true,
      maxAge: "1 year",
      immutable: true,
    }),
    // Cache the SVG icon sprite for a week
    routes.cacheControl("/icons.svg", {
      public: true,
      maxAge: "1 week",
    }),
  ],

  crons: [
    // Warm the Etsy listings cache every 4 minutes so users never hit a cold fetch
    { path: "/api/etsy/listings", schedule: "*/4 * * * *" },
  ],
};
