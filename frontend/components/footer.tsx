import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const defaultFooterLinks = {
  loja: {
    title: 'Loja',
    links: [
      { href: '/produtos?novidades=true', label: 'Lançamentos' },
      { href: '/produtos?categoria=ortodontia', label: 'Ortodontia' },
      { href: '/produtos?categoria=alinhadores', label: 'Alinhadores' },
      { href: '/produtos?promocao=true', label: 'Kits Promocionais' },
    ],
  },
  suporte: {
    title: 'Suporte ao Cliente',
    links: [
      { href: '/rastrear-pedido', label: 'Rastrear Pedido' },
      { href: '/devolucoes', label: 'Política de Devolução' },
      { href: '/atacado', label: 'Pedidos em Atacado' },
      { href: '/contato', label: 'Fale Conosco' },
    ],
  },
  empresa: {
    title: 'Empresa',
    links: [
      { href: '/sobre', label: 'Sobre Nós' },
      { href: '/blog', label: 'Blog' },
      { href: '/carreiras', label: 'Carreiras' },
      { href: '/parceiros', label: 'Seja um Parceiro' },
    ],
  },
}

interface FooterProps {
  data?: any
}

export function Footer({ data }: FooterProps) {
  const linksBottomData = data?.links || []
  const copyrightText = data?.copyright || '© 2026 Bucaly. Todos os direitos reservados.'

  return (
    <footer className="bg-accent text-accent-foreground mt-auto w-full">
      <div className="container-bucaly section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 w-full">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Logo variant="white" className="mb-4" />
            <p className="text-sm text-accent-foreground/80 mb-6 max-w-sm">
              O principal mercado para suprimentos odontológicos profissionais, 
              instrumentos e equipamentos de alta tecnologia desde 2012.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent-foreground/10"
                asChild
              >
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent-foreground/10"
                asChild
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent-foreground/10"
                asChild
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(defaultFooterLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-accent-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-accent-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold mb-2">Newsletter</h3>
              <p className="text-sm text-accent-foreground/80">
                Receba as últimas atualizações sobre tecnologia odontológica e ofertas especiais.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/50 max-w-xs"
              />
              <Button>Assinar</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-accent-foreground/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-accent-foreground/60 w-full">
            <p>{copyrightText}</p>
            <div className="flex gap-6">
              {linksBottomData.length > 0 ? linksBottomData.map((lbl: any, lIdx: number) => (
                 <Link key={lIdx} href={lbl.link} className="hover:text-accent-foreground transition-colors">
                   {lbl.label}
                 </Link>
              )) : (
                <>
                  <Link href="/privacidade" className="hover:text-accent-foreground transition-colors">
                    Política de Privacidade
                  </Link>
                  <Link href="/termos" className="hover:text-accent-foreground transition-colors">
                    Termos de Serviço
                  </Link>
                  <Link href="/cookies" className="hover:text-accent-foreground transition-colors">
                    Configurações de Cookies
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
