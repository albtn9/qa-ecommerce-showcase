import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard, Lock, MapPin, Mail, ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { OrderSummary } from '../components/OrderSummary'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/api'
import { toast } from 'sonner'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState<'cartao' | 'pix' | ''>('')
  const [form, setForm] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [card, setCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleCardChange = (field: string, value: string) => {
    setCard(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.email) newErrors.email = 'Email obrigatório'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email inválido'
    if (!form.phone) newErrors.phone = 'Telefone obrigatório'
    if (!form.firstName) newErrors.firstName = 'Nome obrigatório'
    if (!form.lastName) newErrors.lastName = 'Sobrenome obrigatório'
    if (!form.address) newErrors.address = 'Endereço obrigatório'
    if (!form.city) newErrors.city = 'Cidade obrigatória'
    if (!form.state) newErrors.state = 'Estado obrigatório'
    if (!form.zipCode) newErrors.zipCode = 'CEP obrigatório'
    if (!payment) newErrors.payment = 'Selecione um meio de pagamento'
    if (payment === 'cartao') {
      if (!card.number || card.number.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Número inválido'
      if (!card.holder) newErrors.cardHolder = 'Nome obrigatório'
      if (!card.expiry) newErrors.cardExpiry = 'Validade obrigatória'
      if (!card.cvv || card.cvv.length !== 3) newErrors.cardCvv = 'CVV inválido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    if (!validate()) {
      toast.error('Preencha todos os campos corretamente')
      return
    }

    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await createOrder({
        userId: user.id,
        products: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        total,
        createdAt: new Date().toISOString(),
      })
      clearCart()
      toast.success('✅ Pedido realizado com sucesso!')
      setTimeout(() => navigate('/products'), 1500)
    } catch {
      toast.error('Erro ao confirmar pedido. Verifique se a API está ativa.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Sucesso !</h1>
          <h2 className="text-2xl font-bold mb-2">Compras Finalizadas</h2>
          <h2 className="text-muted-foreground mb-4">Seu carrinho está vazio</h2>          
          <p className="text-muted-foreground mb-4">Volte para Explorar novos produtos</p>
          <Button asChild className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Link to="/products">Explorar Produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" size="sm" asChild className="text-white hover:text-white hover:bg-white/10 mb-4">
            <Link to="/cart">
              <ChevronLeft className="size-4 mr-1" />
              Voltar ao Carrinho
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-white/90 mt-1">Complete seu pedido</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Informações de contato */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg px-6 pt-6 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="size-5" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        data-testid="input-email-checkout"
                        type="email"
                        placeholder="voce@exemplo.com"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        data-testid="input-phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={form.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg px-6 pt-6 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        data-testid="input-name"
                        value={form.firstName}
                        onChange={e => handleChange('firstName', e.target.value)}
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        data-testid="input-lastname"
                        value={form.lastName}
                        onChange={e => handleChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      data-testid="input-address"
                      value={form.address}
                      onChange={e => handleChange('address', e.target.value)}
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        data-testid="input-city"
                        value={form.city}
                        onChange={e => handleChange('city', e.target.value)}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        data-testid="input-state"
                        value={form.state}
                        onChange={e => handleChange('state', e.target.value)}
                        className={errors.state ? 'border-destructive' : ''}
                      />
                      {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        data-testid="input-zip"
                        value={form.zipCode}
                        onChange={e => handleChange('zipCode', e.target.value)}
                        className={errors.zipCode ? 'border-destructive' : ''}
                      />
                      {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pagamento */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg px-6 pt-6 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="size-5" />
                    Pagamento
                  </CardTitle>
                  <CardDescription className="text-white/90 flex items-center gap-1">
                    <Lock className="size-3" />
                    Seus dados estão protegidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Seleção de método */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      data-testid="btn-payment-cartao"
                      onClick={() => setPayment('cartao')}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                        payment === 'cartao'
                          ? 'border-rose-500 bg-rose-50 text-rose-500'
                          : 'border-gray-200 text-gray-600 hover:border-rose-300'
                      }`}
                    >
                      💳 Cartão
                    </button>
                    <button
                      type="button"
                      data-testid="btn-payment-pix"
                      onClick={() => setPayment('pix')}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition ${
                        payment === 'pix'
                          ? 'border-green-600 bg-green-50 text-green-600'
                          : 'border-gray-200 text-gray-600 hover:border-green-300'
                      }`}
                    >
                      ⚡ Pix
                    </button>
                  </div>
                  {errors.payment && <p className="text-sm text-destructive">{errors.payment}</p>}

                  {payment === 'cartao' && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          data-testid="input-card-number"
                          placeholder="1234 5678 9012 3456"
                          value={card.number}
                          onChange={e => handleCardChange('number', e.target.value)}
                          className={errors.cardNumber ? 'border-destructive' : ''}
                          maxLength={19}
                        />
                        {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">Nome no Cartão</Label>
                        <Input
                          id="cardHolder"
                          data-testid="input-card-holder"
                          placeholder="Nome Completo"
                          value={card.holder}
                          onChange={e => handleCardChange('holder', e.target.value)}
                          className={errors.cardHolder ? 'border-destructive' : ''}
                        />
                        {errors.cardHolder && <p className="text-sm text-destructive">{errors.cardHolder}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Validade</Label>
                          <Input
                            id="cardExpiry"
                            data-testid="input-card-expiry"
                            placeholder="MM/AA"
                            value={card.expiry}
                            onChange={e => handleCardChange('expiry', e.target.value)}
                            className={errors.cardExpiry ? 'border-destructive' : ''}
                            maxLength={5}
                          />
                          {errors.cardExpiry && <p className="text-sm text-destructive">{errors.cardExpiry}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            data-testid="input-card-cvv"
                            placeholder="123"
                            type="password"
                            value={card.cvv}
                            onChange={e => handleCardChange('cvv', e.target.value)}
                            className={errors.cardCvv ? 'border-destructive' : ''}
                            maxLength={3}
                          />
                          {errors.cardCvv && <p className="text-sm text-destructive">{errors.cardCvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {payment === 'pix' && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ⚡ Pix selecionado — pagamento instantâneo
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <OrderSummary showCheckoutButton={false} />
                <Button
                  data-testid="btn-confirm-order"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50"
                  size="lg"
                >
                  <Lock className="size-4 mr-2" />
                  {loading ? 'Processando...' : 'Confirmar Pedido'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}