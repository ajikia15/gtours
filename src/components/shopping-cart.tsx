import { ShoppingCartIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function ShoppingCart() {
  return (
    <Link href="/account/cart">
      <ShoppingCartIcon className="h-4 w-4" />
    </Link>
  );
}
