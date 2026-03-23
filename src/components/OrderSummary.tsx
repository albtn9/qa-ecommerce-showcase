import { ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { useCart } from '../context/CartContext'

interface OrderSummaryProps {
  onCheckout: () => void
}

export function OrderSummary({ onCheckout }: OrderSummaryProps) {
  const { items, total } = useCart()

  const subtotal = total
  const shipping = total >= 200 ? 0 : 19.90
  const finalTotal = subtotal + shipping

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>

      <div className="space-y-3 mb-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground truncate mr-2">
              {product.name} x{quantity}
            </span>
            <span className="shrink-0">R$ {(product.price * quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Frete</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-muted-foreground">
            Frete grátis em compras acima de R$ 200
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-bold text-lg mb-6">
        <span>Total</span>
        <span data-testid="cart-total" className="text-rose-500">
          R$ {finalTotal.toFixed(2)}
        </span>
      </div>

      <Button
        data-testid="btn-checkout"
        onClick={onCheckout}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
        size="lg"
      >
        <ShoppingCart className="size-4 mr-2" />
        Finalizar Compra
      </Button>
    </div>
  )
}