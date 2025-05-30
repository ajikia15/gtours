"use client";

import { useCart } from "@/context/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Save } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CartCard from "@/components/cart-card";
import OrderSummary from "@/components/order-summary";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { reorderCartItems } from "@/data/cart";

export default function CartPage() {
  const cart = useCart();

  // Local state for drag and drop
  const [localItems, setLocalItems] = useState(cart.items);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update local items when cart items change from Firestore
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setLocalItems(cart.items);
    }
  }, [cart.items, hasUnsavedChanges]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(localItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalItems(items);
    setHasUnsavedChanges(true);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);

    try {
      const itemIds = localItems.map((item) => item.id);
      const result = await reorderCartItems(itemIds);

      if (result.success) {
        setHasUnsavedChanges(false);
        toast.success("Cart order saved");
      } else {
        toast.error(result.message || "Failed to save order");
      }
    } catch (error) {
      toast.error("Failed to save order");
      console.error("Save order error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setLocalItems(cart.items);
    setHasUnsavedChanges(false);
    toast.success("Changes discarded");
  };

  if (cart.loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-4">
            Start exploring our tours to add them to your cart
          </p>
          <Link href="/">
            <Button>Browse Tours</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Save Order Controls */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-amber-600 font-medium">
              Unsaved changes
            </span>
            <Button
              onClick={handleSaveOrder}
              disabled={isSaving}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Order"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDiscardChanges}>
              Discard
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="cart-items" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {localItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <CartCard
                            item={item}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Cart Summary - Using the enhanced OrderSummary */}
        <div className="lg:col-span-1">
          <OrderSummary mode="cart" showDetailedBreakdown={true} />
        </div>
      </div>
    </div>
  );
}
