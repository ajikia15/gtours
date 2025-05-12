import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-primary">AAAA</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AAAA
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AAAA
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AAAA
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              AAAA
            </Link>
          </div>
          <div className="flex items-center space-x-4">user</div>
        </div>
      </div>
    </nav>
  );
}
