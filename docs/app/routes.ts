import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  route('', 'docs/page.tsx', {
    id: 'docs-home'
  }),
  route('docs/*', 'docs/page.tsx'),
  route('api/search', 'docs/search.ts'),
] satisfies RouteConfig;
