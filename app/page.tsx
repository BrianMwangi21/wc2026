import { Suspense } from "react";
import BracketApp from "./BracketApp";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-400">Loading bracket...</div>
      </div>
    }>
      <BracketApp />
    </Suspense>
  );
}
