'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, Lock, Shield, Clock, Truck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ProductCard } from '@/components/product-card'
import { api } from '@/lib/api'
import { getPageData } from '@/lib/cms'
import type { Cart, Product } from '@/lib/types'
import { toast } from 'sonner'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pageData, setPageData] = useState<any>(null)

  useEffect(() => {
    loadCart()
    getPageData('carrinho').then(setPageData)
  }, [])

  const loadCart = async () => {
    try {
      // Adiciona alguns itens mock ao carrinho para demonstração
      await api.addToCart('1', 1, 'Natural Wood / Medium')
      await api.addToCart('2', 2, 'Matte White / Large')
      await api.addToCart('7', 1, 'Sage Green / Standard')
      
      const cartData = await api.getCart()
      setCart(cartData)

      const products = await api.getFeaturedProducts()
      setRelatedProducts(products.slice(0, 4))
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      const updatedCart = await api.updateCartItem(itemId, newQuantity)
      setCart(updatedCart)
    } catch (error) {
      toast.error('Erro ao atualizar quantidade')
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const updatedCart = await api.removeFromCart(itemId)
      setCart(updatedCart)
      toast.success('Item removido do carrinho')
    } catch (error) {
      toast.error('Erro ao remover item')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-bucaly py-12 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-bold mb-2">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-6">
          Adicione produtos ao carrinho para continuar comprando.
        </p>
        <Button asChild>
          <Link href="/produtos">Explorar Produtos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container-bucaly py-6 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Carrinho de Compras</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold">
          {pageData?.sections?.header?.title || pageData?.title || 'Carrinho de Compras'}
        </h1>
        {pageData?.sections?.header?.content && (
          <p className="text-muted-foreground mt-2">{pageData.sections.header.content}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          {/* Header - Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-6">Produto</div>
            <div className="col-span-2 text-center">Quantidade</div>
            <div className="col-span-2 text-center">Preço</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {/* Items */}
          <div className="divide-y">
            {cart.items.map((item) => (
              <div key={item.id} className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="md:col-span-6 flex gap-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.produto.imagens[0] || '/placeholder.jpg'}
                        alt={item.produto.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.produto.nome}
                        </h3>
                        {item.variante && (
                          <p className="text-sm text-muted-foreground">
                            {item.variante}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-destructive hover:text-destructive/80 flex items-center gap-1 w-fit"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remover
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                        disabled={item.quantidade <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantidade}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-left md:text-center text-sm md:text-base">
                    <span className="md:hidden text-muted-foreground">Preço: </span>
                    {formatPrice(item.produto.preco)}
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 text-left md:text-right font-semibold">
                    <span className="md:hidden text-muted-foreground font-normal">Total: </span>
                    {formatPrice(item.produto.preco * item.quantidade)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary">Frete Estimado</span>
                <span className="text-primary">
                  {cart.frete === 0 ? 'Grátis' : formatPrice(cart.frete)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impostos</span>
                <span>{formatPrice(cart.subtotal * 0.08)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(cart.total + cart.subtotal * 0.08)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  <Lock className="mr-2 h-4 w-4" />
                  Finalizar Compra
                </Link>
              </Button>

              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Aceitamos
                </p>
                <div className="flex justify-center gap-2">
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs">
                    Visa
                  </div>
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs">
                    MC
                  </div>
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center text-xs">
                    Pix
                  </div>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {cart.frete === 0 && (
                <div className="bg-primary/10 rounded-lg p-4 flex gap-3">
                  <Truck className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Frete Grátis neste pedido!</p>
                    <p className="text-xs text-muted-foreground">
                      Entrega estimada em 3-5 dias úteis.
                    </p>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex justify-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  Pagamento Seguro
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  30 Dias Devolução
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-xl md:text-2xl font-serif font-bold mb-6">
          Você também pode gostar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
