'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, CreditCard, Phone, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Formata CPF: 000.000.000-00
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  // Formata Telefone: (00) 00000-0000
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({ ...prev, cpf: formatted }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, telefone: formatted }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.senha.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const [nome, ...sobrenomeParts] = formData.nomeCompleto.split(' ')
      const sobrenome = sobrenomeParts.join(' ') || ''

      const result = await api.register({
        nome,
        sobrenome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        senha: formData.senha,
      })

      toast.success('Conta criada com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
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
            <Button variant="outline" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Cadastro de Cliente</CardTitle>
            <CardDescription>
              Junte-se à comunidade Bucaly e comece sua jornada hoje.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    placeholder="João Silva"
                    className="pl-10"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00"
                      className="pl-10"
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      maxLength={14}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      value={formData.telefone}
                      onChange={handlePhoneChange}
                      maxLength={15}
                      required
                    />
                  </div>
                </div>
              </div>

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
                <Label htmlFor="senha">Senha</Label>
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
                    minLength={8}
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
                <p className="text-xs text-muted-foreground">
                  Deve ter pelo menos 8 caracteres.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando conta...' : (
                  <>
                    Criar Conta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Entrar
                </Link>
              </p>
            </form>
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
