import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Every route is static, so export plain HTML for Firebase Hosting (no
  // server). The image optimizer needs a server, so serve images as-is.
  output: "export",
  images: { unoptimized: true },
  // A stray lockfile in the parent directory makes Next infer the wrong
  // workspace root, which mis-traces files on deploy. Pin it to this project.
  outputFileTracingRoot: here,
};

export default nextConfig;
