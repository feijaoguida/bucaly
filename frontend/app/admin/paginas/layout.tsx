'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Plus, LayoutTemplate, Settings2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function PaginasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [pagesList, setPagesList] = useState<any[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newPage, setNewPage] = useState({ title: '', slug: '' })

  const fetchPages = async () => {
    try {
      const res = await apiClient.get('/pages')
      if (res.data?.data) {
        setPagesList(res.data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar paginas')
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleCreatePage = async () => {
    if (!newPage.title.trim()) return toast.error('O título é obrigatório')
    try {
      const res = await apiClient.post('/pages', {
        title: newPage.title,
        slug: newPage.slug || undefined
      })
      toast.success('Página criada!')
      setIsCreating(false)
      fetchPages()
      router.push(`/admin/builder/${res.data.data.slug}`)
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Erro ao criar página')
    }
  }

  // Separar Assets Globais de Paginas normais
  const globalAssets = pagesList.filter(p => p.slug.startsWith('global-'))
  const normalPages = pagesList.filter(p => !p.slug.startsWith('global-'))

  return (
    <div className="flex-1 w-full flex flex-col space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Construtor de Páginas</h2>
          <p className="text-muted-foreground">
            Gerencie o layout estrutural e adicione páginas no CMS
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Página
        </Button>
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Página</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome Interno / Título</Label>
              <Input 
                 placeholder="Ex: Oferta Black Friday" 
                 value={newPage.title}
                 onChange={e => setNewPage(p => ({...p, title: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug da URL (Opcional)</Label>
              <Input 
                 placeholder="Ex: oferta-black-friday" 
                 value={newPage.slug}
                 onChange={e => setNewPage(p => ({...p, slug: e.target.value}))}
              />
              <p className="text-xs text-muted-foreground">Se deixar em branco, geraremos um automaticamente pelo título.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
            <Button onClick={handleCreatePage}>Salvar Página</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row gap-8 items-start h-[calc(100vh-140px)] pb-8">
        {/* Sidebar com Lista de Páginas */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
          
          <div>
            <h3 className="text-xs uppercase font-semibold text-muted-foreground mb-3 flex items-center gap-2 px-2">
              <LayoutTemplate className="h-4 w-4" /> Suas Páginas
            </h3>
            <nav className="flex flex-col gap-1">
              {normalPages.map((page) => {
                const href = `/admin/builder/${page.slug}`
                const isActive = pathname === href
                return (
                  <Link
                    key={page.slug}
                    href={href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted/50 truncate flex items-center justify-between group",
                      isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{page.title}</span>
                    <span className="text-[10px] text-muted-foreground/50 font-mono group-hover:text-muted-foreground/80">/{page.slug}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <h3 className="text-xs uppercase font-semibold text-muted-foreground mb-3 flex items-center gap-2 px-2">
              <Settings2 className="h-4 w-4" /> Layouts Globais
            </h3>
            <nav className="flex flex-col gap-1">
              {globalAssets.map((page) => {
                const href = `/admin/builder/${page.slug}`
                const isActive = pathname === href
                return (
                  <Link
                    key={page.slug}
                    href={href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted/50 truncate",
                      isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {page.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-card rounded-xl border shadow-sm min-h-full overflow-hidden bg-muted/10">
          {children}
        </div>
      </div>
    </div>
  )
}
