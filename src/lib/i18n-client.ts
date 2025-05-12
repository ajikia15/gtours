import { usePathname, useRouter } from "next/navigation";

export function useChangeLocale() {
  const router = useRouter();
  const pathname = usePathname();

  return (locale: string) => {
    const segments = pathname.split("/");
    if (segments[1] && ["en", "ge", "ru"].includes(segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
    router.push(segments.join("/"));
  };
}
