"use client";

import OrderSummary, { SimpleOrderItem } from "@/components/order-summary";

export default function OrderSummaryDemoPage() {
  // Sample items for demonstration
  const sampleItems: SimpleOrderItem[] = [
    {
      id: 1,
      name: "Tbilisi City Tour",
      price: 85,
      quantity: 2,
      description: "Full day city exploration",
    },
    {
      id: 2,
      name: "Wine Tasting Experience",
      price: 120,
      quantity: 1,
      description: "Authentic Georgian wine tour",
    },
    {
      id: 3,
      name: "Mountain Hiking Tour",
      price: 65,
      quantity: 1,
      description: "Scenic mountain trails",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Summary Components Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Reusable Order Summary - Cart Mode */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            OrderSummary (Cart Mode with Detailed Breakdown)
          </h2>
          <p className="text-gray-600 mb-4">
            The enhanced reusable component in cart mode - pulls data from cart
            context and shows detailed tour breakdown.
          </p>
          <OrderSummary
            mode="cart"
            showDetailedBreakdown={true}
            buttonText="Go to Checkout"
            buttonAction={() => console.log("Cart mode checkout")}
          />
        </div>

        {/* New Reusable Order Summary - Cart Mode Simple */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            OrderSummary (Cart Mode Simple)
          </h2>
          <p className="text-gray-600 mb-4">
            The same component with simple breakdown for minimal display.
          </p>
          <OrderSummary
            mode="cart"
            showDetailedBreakdown={false}
            buttonText="Go to Checkout"
            buttonAction={() => console.log("Cart mode checkout")}
          />
        </div>

        {/* New Reusable Order Summary - Custom Mode (Checkout) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            OrderSummary (Checkout Mode)
          </h2>
          <p className="text-gray-600 mb-4">
            The component in custom mode - used for checkout with custom items.
          </p>
          <OrderSummary
            mode="custom"
            customItems={sampleItems}
            isCheckout={true}
            disabled={true}
            disabledReason="Complete your profile to continue"
            showTripDetails={false}
            showBookingStatus={false}
            title="Checkout Summary"
          />
        </div>

        {/* New Reusable Order Summary - Custom Mode (Enabled) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            OrderSummary (Ready for Purchase)
          </h2>
          <p className="text-gray-600 mb-4">
            The same component but enabled for purchase.
          </p>
          <OrderSummary
            mode="custom"
            customItems={sampleItems}
            isCheckout={true}
            disabled={false}
            buttonAction={() => console.log("Processing payment...")}
            showTripDetails={false}
            showBookingStatus={false}
            title="Ready to Purchase"
          />
        </div>
      </div>

      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Benefits of the Enhanced OrderSummary Component
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            • <strong>Detailed Breakdown:</strong> Shows individual tours,
            activities, and pricing
          </li>
          <li>
            • <strong>Flexible:</strong> Works with both cart data and custom
            items
          </li>
          <li>
            • <strong>Reusable:</strong> Can be used on cart, checkout, and
            other order pages
          </li>
          <li>
            • <strong>Customizable:</strong> Many props to control appearance
            and behavior
          </li>
          <li>
            • <strong>Consistent:</strong> Same styling and behavior across
            different pages
          </li>
          <li>
            • <strong>Maintainable:</strong> One component to update instead of
            multiple similar ones
          </li>
          <li>
            • <strong>Interactive:</strong> Expandable tour details for better
            UX
          </li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium">Cart Page with Detailed Breakdown:</h3>
            <code className="block bg-white p-2 rounded mt-1">
              {`<OrderSummary 
  mode="cart" 
  showDetailedBreakdown={true}
/>`}
            </code>
          </div>
          <div>
            <h3 className="font-medium">Cart Page Simple:</h3>
            <code className="block bg-white p-2 rounded mt-1">
              {`<OrderSummary 
  mode="cart" 
  showDetailedBreakdown={false}
/>`}
            </code>
          </div>
          <div>
            <h3 className="font-medium">Checkout Page:</h3>
            <code className="block bg-white p-2 rounded mt-1">
              {`<OrderSummary 
  mode="custom" 
  customItems={orderItems}
  isCheckout={true}
  disabled={!profileComplete}
  showTripDetails={false}
/>`}
            </code>
          </div>
          <div>
            <h3 className="font-medium">Order Confirmation:</h3>
            <code className="block bg-white p-2 rounded mt-1">
              {`<OrderSummary 
  mode="custom"
  customItems={orderItems}
  showButton={false}
  title="Order Confirmed"
/>`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
