import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useCart } from '../context/CartContext'
import type { CartItem as CartItemType } from '../context/CartContext'

export function CartItem({ item }: { item: CartItemType }) {
  const { removeFromCart, updateQuantity } = useCart()

  return (
    <div
      data-testid="cart-item"
      className="bg-card rounded-lg border shadow-sm p-4 flex items-center gap-4"
    >
      <img
        src={item.product.image}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 data-testid="cart-item-name" className="font-semibold text-foreground truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
        <p data-testid="cart-item-price" className="text-rose-500 font-bold mt-1">
          R$ {item.product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="icon"
          data-testid="btn-decrease"
          className="h-8 w-8"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          <Minus className="size-3" />
        </Button>
        <span data-testid="cart-item-quantity" className="w-8 text-center font-medium">
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

      <div className="shrink-0 text-right">
        <p className="font-semibold text-foreground mb-2">
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
  )
}