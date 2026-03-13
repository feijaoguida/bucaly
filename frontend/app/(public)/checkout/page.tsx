'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Truck, 
  Package, 
  Shield, 
  ArrowRight,
  Leaf,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { api } from '@/lib/api'
import type { Cart } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type PaymentMethod = 'cartao' | 'paypal'
type ShippingMethod = 'padrao' | 'expresso'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('padrao')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cartao')
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    endereco: '',
    cidade: '',
    cep: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cupom: '',
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const cartData = await api.getCart()
      if (cartData.items.length === 0) {
        router.push('/carrinho')
        return
      }
      setCart(cartData)
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
      router.push('/carrinho')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simula processamento do pedido
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Pedido realizado com sucesso!')
    await api.clearCart()
    router.push('/')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const shippingCost = shippingMethod === 'expresso' ? 15 : (cart?.frete || 0)
  const subtotal = cart?.subtotal || 0
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  if (loading) {
    return (
      <div className="container-bucaly py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!cart) return null

  return (
    <div className="container-bucaly py-6 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/carrinho">Carrinho</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/checkout">Informações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pagamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl md:text-3xl font-serif font-bold mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Forms */}
          <div className="flex-1 space-y-8">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="ex: João"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sobrenome">Sobrenome</Label>
                    <Input
                      id="sobrenome"
                      name="sobrenome"
                      placeholder="ex: Silva"
                      value={formData.sobrenome}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    placeholder="Número e nome da rua"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      placeholder="Cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      name="cep"
                      placeholder="CEP"
                      value={formData.cep}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-primary" />
                  Método de Envio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={(value) => setShippingMethod(value as ShippingMethod)}
                  className="space-y-3"
                >
                  <div className={cn(
                    'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                    shippingMethod === 'padrao' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                  )}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="padrao" id="padrao" />
                      <div>
                        <Label htmlFor="padrao" className="font-medium cursor-pointer">
                          Entrega Padrão
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Estimativa de 3-5 dias úteis
                        </p>
                      </div>
                    </div>
                    <span className="font-medium text-primary">
                      {cart.subtotal >= 200 ? 'Grátis' : formatPrice(5)}
                    </span>
                  </div>

                  <div className={cn(
                    'flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors',
                    shippingMethod === 'expresso' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                  )}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="expresso" id="expresso" />
                      <div>
                        <Label htmlFor="expresso" className="font-medium cursor-pointer">
                          Entrega Expressa
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Próximo dia útil
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">{formatPrice(15)}</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Método de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={paymentMethod === 'cartao' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPaymentMethod('cartao')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Cartão de Crédito
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    PayPal
                  </Button>
                </div>

                {paymentMethod === 'cartao' && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Data de Validade</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          placeholder="123"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Você será redirecionado ao PayPal para completar o pagamento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-96">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.produto.imagens[0] || '/placeholder.jpg'}
                          alt={item.produto.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.produto.nome}
                        </h4>
                        {item.variante && (
                          <p className="text-xs text-muted-foreground">
                            {item.variante}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {item.quantidade} x {formatPrice(item.produto.preco)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2">
                  <Input
                    name="cupom"
                    placeholder="Cupom de desconto"
                    value={formData.cupom}
                    onChange={handleInputChange}
                  />
                  <Button type="button" variant="secondary">
                    Aplicar
                  </Button>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span>{shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impostos</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    'Processando...'
                  ) : (
                    <>
                      Finalizar Pedido
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Processamento de pagamento seguro com criptografia SSL de 256 bits.</span>
                </div>

                {/* Eco Badge */}
                <div className="bg-primary/10 rounded-lg p-4 flex gap-3">
                  <Leaf className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Promessa Bucaly</p>
                    <p className="text-xs text-muted-foreground">
                      Cada pedido planta uma árvore. Embalagens 100% sustentáveis e frete neutro em carbono.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
