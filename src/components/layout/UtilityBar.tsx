import {
  PhoneIcon,
  MailIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";

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
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-white transition-colors"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-white transition-colors"
          >
            <InstagramIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://youtube.com"
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
