import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Clock, Truck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product-card'
import { CategoryCard } from '@/components/category-card'
import { api } from '@/lib/api'
import { getPageData } from '@/lib/cms'
import type { Product, Category } from '@/lib/types'

export default async function HomePage() {
  const categories = await api.getCategories()
  const featuredProducts = await api.getFeaturedProducts()
  
  // Requisição CMS para Home
  const pageData = await getPageData('home')
  const sections = pageData?.sections || {}
  const hero = sections.hero || {}

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-muted overflow-hidden">
        <div className="container-bucaly">
          <div className="grid lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
            {/* Content  (Gerenciado via CMS) */}
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                {hero.enabled !== false ? hero.subtitle || 'Odontologia Afetiva' : 'Odontologia Afetiva'}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6"
                  dangerouslySetInnerHTML={{ __html: hero.title || 'Sorriso <span class="text-primary">Mais Saudável</span> e Brilhante' }}>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                {hero.content || 'Experimente produtos ortodônticos e odontológicos profissionais selecionados, projetados para seu máximo conforto e sucesso clínico.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/produtos">
                    Comprar Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sobre">Ver Guia</Link>
                </Button>
              </div>
            </div>

            {/* Image (Gerenciada via CMS) */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden">
                <Image
                  src={hero.image || "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800"}
                  alt="Sorriso saudável"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-bucaly">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
                Compre por Categoria
              </h2>
              <p className="text-muted-foreground">
                Encontre exatamente o que sua rotina dental precisa
              </p>
            </div>
            <Button variant="link" asChild className="text-primary p-0">
              <Link href="/produtos">
                Ver Tudo
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 4).map((category: Category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-muted">
        <div className="container-bucaly">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              Mais Vendidos
            </h2>
            <p className="text-muted-foreground">
              Os produtos mais amados pela nossa comunidade
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product: Product, index: number) => (
              <div key={product.id} className="relative">
                {index === 0 && (
                  <Badge className="absolute top-3 left-3 z-10 bg-red-500 text-white">
                    Popular
                  </Badge>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" variant="outline" asChild>
              <Link href="/produtos">
                Ver Todos os Produtos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-bucaly">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Frete Grátis</h3>
              <p className="text-muted-foreground text-sm">
                Em pedidos acima de R$ 200. Entrega rápida e segura para todo Brasil.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pagamento Seguro</h3>
              <p className="text-muted-foreground text-sm">
                Processamento de pagamento seguro com criptografia SSL de 256 bits.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">30 Dias de Devolução</h3>
              <p className="text-muted-foreground text-sm">
                Garantia de satisfação. Devolução fácil em até 30 dias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Pode ser desligada via painel 'cta' ) */}
      {sections.cta?.enabled !== false && (
      <section className="bg-primary py-16 md:py-20">
        <div className="container-bucaly">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary-foreground mb-3">
                {sections.cta?.title || 'Pronto para vivenciar uma nova experiência em odontologia?'}
              </h2>
              <p className="text-primary-foreground/80 max-w-xl">
                 {sections.cta?.content || 'Nossa equipe está preparada para cuidar de você com todo o carinho e profissionalismo que seu sorriso merece.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contato">Agendar Consulta</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="https://wa.me/5511999999999" target="_blank">
                  Falar no WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  )
}
