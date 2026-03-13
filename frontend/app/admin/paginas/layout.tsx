'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const pagesList = [
  { name: 'Home', slug: 'home' },
  { name: 'Listagem de Produtos', slug: 'produtos' },
  { name: 'Contato', slug: 'contato' },
  { name: 'Quem Somos', slug: 'sobre-nos' },
  { name: 'Carrinho', slug: 'carrinho' },
  { name: 'Checkout', slug: 'checkout' } // Adicionadas com slug hardcoded pra gerar na api
]

export default function PaginasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex-1 w-full flex flex-col space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editor de Páginas</h2>
          <p className="text-muted-foreground">
            Gerencie o layout e as seções dinâmicas do seu e-commerce
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start h-full pb-8">
        {/* Sidebar com Lista de Páginas */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <h3 className="text-xs uppercase font-semibold text-muted-foreground mb-2 px-4">
            Páginas Editáveis
          </h3>
          <nav className="flex flex-col gap-1">
            {pagesList.map((page) => {
              const href = `/admin/paginas/${page.slug}`
              const isActive = pathname === href
              return (
                <Link
                  key={page.slug}
                  href={href}
                  className={cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-colors hover:bg-muted/50",
                    isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {page.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-card rounded-xl border shadow-sm h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
