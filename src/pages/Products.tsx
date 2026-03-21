import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, SlidersHorizontal, ShoppingCart } from 'lucide-react'
import { getProducts } from '../services/api'
import type { Product } from '../services/api'
import { useCart } from '../context/CartContext'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'
import { Badge } from '../components/ui/badge'
import { toast } from 'sonner'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const { addToCart, items } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getProducts()
        setProducts(res.data)
      } catch {
        setError('Erro ao carregar produtos. Verifique se a API está ativa.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const categories = [...new Set(products.map(p => p.category))]

  const filtered = useMemo(() => {
    let result = products
    if (selectedCategories.length > 0)
      result = result.filter(p => selectedCategories.includes(p.category))
    if (priceRange === 'under50') result = result.filter(p => p.price < 50)
    else if (priceRange === '50to150') result = result.filter(p => p.price >= 50 && p.price < 150)
    else if (priceRange === '150to250') result = result.filter(p => p.price >= 150 && p.price < 250)
    else if (priceRange === 'over250') result = result.filter(p => p.price >= 250)
    if (inStockOnly) result = result.filter(p => p.inStock)
    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)
    return result
  }, [products, selectedCategories, priceRange, sortBy, inStockOnly])

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0)

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={category} className="cursor-pointer capitalize">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="font-semibold mb-3">Faixa de Preço</h3>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os preços</SelectItem>
            <SelectItem value="under50">Até R$ 50</SelectItem>
            <SelectItem value="50to150">R$ 50 - R$ 150</SelectItem>
            <SelectItem value="150to250">R$ 150 - R$ 250</SelectItem>
            <SelectItem value="over250">Acima de R$ 250</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
        />
        <Label htmlFor="inStock" className="cursor-pointer">Somente em estoque</Label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Nossos Produtos</h1>
            <p className="text-white/90">Descubra nossa coleção de produtos premium</p>
          </div>
          <Button
            data-testid="btn-cart"
            variant="secondary"
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="size-4" />
            Carrinho ({cartCount})
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="size-5" />
                <h2 className="font-semibold text-lg">Filtros</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <p className="text-muted-foreground">
                Exibindo <span className="font-semibold text-foreground">{filtered.length}</span> produtos
              </p>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destaques</SelectItem>
                    <SelectItem value="price-low">Menor preço</SelectItem>
                    <SelectItem value="price-high">Maior preço</SelectItem>
                    <SelectItem value="rating">Mais avaliados</SelectItem>
                  </SelectContent>
                </Select>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <SlidersHorizontal className="size-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                      <SheetDescription>Refine sua busca</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {loading && <p className="text-gray-600" data-testid="products-loading">Carregando produtos...</p>}
            {error && <p className="text-red-500" data-testid="products-error">{error}</p>}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSelectedCategories([])
                  setPriceRange('all')
                  setInStockOnly(false)
                }}>
                  Limpar filtros
                </Button>
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(product => {
                  const discount = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0

                  return (
                    <div
                      key={product.id}
                      data-testid="product-card"
                      className="bg-card rounded-lg border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        {discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 border-0">
                            -{discount}% OFF
                          </Badge>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary">Sem estoque</Badge>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h2
                          data-testid="product-name"
                          className="font-semibold text-foreground cursor-pointer hover:text-rose-500 transition-colors"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          {product.name}
                        </h2>

                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <p data-testid="product-price" className="text-rose-500 font-bold text-lg">
                            R$ {product.price.toFixed(2)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-muted-foreground text-sm line-through">
                              R$ {product.originalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>

                        <Button
                          data-testid="btn-add-to-cart"
                          onClick={() => {
                            addToCart(product)
                            toast.success(`${product.name} adicionado ao carrinho!`)
                          }}
                          disabled={!product.inStock}
                          className="mt-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 mt-3"
                        >
                          <ShoppingCart className="size-4 mr-2" />
                          {product.inStock ? 'Adicionar ao carrinho' : 'Sem estoque'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}