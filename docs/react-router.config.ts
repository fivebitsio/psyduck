import type { Config } from "@react-router/dev/config";
import { glob } from "node:fs/promises";

export default {
  ssr: true,
  async prerender() {
    const paths: string[] = ["/"];

    // Add the main docs paths
    paths.push("/docs");

    // Add paths for MDX files in content/docs
    for await (const entry of glob("content/docs/**/*.mdx")) {
      const path = entry
        .replace("content/docs/", "")
        .replace(".mdx", "")
        .replace("index/index", "")
        .replace("index", "")
        .replace(/\/$/, "");

      if (path) {
        paths.push(`/docs/${path}`);
      } else {
        paths.push("/docs");
      }
    }

    return paths;
  },
} satisfies Config;
