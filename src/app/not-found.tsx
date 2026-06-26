import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[var(--background)] text-center p-8">
      <h1 className="text-8xl font-bold text-[var(--border)] font-mono tracking-tighter">404</h1>
      <h2 className="text-2xl font-semibold text-[var(--text-primary)] mt-8">Page not found</h2>
      <p className="text-base text-[var(--text-muted)] mt-2 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      
      <Link href="/" className="mt-8">
        <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-8">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
