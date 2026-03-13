'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  XCircle,
  Copy,
  Check,
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
  Package,
  Truck,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function DesignSystemPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedColor(label)
    toast.success(`${label} copiado!`)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const colors = {
    primary: [
      { name: 'Primary', value: '#f4d125', var: '--primary', description: 'Amarelo Bucaly - Cor principal da marca' },
      { name: 'Primary Foreground', value: '#1a1a1a', var: '--primary-foreground', description: 'Texto sobre primary' },
    ],
    neutral: [
      { name: 'Background', value: '#ffffff', var: '--background', description: 'Fundo principal' },
      { name: 'Foreground', value: '#1a1a1a', var: '--foreground', description: 'Texto principal' },
      { name: 'Card', value: '#f8f9fa', var: '--card', description: 'Fundo de cards' },
      { name: 'Muted', value: '#f8f9fa', var: '--muted', description: 'Elementos secundários' },
      { name: 'Muted Foreground', value: '#6b7280', var: '--muted-foreground', description: 'Texto secundário' },
      { name: 'Border', value: '#e5e7eb', var: '--border', description: 'Bordas e divisores' },
    ],
    semantic: [
      { name: 'Success', value: '#22c55e', var: '--success', description: 'Sucesso, confirmações' },
      { name: 'Warning', value: '#f4d125', var: '--warning', description: 'Alertas, atenção' },
      { name: 'Destructive', value: '#ef4444', var: '--destructive', description: 'Erros, exclusões' },
      { name: 'Accent', value: '#1a1a1a', var: '--accent', description: 'Acentos e destaques' },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent text-accent-foreground py-16 md:py-24">
        <div className="container-bucaly">
          <Badge className="mb-4 bg-primary text-primary-foreground">Design System</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Bucaly Design System
          </h1>
          <p className="text-lg md:text-xl text-accent-foreground/80 max-w-2xl">
            Guia completo de componentes, cores, tipografia e padrões visuais 
            para a identidade Bucaly - Odontologia Afetiva.
          </p>
        </div>
      </div>

      <div className="container-bucaly py-12 md:py-16">
        <Tabs defaultValue="cores" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger value="cores" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Cores
            </TabsTrigger>
            <TabsTrigger value="tipografia" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Tipografia
            </TabsTrigger>
            <TabsTrigger value="botoes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Botoes
            </TabsTrigger>
            <TabsTrigger value="formularios" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Formularios
            </TabsTrigger>
            <TabsTrigger value="cards" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Cards
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Feedback
            </TabsTrigger>
            <TabsTrigger value="espacamento" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Espacamento
            </TabsTrigger>
          </TabsList>

          {/* CORES */}
          <TabsContent value="cores" className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-2">Paleta de Cores</h2>
              <p className="text-muted-foreground mb-6">
                Sistema de cores baseado na identidade Bucaly. Clique para copiar o valor hex.
              </p>

              {/* Primary Colors */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Cores Primarias</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {colors.primary.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => copyToClipboard(color.value, color.name)}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all text-left"
                    >
                      <div 
                        className="w-16 h-16 rounded-lg shrink-0 border border-border"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{color.name}</span>
                          {copiedColor === color.name ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        <code className="text-sm text-muted-foreground">{color.value}</code>
                        <p className="text-xs text-muted-foreground mt-1">{color.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Neutral Colors */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Cores Neutras</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colors.neutral.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => copyToClipboard(color.value, color.name)}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all text-left"
                    >
                      <div 
                        className="w-12 h-12 rounded-lg shrink-0 border border-border"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{color.name}</span>
                          {copiedColor === color.name ? (
                            <Check className="w-3 h-3 text-success" />
                          ) : (
                            <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        <code className="text-xs text-muted-foreground">{color.value}</code>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Cores Semanticas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {colors.semantic.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => copyToClipboard(color.value, color.name)}
                      className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                    >
                      <div 
                        className="w-full h-20 rounded-lg border border-border"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium text-sm">{color.name}</span>
                          {copiedColor === color.name ? (
                            <Check className="w-3 h-3 text-success" />
                          ) : (
                            <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        <code className="text-xs text-muted-foreground">{color.value}</code>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          {/* TIPOGRAFIA */}
          <TabsContent value="tipografia" className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-2">Tipografia</h2>
              <p className="text-muted-foreground mb-8">
                Fonte Manrope para toda a aplicacao. Pesos de 400 a 800.
              </p>

              {/* Font Family */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Fonte Principal</CardTitle>
                  <CardDescription>Manrope - Sans-serif moderna e legivel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold mb-4">Manrope</div>
                  <p className="text-lg text-muted-foreground">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                    abcdefghijklmnopqrstuvwxyz<br />
                    0123456789
                  </p>
                </CardContent>
              </Card>

              {/* Headings */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Titulos</CardTitle>
                  <CardDescription>Escala de 32px a 64px, peso 700 (Bold)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-b border-border pb-4">
                    <code className="text-xs text-muted-foreground mb-2 block">h1 - 32px / 48px / 64px</code>
                    <h1 className="!mb-0">Titulo Principal H1</h1>
                  </div>
                  <div className="border-b border-border pb-4">
                    <code className="text-xs text-muted-foreground mb-2 block">h2 - 28px / 36px / 48px</code>
                    <h2 className="!mb-0">Titulo Secundario H2</h2>
                  </div>
                  <div className="border-b border-border pb-4">
                    <code className="text-xs text-muted-foreground mb-2 block">h3 - 24px / 28px</code>
                    <h3 className="!mb-0">Subtitulo H3</h3>
                  </div>
                  <div>
                    <code className="text-xs text-muted-foreground mb-2 block">h4 - 20px / 24px</code>
                    <h4 className="!mb-0">Subtitulo H4</h4>
                  </div>
                </CardContent>
              </Card>

              {/* Body Text */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Texto Corpo</CardTitle>
                  <CardDescription>16px a 18px, peso 400, line-height 1.6</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <code className="text-xs text-muted-foreground mb-2 block">Paragrafo padrao</code>
                    <p>
                      Na Bucaly, acreditamos que cuidar do seu sorriso vai alem da tecnica; 
                      e sobre acolhimento, confianca e bem-estar em cada detalhe. Nossa equipe 
                      esta preparada para cuidar de voce com todo o carinho e profissionalismo.
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <code className="text-xs text-muted-foreground mb-2 block">Texto pequeno (text-sm)</code>
                    <p className="text-sm text-muted-foreground">
                      Texto secundario para descricoes, legendas e informacoes complementares.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Font Weights */}
              <Card>
                <CardHeader>
                  <CardTitle>Pesos da Fonte</CardTitle>
                  <CardDescription>Variantes de 400 a 800</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-normal text-xl">Regular</span>
                    <code className="text-sm text-muted-foreground">font-normal (400)</code>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-medium text-xl">Medium</span>
                    <code className="text-sm text-muted-foreground">font-medium (500)</code>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-semibold text-xl">Semibold</span>
                    <code className="text-sm text-muted-foreground">font-semibold (600)</code>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="font-bold text-xl">Bold</span>
                    <code className="text-sm text-muted-foreground">font-bold (700)</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xl">Extrabold</span>
                    <code className="text-sm text-muted-foreground">font-extrabold (800)</code>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* BOTOES */}
          <TabsContent value="botoes" className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-2">Botoes</h2>
              <p className="text-muted-foreground mb-8">
                Variantes de botoes para diferentes contextos e acoes.
              </p>

              {/* Primary Buttons */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Botoes Primarios</CardTitle>
                  <CardDescription>Acoes principais - Fundo amarelo #f4d125, texto preto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Button>Botao Padrao</Button>
                    <Button>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button>
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Button size="sm">Pequeno</Button>
                    <Button size="default">Medio</Button>
                    <Button size="lg">Grande</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary & Variants */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Variantes</CardTitle>
                  <CardDescription>Secondary, outline, ghost e link</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-6">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                  <Separator className="my-6" />
                  <div className="flex flex-wrap gap-4">
                    <Button variant="destructive">Excluir</Button>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* States */}
              <Card>
                <CardHeader>
                  <CardTitle>Estados</CardTitle>
                  <CardDescription>Disabled e loading</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button disabled>Desabilitado</Button>
                    <Button disabled className="opacity-50">
                      <span className="animate-spin mr-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </span>
                      Carregando...
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* FORMULARIOS */}
          <TabsContent value="formularios" className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-2">Formularios</h2>
              <p className="text-muted-foreground mb-8">
                Inputs, selects, checkboxes e outros controles de formulario.
              </p>

              {/* Text Inputs */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Campos de Texto</CardTitle>
                  <CardDescription>Input padrao com bordas arredondadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" placeholder="********" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="disabled">Desabilitado</Label>
                      <Input id="disabled" placeholder="Campo desabilitado" disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Textarea */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Area de Texto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea id="message" placeholder="Digite sua mensagem aqui..." rows={4} />
                  </div>
                </CardContent>
              </Card>

              {/* Select */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Select</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md space-y-2">
                    <Label>Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ortodontia">Ortodontia</SelectItem>
                        <SelectItem value="higiene">Higiene Oral</SelectItem>
                        <SelectItem value="restauradora">Restauradora</SelectItem>
                        <SelectItem value="instrumentos">Instrumentos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Checkboxes & Radio */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Checkbox e Radio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Checkbox</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-sm">
                        Aceito os termos e condicoes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newsletter" defaultChecked />
                      <label htmlFor="newsletter" className="text-sm">
                        Quero receber novidades por email
                      </label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <Label>Radio Group</Label>
                    <RadioGroup defaultValue="padrao">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="padrao" id="padrao" />
                        <Label htmlFor="padrao">Entrega Padrao (3-5 dias)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expressa" id="expressa" />
                        <Label htmlFor="expressa">Entrega Expressa (1 dia)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Switch & Slider */}
              <Card>
                <CardHeader>
                  <CardTitle>Switch e Slider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="notifications">Notificacoes</Label>
                    <Switch id="notifications" />
                  </div>
                  
                  <Separator />
                  
                  <div className="max-w-md space-y-4">
                    <Label>Faixa de Preco</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>R$ 0</span>
                      <span>R$ 500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* CARDS */}
          <TabsContent value="cards" className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-2">Cards</h2>
              <p className="text-muted-foreground mb-8">
                Componentes de card para diferentes usos. Fundo cinza suave #f8f9fa.
              </p>

              {/* Basic Card */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Basico</CardTitle>
                    <CardDescription>Descricao do card</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Conteudo do card com informacoes relevantes.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Acao</Button>
                  </CardFooter>
                </Card>

                <Card className="card-hover cursor-pointer">
                  <CardHeader>
                    <CardTitle>Card Hover</CardTitle>
                    <CardDescription>Com efeito de hover</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Passe o mouse para ver o efeito de elevacao.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary border-2">
                  <CardHeader>
                    <CardTitle>Card Destacado</CardTitle>
                    <CardDescription>Borda amarela</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Card com destaque usando borda primaria.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Product Card Example */}
              <h3 className="text-lg font-semibold mb-4">Card de Produto</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Card className="group overflow-hidden">
                  <div className="relative aspect-square bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Package className="w-12 h-12" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                      Novo
                    </Badge>
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-primary font-semibold mb-1">BUCALY PRO</p>
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                      Sistema de Braquetes Ceramicos
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      Braquetes ceramicos esteticos de alta durabilidade
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">R$ 249,00</span>
                      <Button size="sm" className="h-8 w-8 p-0">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group overflow-hidden">
                  <div className="relative aspect-square bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Package className="w-12 h-12" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                      -15%
                    </Badge>
                    <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-primary font-semibold mb-1">PRECISIONFIT</p>
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                      Placas Alinhadoras Digitais
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      Alinhadores transparentes moldados sob medida
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground line-through">R$ 189,00</span>
                        <span className="font-bold ml-2">R$ 159,00</span>
                      </div>
                      <Button size="sm" className="h-8 w-8 p-0">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* FEEDBACK */}
          <TabsContent value="feedback" className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-2">Feedback</h2>
              <p className="text-muted-foreground mb-8">
                Alerts, badges, progress e outros elementos de feedback.
              </p>

              {/* Alerts */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Informacao</AlertTitle>
                    <AlertDescription>
                      Mensagem informativa para o usuario.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-success bg-success/10">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <AlertTitle className="text-success">Sucesso</AlertTitle>
                    <AlertDescription>
                      Operacao realizada com sucesso!
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-primary bg-primary/10">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Atencao</AlertTitle>
                    <AlertDescription>
                      Verifique as informacoes antes de continuar.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>
                      Algo deu errado. Tente novamente.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Padrao</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge className="bg-success text-success-foreground">Sucesso</Badge>
                    <Badge className="bg-primary text-primary-foreground">Novo</Badge>
                    <Badge className="bg-accent text-accent-foreground">Popular</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Carregando...</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quase la!</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} />
                  </div>
                </CardContent>
              </Card>

              {/* Avatar */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">JD</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>

              {/* Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle>Skeleton</CardTitle>
                  <CardDescription>Estados de carregamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* ESPACAMENTO */}
          <TabsContent value="espacamento" className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-2">Espacamento</h2>
              <p className="text-muted-foreground mb-8">
                Sistema de espacamento baseado no guia Bucaly: 80px desktop, 20px mobile.
              </p>

              {/* Spacing Scale */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Escala de Espacamento</CardTitle>
                  <CardDescription>Tailwind spacing utilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: '4', value: '16px', class: 'w-4' },
                      { name: '5', value: '20px', class: 'w-5' },
                      { name: '6', value: '24px', class: 'w-6' },
                      { name: '8', value: '32px', class: 'w-8' },
                      { name: '10', value: '40px', class: 'w-10' },
                      { name: '12', value: '48px', class: 'w-12' },
                      { name: '16', value: '64px', class: 'w-16' },
                      { name: '20', value: '80px', class: 'w-20' },
                    ].map((space) => (
                      <div key={space.name} className="flex items-center gap-4">
                        <div className={cn('h-4 bg-primary rounded', space.class)} />
                        <code className="text-sm text-muted-foreground w-20">{space.name}</code>
                        <span className="text-sm">{space.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Border Radius */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Border Radius</CardTitle>
                  <CardDescription>8px a 12px conforme guia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary rounded-sm mb-2" />
                      <code className="text-xs">rounded-sm</code>
                      <p className="text-xs text-muted-foreground">4px</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary rounded mb-2" />
                      <code className="text-xs">rounded</code>
                      <p className="text-xs text-muted-foreground">6px</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary rounded-lg mb-2" />
                      <code className="text-xs">rounded-lg</code>
                      <p className="text-xs text-muted-foreground">8px</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary rounded-xl mb-2" />
                      <code className="text-xs">rounded-xl</code>
                      <p className="text-xs text-muted-foreground">12px</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary rounded-full mb-2" />
                      <code className="text-xs">rounded-full</code>
                      <p className="text-xs text-muted-foreground">50%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container */}
              <Card>
                <CardHeader>
                  <CardTitle>Container</CardTitle>
                  <CardDescription>Classe utilitaria container-bucaly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm">.container-bucaly</code>
                    <p className="text-sm text-muted-foreground mt-2">
                      mx-auto px-5 md:px-10 lg:px-20 max-w-7xl
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm">.section-padding</code>
                    <p className="text-sm text-muted-foreground mt-2">
                      py-12 md:py-16 lg:py-20
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <code className="text-sm">.section-padding-lg</code>
                    <p className="text-sm text-muted-foreground mt-2">
                      py-16 md:py-20 lg:py-24
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Separator className="my-12" />
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <Package className="w-10 h-10 mx-auto text-primary mb-4" />
            <h4 className="font-semibold mb-2">Componentes</h4>
            <p className="text-sm text-muted-foreground">
              Biblioteca completa de componentes reutilizaveis
            </p>
          </Card>
          <Card className="text-center p-6">
            <Truck className="w-10 h-10 mx-auto text-primary mb-4" />
            <h4 className="font-semibold mb-2">Mobile First</h4>
            <p className="text-sm text-muted-foreground">
              Design responsivo otimizado para todos os dispositivos
            </p>
          </Card>
          <Card className="text-center p-6">
            <Shield className="w-10 h-10 mx-auto text-primary mb-4" />
            <h4 className="font-semibold mb-2">Acessibilidade</h4>
            <p className="text-sm text-muted-foreground">
              Componentes acessiveis seguindo as diretrizes WCAG
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
