'use client'

import { useState, useEffect } from 'react'
import { Mail, MessageSquare, Facebook, Twitter, Instagram, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/lib/api'
import { getPageData } from '@/lib/cms'
import { toast } from 'sonner'

const contactOptions = [
  {
    icon: Mail,
    title: 'E-mail',
    description: 'Adoraríamos ouvir você. Se você tiver uma pergunta sobre recursos, preços ou qualquer outra coisa, nossa equipe está pronta para responder a todas as suas perguntas.',
    action: 'contato@bucaly.com',
  },
  {
    icon: MessageSquare,
    title: 'Chat',
    description: 'Adoraríamos ouvir você. Se você tiver uma pergunta sobre recursos, preços ou qualquer outra coisa, nossa equipe está pronta para responder a todas as suas perguntas.',
    action: 'Iniciar Chat',
  },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    primeiroNome: '',
    sobrenome: '',
    email: '',
    assunto: '',
    mensagem: '',
  })
  const [pageData, setPageData] = useState<any>(null)

  useEffect(() => {
    getPageData('contato').then(data => setPageData(data))
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.sendContactMessage({
        nome: formData.primeiroNome,
        sobrenome: formData.sobrenome,
        email: formData.email,
        assunto: formData.assunto,
        mensagem: formData.mensagem,
      })

      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
      setFormData({
        primeiroNome: '',
        sobrenome: '',
        email: '',
        assunto: '',
        mensagem: '',
      })
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-bucaly section-padding">
      {/* Header (Gerenciado via CMS) */}
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
          {pageData?.sections?.header?.title || pageData?.title || 'Entre em Contato'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {pageData?.sections?.header?.content || pageData?.description || 'Adoraríamos ouvir você. Nossa equipe está pronta para responder a todas as suas perguntas.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card>
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Envie uma mensagem</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primeiroNome">Primeiro Nome</Label>
                  <Input
                    id="primeiroNome"
                    name="primeiroNome"
                    placeholder="Joana"
                    value={formData.primeiroNome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sobrenome">Sobrenome</Label>
                  <Input
                    id="sobrenome"
                    name="sobrenome"
                    placeholder="Silva"
                    value={formData.sobrenome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Endereço de E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Select
                  value={formData.assunto}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, assunto: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um assunto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta-geral">Consulta Geral</SelectItem>
                    <SelectItem value="suporte">Suporte Técnico</SelectItem>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="parceria">Parceria</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem</Label>
                <Textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Como podemos ajudar?"
                  rows={5}
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          {/* Contact Options */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contactOptions.map((option) => (
              <Card key={option.title}>
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
                    <option.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" asChild>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Map */}
          <Card className="overflow-hidden">
            <div className="relative h-64 bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="font-medium">Mapa Interativo</p>
                  <p className="text-sm text-muted-foreground">
                    (Integração com Google Maps)
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary uppercase tracking-wider font-semibold">
                    Nossa Sede
                  </p>
                  <p className="font-medium">{pageData?.sections?.address?.title || '123 Design St, SF CA 94103'}</p>
                </div>
                <Button size="icon" variant="outline" asChild>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{pageData?.sections?.contact?.title || '(11) 99999-9999'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium">{pageData?.sections?.contact?.subtitle || 'contato@bucaly.com'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
