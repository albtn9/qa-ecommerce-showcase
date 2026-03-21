import { Link, useNavigate } from 'react-router';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { CartItem } from '../components/CartItem';
import { OrderSummary } from '../components/OrderSummary';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { items } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-white hover:bg-white/10 mb-4">
            <Link to="/products">
              <ChevronLeft className="size-4 mr-1" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-white/90 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <OrderSummary onCheckout={() => navigate('/checkout')} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="size-24 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              size="lg"
              asChild
            >
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
