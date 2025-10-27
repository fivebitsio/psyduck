import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Psyduck Documentation' },
    { name: 'description', content: 'Documentation for Psyduck Analytics Platform' },
  ];
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Psyduck Analytics</h1>
        <p className="text-fd-muted-foreground mb-4">
          Privacy-friendly analytics platform for tracking website visitors.
        </p>
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to="/docs"
        >
          Get Started
        </Link>
      </div>
    </HomeLayout>
  );
}
