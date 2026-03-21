import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, ChevronLeft, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react'
import { getProduct } from '../services/api'
import type { Product } from '../services/api'
import { useCart } from '../context/CartContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { toast } from 'sonner'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await getProduct(Number(id))
        setProduct(res.data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
          <Button onClick={() => navigate('/products')}>Voltar aos Produtos</Button>
        </div>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product)
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
            <ChevronLeft className="size-4 mr-1" />
            Voltar aos Produtos
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Imagem */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-pink-500 border-0 text-base px-3 py-1">
                -{discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">Sem estoque</Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3 capitalize">{product.category}</Badge>
              <h1 data-testid="product-detail-name" className="text-3xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span data-testid="product-detail-price" className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                R$ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <Separator />

            {/* Quantidade */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quantidade</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    data-testid="btn-decrease-qty"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span data-testid="product-quantity" className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    data-testid="btn-increase-qty"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  data-testid="btn-add-to-cart-detail"
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="size-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button
                  data-testid="btn-buy-now"
                  variant="outline"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Comprar Agora
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => toast.success('Adicionado aos favoritos!')}
                >
                  <Heart className="size-5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Features cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Truck className="size-8 text-rose-500 mb-2" />
                  <h4 className="font-semibold text-sm">Frete Grátis</h4>
                  <p className="text-xs text-muted-foreground">Acima de R$ 200</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Shield className="size-8 text-rose-500 mb-2" />
                  <h4 className="font-semibold text-sm">Pagamento Seguro</h4>
                  <p className="text-xs text-muted-foreground">100% protegido</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <RefreshCw className="size-8 text-rose-500 mb-2" />
                  <h4 className="font-semibold text-sm">Fácil Devolução</h4>
                  <p className="text-xs text-muted-foreground">30 dias</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="features" className="mb-12">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Principais Características</h3>
                <ul className="space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-rose-500 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Descrição do Produto</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center py-8">
                <h3 className="font-semibold text-lg mb-4">Avaliações dos Clientes</h3>
                <p className="text-muted-foreground">Nenhuma avaliação ainda. Seja o primeiro!</p>
                <Button variant="outline" className="mt-4">Escrever Avaliação</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}