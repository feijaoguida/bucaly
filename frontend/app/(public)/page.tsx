import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, Clock, Sparkles } from 'lucide-react'
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
  // Assumindo que pageData.sections agora é um array de blocos
  const dynamicSections = pageData?.sections || []

  const renderDynamicSection = (section: any, idx: number) => {
    if (!section.enabled) return null

    switch (section.type) {
      case 'hero': // Renamed from 'banner' in the instruction to match original 'hero' section logic
        return (
          <section key={section.id || idx} className="relative bg-muted overflow-hidden">
            <div className="container-bucaly">
              <div className="grid lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
                {/* Content  (Gerenciado via CMS) */}
                <div className="order-2 lg:order-1">
                  <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                    {section.data.subtitle || 'Odontologia Afetiva'}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6"
                      dangerouslySetInnerHTML={{ __html: section.data.title || 'Sorriso <span class="text-primary">Mais Saudável</span> e Brilhante' }}>
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                    {section.data.content || 'Experimente produtos ortodônticos e odontológicos profissionais selecionados, projetados para seu máximo conforto e sucesso clínico.'}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" asChild>
                      <Link href={section.data.buttonLink || '/produtos'}>
                        {section.data.buttonText || 'Comprar Agora'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    {section.data.secondaryButtonText && (
                      <Button size="lg" variant="outline" asChild>
                        <Link href={section.data.secondaryButtonLink || '/sobre'}>{section.data.secondaryButtonText}</Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Image (Gerenciada via CMS) */}
                <div className="order-1 lg:order-2 relative">
                  <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src={section.data.image || "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800"}
                      alt={section.data.imageAlt || "Sorriso saudável"}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )

      case 'banner': // New generic banner type
        return (
          <section key={section.id || idx} className="relative bg-primary overflow-hidden">
            {section.data.image && <div className="absolute inset-0 bg-primary/20 bg-cover bg-center" style={{ backgroundImage: `url(${section.data.image})` }} />}
            <div className="container-bucaly relative z-10 py-24 md:py-32 flex flex-col items-center text-center text-primary-foreground">
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 max-w-4xl tracking-tight" dangerouslySetInnerHTML={{ __html: section.data.title }}></h1>
              <p className="text-lg md:text-xl max-w-2xl mb-10 text-primary-foreground/90 leading-relaxed">
                {section.data.content || section.data.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {section.data.buttonText && (
                  <Button size="lg" variant="secondary" className="gap-2 font-medium" asChild>
                    <Link href={section.data.buttonLink || '/produtos'}>
                      {section.data.buttonText} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {section.data.secondaryButtonText && (
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                    <Link href={section.data.secondaryButtonLink || '/sobre'}>
                      {section.data.secondaryButtonText}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </section>
        )

      case 'categories':
        return (
          <section key={section.id || idx} className="py-20 bg-muted/50">
            <div className="container-bucaly">
              <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{section.data.title || 'Compre por Categoria'}</h2>
                <p className="text-muted-foreground max-w-2xl text-lg">{section.data.subtitle || 'Encontre exatamente o que sua rotina dental precisa'}</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.slice(0, section.data.limit || 4).map((category, index) => (
                  <Link 
                    key={category.id} 
                    href={`/produtos?categoria=${category.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-background border shadow-sm transition-all hover:shadow-md hover:border-primary/50 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{category.nome}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{category.descricao}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )

      case 'featuredProducts':
        return (
          <section key={section.id || idx} className="py-24">
            <div className="container-bucaly">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{section.data.title || 'Mais Vendidos'}</h2>
                  <p className="text-muted-foreground text-lg">{section.data.subtitle || 'Os produtos mais amados pela nossa comunidade'}</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/produtos">Ver todos os produtos <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredProducts.slice(0, section.data.limit || 3).map((product, index) => (
                  <div key={product.id} className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'benefits': // Renamed from 'features' in the original code
        return (
          <section key={section.id || idx} className="py-16 bg-muted/30 border-y">
            <div className="container-bucaly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(section.data.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {item.icon === 'Truck' && <Truck className="h-6 w-6" />}
                      {item.icon === 'Shield' && <Shield className="h-6 w-6" />}
                      {item.icon === 'Clock' && <Clock className="h-6 w-6" />}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'text_block':
        return (
          <section key={section.id || idx} className="py-20 text-center">
            <div className="max-w-3xl mx-auto px-4">
               <h2 className="text-2xl font-bold mb-4">{section.data.title}</h2>
               <p className="text-muted-foreground leading-relaxed text-lg">{section.data.content}</p>
            </div>
          </section>
        )

      case 'cta':
        return (
           <section key={section.id || idx} className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
             <div className="container-bucaly relative z-10 text-center flex flex-col items-center">
               <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 max-w-3xl">{section.data.title || 'Pronto para vivenciar uma nova experiência em odontologia?'}</h2>
               <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mb-10">
                 {section.data.content || 'Nossa equipe está preparada para cuidar de você com todo o carinho e profissionalismo que seu sorriso merece.'}
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Button size="lg" variant="secondary" className="font-semibold px-8" asChild>
                   <Link href={section.data.primaryButtonLink || '/contato'}>{section.data.primaryButtonText || 'Agendar Consulta'}</Link>
                 </Button>
                 {section.data.secondaryButtonText && (
                   <Button 
                     size="lg" 
                     variant="outline" 
                     className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                     asChild
                   >
                     <Link href={section.data.secondaryButtonLink || "https://wa.me/5511999999999"} target="_blank">
                       {section.data.secondaryButtonText}
                     </Link>
                   </Button>
                 )}
               </div>
             </div>
           </section>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {Array.isArray(dynamicSections) && dynamicSections.map((section, idx) => renderDynamicSection(section, idx))}
        
        {(!Array.isArray(dynamicSections) || dynamicSections.length === 0) && (
          <div className="flex items-center justify-center p-24 text-muted-foreground">
            Aguardando conteúdo dinâmico do CMS...
          </div>
        )}
      </main>
    </div>
  )
}
