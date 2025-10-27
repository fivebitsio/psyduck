import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";
import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsPage } from "fumadocs-ui/page";
import Analytics from '../../../web/src/pages/analytics/index';

export async function loader() {
  return {
    tree: source.getPageTree(),
  };
}

function DemoPage({ loaderData }: { loaderData: { tree: PageTree.Root } }) {
  return (
    <DocsLayout {...baseOptions()} tree={loaderData.tree} nav={{ enabled: false, title: 'Psyduck' }}>
      <DocsPage>
        <DocsBody>
          <Analytics showTopBar={false} />
        </DocsBody>
      </DocsPage>
    </DocsLayout >
  );
}

export default DemoPage
