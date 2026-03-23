import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, ChevronLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useCart } from '../context/CartContext'
import { CartItem } from '../components/CartItem'
import { OrderSummary } from '../components/OrderSummary'

export default function Cart() {
  const { items } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
     <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-8">
  <div className="container mx-auto px-4">
    <div className="flex flex-col items-end sm:flex-row sm:items-center sm:justify-between">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-white hover:text-white hover:bg-white/10 self-start sm:self-auto"
      >
        <Link to="/products">
          <ChevronLeft className="size-4 mr-1" />
          Continuar Comprando
        </Link>
      </Button>
      <div className="text-right">
        <h1 className="text-3xl font-bold">Meu Carrinho</h1>
        <p className="text-white/90 mt-1">
          {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
        </p>
      </div>
    </div>
  </div>
</div>

      <div className="container mx-auto px-4 py-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <OrderSummary onCheckout={() => navigate('/checkout')} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="size-24 mx-auto text-muted-foreground/50 mb-4" />
            <h2 data-testid="empty-cart" className="text-2xl font-bold mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-muted-foreground mb-6">
              Parece que você ainda não adicionou nada ao carrinho.
            </p>
            <Button
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              size="lg"
              asChild
            >
              <Link to="/products">Explorar Produtos</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}