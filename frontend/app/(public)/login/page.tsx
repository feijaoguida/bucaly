'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    lembrar: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await api.login({
        email: formData.email,
        senha: formData.senha,
      })

      toast.success(`Bem-vindo(a) de volta, ${result.user.nome}!`)
      
      // Redireciona baseado no role ou query param
      if (redirect) {
        router.push(redirect)
      } else if (result.user.role.toLowerCase() === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (error) {
      toast.error('E-mail ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container-bucaly py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link href="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sobre
              </Link>
              <Link href="/produtos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Serviços
              </Link>
              <Link href="/contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </Link>
            </nav>
            <Button asChild>
              <Link href="/cadastro">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Entrar na sua conta</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar sua conta Bucaly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Endereço de E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                  <Link 
                    href="/esqueci-senha" 
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className="pl-10 pr-10"
                    value={formData.senha}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="lembrar"
                  checked={formData.lembrar}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, lembrar: checked as boolean }))
                  }
                />
                <Label htmlFor="lembrar" className="text-sm cursor-pointer">
                  Lembrar de mim
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/cadastro" className="text-primary hover:underline font-medium">
                  Criar conta
                </Link>
              </p>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Credenciais de demonstração:
              </p>
              <div className="text-xs space-y-1">
                <p><strong>Cliente:</strong> joao@email.com</p>
                <p><strong>Admin:</strong> admin@bucaly.com</p>
                <p className="text-muted-foreground">(qualquer senha funciona)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container-bucaly">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 Bucaly. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/privacidade" className="hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="hover:text-foreground transition-colors">
                Termos de Serviço
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
