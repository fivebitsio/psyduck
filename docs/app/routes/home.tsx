import type { Route } from "./+types/home";
import { Navigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Psyduck Documentation" },
    {
      name: "description",
      content: "Documentation for Psyduck Analytics Platform",
    },
  ];
}

export default function Home() {
  return <Navigate to="/docs" replace />;
}
