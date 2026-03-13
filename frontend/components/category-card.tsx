import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Card className={cn('group overflow-hidden card-hover cursor-pointer', className)}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={category.imagem || '/placeholder.jpg'}
          alt={category.nome}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white text-lg">
            {category.nome}
          </h3>
          <p className="text-sm text-white/80">
            {category.descricao}
          </p>
        </div>
        <Link
          href={`/produtos?categoria=${category.slug}`}
          className="absolute inset-0"
          aria-label={`Ver produtos de ${category.nome}`}
        />
      </div>
    </Card>
  )
}
