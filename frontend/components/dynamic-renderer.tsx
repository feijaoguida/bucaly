import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Truck, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCard } from '@/components/product-card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import type { Product, Category } from '@/lib/types'

interface DynamicRendererProps {
  sections: any[]
  categories?: Category[]
  featuredProducts?: Product[]
}

export function DynamicRenderer({ sections, categories = [], featuredProducts = [] }: DynamicRendererProps) {
  
  const renderWidget = (widget: any, idx: number) => {
    switch (widget.type) {
      case 'header':
        return <Header key={widget.id || idx} data={widget.data} />
        
      case 'footer':
        return <Footer key={widget.id || idx} data={widget.data} />

      case 'banner':
        return (
          <div key={widget.id || idx} className="relative w-full overflow-hidden bg-primary/5 rounded-2xl">
            {widget.data.image && <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${widget.data.image})` }} />}
            <div className="relative z-10 py-16 md:py-24 px-6 md:px-12 flex flex-col items-center text-center">
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 tracking-tight" dangerouslySetInnerHTML={{ __html: widget.data.title }}></h1>
              <p className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed text-muted-foreground">
                {widget.data.content || widget.data.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {widget.data.buttonText && (
                  <Button size="lg" className="gap-2 font-medium" asChild>
                    <Link href={widget.data.buttonLink || '/produtos'}>
                      {widget.data.buttonText} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {widget.data.secondaryButtonText && (
                  <Button size="lg" variant="outline" className="gap-2" asChild>
                    <Link href={widget.data.secondaryButtonLink || '/sobre'}>
                      {widget.data.secondaryButtonText}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )

      case 'categories':
        return (
          <div key={widget.id || idx} className="w-full">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3">{widget.data.title || 'Compre por Categoria'}</h2>
              <p className="text-muted-foreground w-full text-base">{widget.data.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, widget.data.limit || 4).map((category) => (
                <Link 
                  key={category.id} 
                  href={`/produtos?categoria=${category.slug}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-background border shadow-sm transition-all hover:shadow-md hover:border-primary/50 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">{category.nome}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )

      case 'featuredProducts':
        return (
          <div key={widget.id || idx} className="w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">{widget.data.title || 'Mais Vendidos'}</h2>
                <p className="text-muted-foreground text-base">{widget.data.subtitle}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/produtos">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.slice(0, widget.data.limit || 3).map((product, index) => (
                <div key={product.id} className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )

      case 'benefits':
        return (
          <div key={widget.id || idx} className="w-full border-y bg-muted/20 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(widget.data.items || []).map((item: any, i: number) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {item.icon === 'Truck' && <Truck className="h-5 w-5" />}
                    {item.icon === 'Shield' && <Shield className="h-5 w-5" />}
                    {item.icon === 'Clock' && <Clock className="h-5 w-5" />}
                  </div>
                  <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'text_block':
        return (
          <div key={widget.id || idx} className="w-full py-8 text-center max-w-3xl mx-auto">
             <h2 className="text-2xl font-bold mb-4">{widget.data.title}</h2>
             <p className="text-muted-foreground leading-relaxed text-lg">{widget.data.content}</p>
          </div>
        )

      case 'cta':
        return (
           <div key={widget.id || idx} className="w-full py-16 bg-primary text-primary-foreground relative overflow-hidden rounded-2xl">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
             <div className="relative z-10 text-center flex flex-col items-center px-6">
               <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4 max-w-2xl">{widget.data.title || 'Pronto para vivenciar uma nova experiência em odontologia?'}</h2>
               <p className="text-base md:text-lg text-primary-foreground/90 max-w-xl mb-8">
                 {widget.data.content}
               </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Button size="lg" variant="secondary" className="font-semibold px-8" asChild>
                   <Link href={widget.data.primaryButtonLink || '/contato'}>{widget.data.primaryButtonText || 'Agendar Consulta'}</Link>
                 </Button>
               </div>
             </div>
           </div>
        )
      default:
        // Renderizador default fallback para components nativos ou blocks estáticos
        if (widget.type === 'hero') return <div key={widget.id || idx} className="p-4 bg-muted text-center text-muted-foreground rounded-lg border">Fallback: {widget.data?.title || 'Widget antigo (hero)'}</div>;
        return null
    }
  }

  const renderContainer = (section: any, idx: number) => {
    if (!section.enabled) return null
    if (section.type !== 'container') return null 

    const bgStyle: React.CSSProperties = {}
    if (section.settings?.background?.type === 'color') {
      bgStyle.backgroundColor = section.settings.background.value
    } else if (section.settings?.background?.type === 'image') {
      bgStyle.backgroundImage = `url(${section.settings.background.value})`
      bgStyle.backgroundSize = 'cover'
      bgStyle.backgroundPosition = 'center'
    }

    const paddingTop = section.settings?.padding?.top || '2rem'
    const paddingBottom = section.settings?.padding?.bottom || '2rem'
    const isFullWidth = section.settings?.fullWidth === true

    return (
      <section 
        key={section.id || idx} 
        style={{ ...bgStyle, paddingTop, paddingBottom }}
        className="w-full relative"
      >
        <div className={isFullWidth ? "w-full lg:px-4" : "container-bucaly"}>
          <div className="flex flex-wrap md:flex-nowrap gap-6 w-full">
            {(section.columns || []).map((col: any, colIdx: number) => {
               let colWidthClass = "w-full"
               if (col.size === '1/2') colWidthClass = "w-full md:w-1/2"
               if (col.size === '1/3') colWidthClass = "w-full md:w-1/3"
               if (col.size === '2/3') colWidthClass = "w-full md:w-2/3"
               if (col.size === '1/4') colWidthClass = "w-full md:w-1/4"

               return (
                 <div key={col.id || colIdx} className={`${colWidthClass} flex flex-col gap-4`}>
                   {(col.widgets || []).map((widget: any, wIdx: number) => renderWidget(widget, wIdx))}
                 </div>
               )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (!Array.isArray(sections) || sections.length === 0) {
    return (
      <div className="flex items-center justify-center p-24 text-muted-foreground">
        Nenhum conteúdo renderizado.
      </div>
    )
  }

  return (
    <>
      {sections.map((section, idx) => renderContainer(section, idx))}
    </>
  )
}
