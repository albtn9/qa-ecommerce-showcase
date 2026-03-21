import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ShoppingCart, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { toast } from 'sonner'
import { getUsers } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = 'Email obrigatório'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido'
    if (!password) newErrors.password = 'Senha obrigatória'
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const { data: users } = await getUsers()
      const user = users.find(u => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        toast.success('Login realizado com sucesso!')
        setTimeout(() => navigate('/products'), 1000)
      } else {
        toast.error('Credenciais inválidas')
      }
    } catch {
      toast.error('Erro ao conectar com o servidor')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 mb-4">
            <ShoppingCart className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            ShopHub's
          </h1>
          
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg px-6 pt-6 pb-4">
            <CardTitle>Entrar</CardTitle>
            <CardDescription className="text-white/90">
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    placeholder="Digite seu email"
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    data-testid="input-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: undefined })
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button
                data-testid="btn-login"
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                size="lg"
              >
                Entrar
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Credenciais de teste
                  </span>
                </div>
              </div>
                  <div></div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                <p>📧 user@email.com</p>
                <p>🔒 123456</p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-6">
              <p className="text-sm text-muted-foreground">
                QA Ecommerce Showcase 🛒
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}