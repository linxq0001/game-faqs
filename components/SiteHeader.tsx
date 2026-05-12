import Link from "next/link";
import { PixelLogo } from "./PixelLogo";

export function SiteHeader({ locale = "en" }: { locale?: string }) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <header className="site-header">
      <Link href={`${prefix}/`} className="brand" aria-label="Patch Signal home">
        <PixelLogo />
        <span>Patch Signal</span>
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        <Link href={`${prefix}/games`}>Game Guides</Link>
        <Link href={`${prefix}/games/battlestar-galactica-scattered-hopes`}>BSG: Scattered Hopes</Link>
      </nav>
      <form className="search-shell" role="search" action={`${prefix}/`} aria-label="Search guides">
        <label className="sr-only" htmlFor="site-search">
          Search guides
        </label>
        <input id="site-search" name="q" type="search" placeholder="Search guides..." />
      </form>
    </header>
  );
}