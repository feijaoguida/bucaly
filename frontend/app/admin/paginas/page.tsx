import { Plus, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const availablePages = [
  { slug: 'home', title: 'Página Inicial (Home)', description: 'Gerencie Banner, Categorias em Destaque e Promoções' },
  { slug: 'produtos', title: 'Vitrine de Produtos', description: 'Header e customizações da página de listagem' },
  { slug: 'contato', title: 'Fale Conosco', description: 'Textos de contato e endereços listados' },
  { slug: 'sobre-nos', title: 'Sobre a Empresa', description: 'Apresentação corporativa da Bucaly' },
  { slug: 'carrinho', title: 'Carrinho de Compras', description: 'Banner ou mensagens do topo do carrinho' },
]

export default function AdminPagesList() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Aparência e Páginas (CMS)</h1>
          <p className="text-muted-foreground">
            Gerencie o conteúdo textual e visual das suas páginas públicas.
          </p>
        </div>
      </div>

      {/* Pages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availablePages.map((page) => (
          <Card key={page.slug} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
                {page.title}
              </CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/builder/${page.slug}`}>
                  Personalizar "{page.title}"
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
