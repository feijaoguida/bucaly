import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Heart, ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPageData } from '@/lib/cms'

const timeline = [
  {
    year: '2012',
    title: 'O Início de um Sonho',
    description: 'Inauguramos nossa primeira clínica focada em atendimento humanizado no centro da cidade.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400',
    align: 'right',
  },
  {
    year: '2017',
    title: 'Expansão Tecnológica',
    description: 'Introduzimos scanners intra-orais e laboratório digital próprio para maior precisão nos tratamentos.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400',
    align: 'left',
  },
  {
    year: '2023',
    title: 'Selo Bucaly de Afetividade',
    description: 'Alcançamos a marca de 10.000 pacientes atendidos com nosso protocolo exclusivo de acolhimento.',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400',
    align: 'right',
  },
]

export default async function AboutPage() {
  const pageData = await getPageData('sobre-nos')
  const sections = pageData?.sections || {}
  const hero = sections.hero || {}

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-accent text-accent-foreground overflow-hidden">
        <div className="container-bucaly py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                Desde 2012
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
                  dangerouslySetInnerHTML={{ __html: hero.title || 'Odontologia <span class="text-primary">Afetiva</span>' }}>
              </h1>
              <p className="text-lg text-accent-foreground/80 max-w-lg">
                {hero.content || 'Na Bucaly, acreditamos que cuidar do seu sorriso vai além da técnica; é sobre acolhimento, confiança e bem-estar em cada detalhe.'}
              </p>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800"
                  alt="Equipe Bucaly"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-bucaly">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Nossa Missão</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Transformar vidas através de sorrisos saudáveis e atendimento humanizado. 
                  Focamos na excelência clínica e no conforto emocional de cada paciente 
                  que cruza nossas portas.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">Nossa Visão</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Ética, transparência, inovação tecnológica e empatia profunda. 
                  Temos um compromisso inabalável com a saúde integral e a felicidade 
                  de quem nos escolhe como parceiros de saúde.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600"
                  alt="Profissional Bucaly"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-muted">
        <div className="container-bucaly">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Nossa Trajetória
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mais de uma década construindo sorrisos e colecionando histórias de sucesso 
              através da dedicação total aos nossos pacientes.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    item.align === 'left' ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 md:text-right">
                    {item.align === 'right' && (
                      <div className="bg-card rounded-lg p-6 shadow-sm">
                        <span className="text-primary font-bold text-xl">{item.year}</span>
                        <h3 className="text-lg font-semibold mt-2 mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    )}
                    {item.align === 'left' && (
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Dot */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
                  </div>

                  {/* Image/Content */}
                  <div className="flex-1">
                    {item.align === 'left' && (
                      <div className="bg-card rounded-lg p-6 shadow-sm">
                        <span className="text-primary font-bold text-xl">{item.year}</span>
                        <h3 className="text-lg font-semibold mt-2 mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    )}
                    {item.align === 'right' && (
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Gerenciável) */}
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
                <Link href="/contato">
                  Agendar Minha Consulta
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="https://wa.me/5511999999999" target="_blank">
                  <Phone className="mr-2 h-4 w-4" />
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
