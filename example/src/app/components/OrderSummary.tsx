import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useCart } from '../context/CartContext';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export function OrderSummary({ showCheckoutButton = true, onCheckout }: OrderSummaryProps) {
  const { items } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 9.99) : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {shipping === 0 && subtotal > 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between text-base">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            ${total.toFixed(2)}
          </span>
        </div>
        {subtotal > 0 && subtotal < 100 && (
          <p className="text-xs text-muted-foreground">
            Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
          </p>
        )}
      </CardContent>
      {showCheckoutButton && (
        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            size="lg"
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
