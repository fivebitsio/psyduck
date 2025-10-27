import { route, type RouteConfig } from "@react-router/dev/routes";

export default [
  route("", "docs/page.tsx", {
    id: "docs-home",
  }),
  route("docs/*", "docs/page.tsx"),
  route("demo", "routes/demo.tsx"),
  route("api/search", "docs/search.ts"),
] satisfies RouteConfig;
