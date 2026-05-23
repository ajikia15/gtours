import {
  PhoneIcon,
  MailIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.91a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-1.34z" />
    </svg>
  );
}

export default function UtilityBar() {
  return (
    <div className="hidden md:block w-full bg-brand-primary text-white/85 text-xs">
      <div className="container mx-auto flex h-9 items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href="tel:+995511199189"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <PhoneIcon className="h-3.5 w-3.5" />
            <span>+995 511 199 189</span>
          </a>
          <span className="h-3.5 w-px bg-white/15" />
          <a
            href="mailto:georgiatraveltours.info@gmail.com"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <MailIcon className="h-3.5 w-3.5" />
            <span>georgiatraveltours.info@gmail.com</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/profile.php?id=61590150298732"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-white transition-colors"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://www.instagram.com/georgiatravelt/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-white transition-colors"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://www.tiktok.com/@georgia.travel.to"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:text-white transition-colors"
          >
            <TikTokIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://www.youtube.com/channel/UC0yqJXO-d-YSY_pbWjn_U4w"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-white transition-colors"
          >
            <YoutubeIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
