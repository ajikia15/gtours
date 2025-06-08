import { getTours } from "@/data/tours";
import CartClient from "./cart-client";

export default async function CartPage() {
  const { data: tours } = await getTours({
    pagination: { page: 1, pageSize: 50 },
  });

  return <CartClient tours={tours} />;
}
