'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount = product.precoOriginal && product.precoOriginal > product.preco
  const discountPercent = hasDiscount
    ? Math.round((1 - product.preco / product.precoOriginal!) * 100)
    : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <Card className={cn('group overflow-hidden card-hover', className)}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.imagens[0] || '/placeholder.jpg'}
          alt={product.nome}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Link
          href={`/produtos/${product.id}`}
          className="absolute inset-0"
          aria-label={`Ver detalhes de ${product.nome}`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.novo && (
            <Badge className="bg-primary text-primary-foreground">
              Novo
            </Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
          <span className="sr-only">Adicionar aos favoritos</span>
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Brand */}
        {product.marca && (
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            {product.marca}
          </p>
        )}

        {/* Title */}
        <Link href={`/produtos/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors mb-2">
            {product.nome}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.descricao}
        </p>

        {/* Price and Cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.precoOriginal!)}
              </span>
            )}
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.preco)}
            </span>
          </div>

          <Button size="icon" className="shrink-0">
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Adicionar ao carrinho</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Variante horizontal para listas
interface ProductCardHorizontalProps {
  product: Product
  className?: string
}

export function ProductCardHorizontal({ product, className }: ProductCardHorizontalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <Card className={cn('flex flex-row overflow-hidden', className)}>
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-muted">
        <Image
          src={product.imagens[0] || '/placeholder.jpg'}
          alt={product.nome}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <Link href={`/produtos/${product.id}`}>
            <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
              {product.nome}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.descricao}
          </p>
        </div>
        <p className="text-lg font-bold text-foreground">
          {formatPrice(product.preco)}
        </p>
      </CardContent>
    </Card>
  )
}
