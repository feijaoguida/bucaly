'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Share2,
  Package,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ProductCard } from '@/components/product-card'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function StarRating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`${value} de 5 estrelas`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= Math.round(value)
                ? 'fill-primary text-primary'
                : 'fill-muted text-muted-foreground'
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{value.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({count} avaliações)</span>
    </div>
  )
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Garante ao menos 4 thumbnails usando a mesma imagem com variações de query
  const allImages = images.length >= 2
    ? images
    : [
        images[0],
        `${images[0]}&v=2`,
        `${images[0]}&v=3`,
        `${images[0]}&v=4`,
      ]

  const prev = () => setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
        <Image
          src={allImages[activeIndex]}
          alt={name}
          fill
          priority
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Dot indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all',
                i === activeIndex ? 'bg-primary w-4' : 'bg-background/70'
              )}
              aria-label={`Ver imagem ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {allImages.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'relative aspect-square rounded-lg overflow-hidden bg-muted border-2 transition-all',
              i === activeIndex
                ? 'border-primary shadow-md scale-105'
                : 'border-transparent hover:border-muted-foreground/40'
            )}
          >
            <Image
              src={src}
              alt={`${name} - foto ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Info Panel ───────────────────────────────────────────────────────────────

function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [isFav, setIsFav] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  const hasDiscount = product.precoOriginal && product.precoOriginal > product.preco
  const discountPercent = hasDiscount
    ? Math.round((1 - product.preco / product.precoOriginal!) * 100)
    : 0
  const inStock = product.estoque > 0
  const lowStock = product.estoque > 0 && product.estoque <= 10

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      await api.addToCart(product.id, quantity)
      toast.success('Produto adicionado ao carrinho!', {
        action: { label: 'Ver carrinho', onClick: () => window.location.href = '/carrinho' },
      })
    } catch {
      toast.error('Erro ao adicionar ao carrinho.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.nome, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiado!')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Brand + badges */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            {product.marca}
          </span>
          {product.novo && (
            <Badge className="bg-primary text-primary-foreground text-xs">Novo</Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Compartilhar produto"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance leading-tight">
        {product.nome}
      </h1>

      {/* Rating */}
      <StarRating value={product.mediaAvaliacoes} count={product.avaliacoes} />

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-foreground">
          {formatPrice(product.preco)}
        </span>
        {hasDiscount && (
          <span className="text-xl text-muted-foreground line-through mb-1">
            {formatPrice(product.precoOriginal!)}
          </span>
        )}
      </div>

      {/* Installments hint */}
      <p className="text-sm text-muted-foreground -mt-2">
        Em até <span className="font-semibold text-foreground">6x de {formatPrice(product.preco / 6)}</span> sem juros
      </p>

      <Separator />

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {inStock ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            <span className="text-sm font-medium text-green-600">
              {lowStock ? `Apenas ${product.estoque} em estoque` : 'Em estoque'}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span className="text-sm font-medium text-destructive">Fora de estoque</span>
          </>
        )}
        <span className="text-sm text-muted-foreground">· SKU: {product.sku}</span>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">Quantidade</span>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.estoque, q + 1))}
            disabled={quantity >= product.estoque}
            className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <Button
          className="flex-1 h-12 text-base font-semibold gap-2"
          onClick={handleAddToCart}
          disabled={!inStock || addingToCart}
        >
          <ShoppingCart className="h-5 w-5" />
          {addingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={cn(
            'h-12 w-12 shrink-0 border-border transition-colors',
            isFav && 'bg-primary/10 border-primary text-primary'
          )}
          onClick={() => {
            setIsFav((f) => !f)
            toast(isFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos!')
          }}
          aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={cn('h-5 w-5', isFav && 'fill-primary text-primary')} />
        </Button>
      </div>

      {/* Buy now */}
      <Button variant="outline" className="h-12 text-base font-semibold" asChild>
        <Link href="/checkout">Comprar Agora</Link>
      </Button>

      <Separator />

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Truck, label: 'Frete Grátis', sub: 'acima de R$ 200' },
          { icon: ShieldCheck, label: 'Pagamento Seguro', sub: 'SSL 256 bits' },
          { icon: RotateCcw, label: 'Devolução', sub: '30 dias' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/60">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Review mock data ─────────────────────────────────────────────────────────

const mockReviews = [
  {
    id: '1',
    nome: 'Dra. Ana Beatriz',
    nota: 5,
    data: '12 fev 2025',
    comentario:
      'Produto excelente! A qualidade superou minhas expectativas. Uso diariamente no consultório e os pacientes adoram o resultado.',
    avatar: 'A',
  },
  {
    id: '2',
    nome: 'Dr. Carlos Mendes',
    nota: 5,
    data: '3 jan 2025',
    comentario:
      'Ótimo custo-benefício. A entrega foi rápida e o produto chegou bem embalado. Recomendo a todos os colegas.',
    avatar: 'C',
  },
  {
    id: '3',
    nome: 'Mariana Oliveira',
    nota: 4,
    data: '28 dez 2024',
    comentario:
      'Produto muito bom, apenas achei que o manual poderia ser mais detalhado. No geral, estou satisfeita.',
    avatar: 'M',
  },
]

function ReviewsSection({ product }: { product: Product }) {
  const ratingBars = [5, 4, 3, 2, 1]
  const totalReviews = product.avaliacoes

  return (
    <div className="flex flex-col gap-8">
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-2 md:min-w-[140px]">
          <span className="text-6xl font-bold text-foreground">
            {product.mediaAvaliacoes.toFixed(1)}
          </span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'h-5 w-5',
                  s <= Math.round(product.mediaAvaliacoes)
                    ? 'fill-primary text-primary'
                    : 'fill-muted text-muted-foreground'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">{totalReviews} avaliações</span>
        </div>

        <div className="flex flex-col gap-2 flex-1 w-full">
          {ratingBars.map((star) => {
            const pct = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : star === 2 ? 3 : 2
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-4 text-right">{star}</span>
                <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-7 text-right">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Reviews list */}
      <div className="flex flex-col gap-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                {review.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{review.nome}</span>
                  <span className="text-xs text-muted-foreground">{review.data}</span>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        'h-3 w-3',
                        s <= review.nota ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed pl-12">
              {review.comentario}
            </p>
            <Separator />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [prod, allProds] = await Promise.all([
          api.getProductById(id),
          api.getFeaturedProducts(),
        ])
        if (!prod) {
          router.push('/produtos')
          return
        }
        setProduct(prod)
        if (allProds) {
          setRelatedProducts(allProds.filter((p: Product) => p.id !== id).slice(0, 4))
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container-bucaly section-padding">
        <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
          <div className="flex-1 flex flex-col gap-4">
            <div className="aspect-square rounded-2xl bg-muted" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted" />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-8 w-3/4 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-10 w-40 bg-muted rounded" />
            <div className="h-px bg-muted" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" style={{ width: `${85 - i * 10}%` }} />
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <div className="flex-1 h-12 bg-muted rounded-lg" />
              <div className="w-12 h-12 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <nav
        aria-label="Navegação estrutural"
        className="border-b border-border bg-muted/30"
      >
        <div className="container-bucaly py-3">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Início
              </Link>
            </li>
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li>
              <Link href="/produtos" className="hover:text-primary transition-colors">
                Produtos
              </Link>
            </li>
            {product.categoria && (
              <>
                <li><ChevronRight className="h-3.5 w-3.5" /></li>
                <li>
                  <Link
                    href={`/produtos?categoria=${product.categoriaId}`}
                    className="hover:text-primary transition-colors"
                  >
                    {product.categoria.nome}
                  </Link>
                </li>
              </>
            )}
            <li><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground font-medium line-clamp-1 max-w-[200px]">
              {product.nome}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main content */}
      <section className="container-bucaly section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          <ImageGallery images={product.imagens} name={product.nome} />
          <ProductInfo product={product} />
        </div>
      </section>

      {/* Tabs: Descrição / Informações / Avaliações */}
      <section className="container-bucaly pb-16">
        <Tabs defaultValue="descricao">
          <TabsList className="h-auto p-1 bg-muted/60 rounded-xl w-full sm:w-auto">
            <TabsTrigger value="descricao" className="rounded-lg px-6 py-2.5 text-sm font-medium">
              Descrição
            </TabsTrigger>
            <TabsTrigger value="informacoes" className="rounded-lg px-6 py-2.5 text-sm font-medium">
              Informações
            </TabsTrigger>
            <TabsTrigger value="avaliacoes" className="rounded-lg px-6 py-2.5 text-sm font-medium">
              Avaliações ({product.avaliacoes})
            </TabsTrigger>
          </TabsList>

          {/* Descrição */}
          <TabsContent value="descricao" className="mt-8">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Sobre este produto
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.descricao}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Desenvolvido com os mais altos padrões de qualidade, este produto foi projetado para
                profissionais que buscam excelência em cada procedimento. Com tecnologia avançada e
                materiais de primeira linha, garante resultados superiores e durabilidade excepcional.
              </p>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Informações */}
          <TabsContent value="informacoes" className="mt-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Especificações Técnicas
              </h2>
              <div className="rounded-xl border border-border overflow-hidden">
                {[
                  { label: 'SKU', value: product.sku },
                  { label: 'Marca', value: product.marca },
                  { label: 'Categoria', value: product.categoria?.nome || '—' },
                  { label: 'Estoque', value: `${product.estoque} unidades` },
                  { label: 'Condição', value: 'Novo' },
                  { label: 'Garantia', value: '12 meses' },
                ].map(({ label, value }, i) => (
                  <div
                    key={label}
                    className={cn(
                      'flex items-center gap-4 px-5 py-3',
                      i % 2 === 0 ? 'bg-muted/40' : 'bg-background'
                    )}
                  >
                    <span className="text-sm text-muted-foreground min-w-[120px]">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Frete e Entrega</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Frete grátis para pedidos acima de R$ 200,00. Prazo de entrega: 3 a 7 dias úteis.
                    Entrega expressa disponível no checkout.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Avaliações */}
          <TabsContent value="avaliacoes" className="mt-8">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Avaliações dos Clientes
              </h2>
              <ReviewsSection product={product} />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container-bucaly">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Você também pode gostar
                </h2>
                <p className="text-muted-foreground mt-1">
                  Produtos selecionados para complementar sua compra
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex gap-2">
                <Link href="/produtos">
                  Ver todos <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <Button variant="outline" asChild className="w-full">
                <Link href="/produtos">Ver todos os produtos</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
