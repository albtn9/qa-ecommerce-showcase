import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import type { CartItem as CartItemType } from "../context/CartContext";

export function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div
      data-testid="cart-item"
      className="bg-card rounded-lg border shadow-sm p-4 grid grid-cols-[auto_1fr] gap-4 items-center"
    >
      {/* 🔹 Coluna esquerda */}
      <div className="flex flex-col items-center gap-2">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            data-testid="btn-decrease"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <Minus className="size-3" />
          </Button>

          <span
            data-testid="cart-item-quantity"
            className="w-8 text-center font-medium"
          >
            {item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            data-testid="btn-increase"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </div>

      {/* Coluna direita */}
      <div className="flex flex-col text-right gap-1.5">
        <div>
          <h3 className="font-semibold text-foreground">{item.product.name}</h3>

          <p className="text-sm text-muted-foreground capitalize">
            {item.product.category}
          </p>

          <p className="text-rose-500 font-bold mt-1">
            R$ {item.product.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-end gap-1.5">
          <p className="font-semibold text-foreground">
            R$ {(item.product.price * item.quantity).toFixed(2)}
          </p>

          <Button
            variant="ghost"
            size="icon"
            data-testid="btn-remove"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => removeFromCart(item.product.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
