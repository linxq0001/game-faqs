import Link from "next/link";
import { PixelLogo } from "@/components/PixelLogo";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main className="wrap">
      <SiteHeader />

      <section className="not-found-panel panel" aria-labelledby="not-found-title">
        <PixelLogo />
        <span className="kicker">Signal Lost</span>
        <h1 id="not-found-title">Patch not found.</h1>
        <p>
          This route is not part of the public guide index, or the coverage is
          still private while we verify it.
        </p>
        <div className="detail-actions">
          <Link href="/games">Browse public games</Link>
          <Link href="/">Return home</Link>
        </div>
      </section>
    </main>
  );
}
