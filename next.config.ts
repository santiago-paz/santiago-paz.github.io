import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves plain files: no Next server, so everything is prerendered.
  output: "export",

  // Emit `/about/index.html` rather than `/about.html`. Without this the export
  // writes both `projects/x.html` and a `projects/x/` directory (RSC payloads),
  // and which one a static host answers with for `/projects/x` is ambiguous.
  trailingSlash: true,

  // The default image loader needs a server to optimize on request.
  images: { unoptimized: true },
};

export default nextConfig;
