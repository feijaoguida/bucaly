'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { ChevronLeft, Save, Monitor, Smartphone, Tablet, Layout, Type, Image as ImageIcon, Square, AlignLeft, MousePointerClick, Video, PlusSquare } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api'
import { BuilderRenderer } from '@/components/builder-renderer'
import { BuilderProperties } from '@/components/builder-properties'

const WIDGET_CATEGORIES = [
  {
    title: 'Layout',
    items: [
      { type: 'container', label: 'Sessão', icon: Layout },
      { type: 'column', label: 'Coluna', icon: Square },
    ]
  },
  {
    title: 'Elementos Básicos',
    items: [
      { type: 'heading', label: 'Título', icon: Type },
      { type: 'text_block', label: 'Texto', icon: AlignLeft },
      { type: 'image', label: 'Imagem', icon: ImageIcon },
      { type: 'button', label: 'Botão', icon: MousePointerClick },
    ]
  },
  {
    title: 'Módulos da Loja',
    items: [
      { type: 'banner', label: 'Banner', icon: ImageIcon },
      { type: 'categories', label: 'Categorias', icon: PlusSquare },
      { type: 'featuredProducts', label: 'Produtos', icon: ShoppingBagIcon },
      { type: 'benefits', label: 'Benefícios', icon: Layout },
      { type: 'cta', label: 'Call to Action', icon: MousePointerClick },
    ]
  }
]

// Mock component for missing icon
function ShoppingBagIcon(props: any) {
  return <Layout {...props} />
}

export default function BuilderPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string

  const [pageData, setPageData] = useState<any>(null)
  const [selectedElement, setSelectedElement] = useState<{ type: 'container' | 'column' | 'widget', id: string } | null>(null)
  const [isSeoOpen, setIsSeoOpen] = useState(false)

  useEffect(() => {
    if (slug) {
      apiClient.get(`/pages/${slug}`)
        .then(res => setPageData(res.data.data))
        .catch(err => toast.error('Erro ao carregar página'))
    }
  }, [slug])

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId, type } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Novo Widget vindo da Sidebar
    if (source.droppableId.startsWith('sidebar-')) {
      const widgetType = draggableId.replace('sidebar-', '')
      
      // Adicionar nova Sessão (Container) no root
      if (widgetType === 'container' && destination.droppableId === 'canvas-root') {
        const newContainer = {
          id: crypto.randomUUID(),
          type: 'container',
          enabled: true,
          columns: [
            { id: crypto.randomUUID(), size: '1/1', widgets: [] }
          ],
          settings: { padding: { top: '3rem', bottom: '3rem' }, background: { type: 'color', value: '#ffffff' }, fullWidth: false }
        }
        setPageData((prev: any) => {
          const newSections = JSON.parse(JSON.stringify(prev.sections))
          newSections.splice(destination.index, 0, newContainer)
          return { ...prev, sections: newSections }
        })
        setSelectedElement({ type: 'container', id: newContainer.id })
        return
      }

      // Adicionar nova Coluna em uma Sessão (Não diretamente suportado por padrão no grid atual, mas para fins de evitar quebra:)
      if (widgetType === 'column') {
         toast.info('Para adicionar colunas, selecione a Sessão e mude o layout dela (Em breve)')
         return
      }

      // Adicionar Novo Widget numa coluna
      if (destination.droppableId.startsWith('col-')) {
        let defaultData: any = {}
        if (widgetType === 'heading') defaultData = { title: 'Novo Título Focado' }
        if (widgetType === 'text_block') defaultData = { title: 'Bloco de Texto', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
        if (widgetType === 'button') defaultData = { buttonText: 'Clique Aqui', buttonLink: '#' }
        if (widgetType === 'banner') defaultData = { title: 'Banner Hero', subtitle: 'Subtítulo incrível' }
        if (widgetType === 'cta') defaultData = { title: 'Chamada para Ação', primaryButtonText: 'Comprar' }

        const newWidget = {
          id: crypto.randomUUID(),
          type: widgetType,
          data: defaultData
        }

        const colId = destination.droppableId.replace('col-', '')
        
        setPageData((prev: any) => {
          const newSections = JSON.parse(JSON.stringify(prev.sections))
          for (const section of newSections) {
            const col = section.columns?.find((c: any) => c.id === colId)
            if (col) {
               if (!col.widgets) col.widgets = []
               col.widgets.splice(destination.index, 0, newWidget)
               break
            }
          }
          return { ...prev, sections: newSections }
        })
        setSelectedElement({ type: 'widget', id: newWidget.id })
        return
      }
      
      return
    }

    // Reordenando Sessões (Containers)
    if (type === 'container' && source.droppableId === 'canvas-root' && destination.droppableId === 'canvas-root') {
      setPageData((prev: any) => {
        const newSections = Array.from(prev.sections)
        const [removed] = newSections.splice(source.index, 1)
        newSections.splice(destination.index, 0, removed)
        return { ...prev, sections: newSections }
      })
      return
    }

    // Reordenando Widgets entre colunas ou na mesma
    if (source.droppableId.startsWith('col-') && destination.droppableId.startsWith('col-')) {
       const sourceColId = source.droppableId.replace('col-', '')
       const destColId = destination.droppableId.replace('col-', '')

       setPageData((prev: any) => {
          const newSections = JSON.parse(JSON.stringify(prev.sections))
          let sourceCol: any = null
          let destCol: any = null

          for (const section of newSections) {
             const sc = section.columns?.find((c: any) => c.id === sourceColId)
             if (sc) sourceCol = sc
             const dc = section.columns?.find((c: any) => c.id === destColId)
             if (dc) destCol = dc
          }

          if (sourceCol && destCol) {
             if (!sourceCol.widgets) sourceCol.widgets = []
             if (!destCol.widgets) destCol.widgets = []
             
             const [movedWidget] = sourceCol.widgets.splice(source.index, 1)
             destCol.widgets.splice(destination.index, 0, movedWidget)
          }

          return { ...prev, sections: newSections }
       })
       return
    }
  }

const handleSave = async () => {
    try {
      await apiClient.patch(`/pages/${pageData.slug}`, { 
        sections: pageData.sections,
        title: pageData.title,
        description: pageData.description,
        slug: pageData.slug 
      })
      toast.success('Página salva com sucesso!')
      
      // Se o slug mudou, precisamos redirecionar para a nova URL limpa
      if (pageData.slug !== slug) {
         router.push(`/admin/builder/${pageData.slug}`)
      }
    } catch (e: any) {
      toast.error('Erro ao salvar página')
    }
  }

  if (!pageData) return <div className="flex h-screen items-center justify-center">Carregando construtor...</div>

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Top Navbar */}
      <header className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/paginas')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold">Editando Página</h1>
            <p className="text-xs text-muted-foreground">{slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm bg-background shadow-sm">
            <Monitor className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground">
            <Tablet className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground">
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsSeoOpen(true)}>Configurações (SEO)</Button>
          <Button size="sm" className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </header>

      <Dialog open={isSeoOpen} onOpenChange={setIsSeoOpen}>
        <DialogContent>
           <DialogHeader>
              <DialogTitle>Search Engine Optimization (SEO)</DialogTitle>
           </DialogHeader>
           <div className="space-y-4 py-4">
              <div className="space-y-2">
                 <Label>Título (Meta Title)</Label>
                 <Input 
                   value={pageData.title || ''} 
                   onChange={(e) => setPageData({...pageData, title: e.target.value})} 
                   placeholder="Ex: Melhor Sorveteria de SP"
                 />
                 <p className="text-[10px] text-muted-foreground">O título principal que aparece na aba do navegador e no Google.</p>
              </div>
              <div className="space-y-2">
                 <Label>Link do Site (Slug)</Label>
                 <Input 
                   value={pageData.slug || ''} 
                   onChange={(e) => setPageData({...pageData, slug: e.target.value})} 
                 />
                 <p className="text-[10px] text-muted-foreground">URL única. Evite usar espaços (use ifens -). Ex: `sobre-nossa-empresa`.</p>
              </div>
              <div className="space-y-2">
                 <Label>Descrição (Meta Description)</Label>
                 <Textarea 
                   value={pageData.description || ''} 
                   onChange={(e) => setPageData({...pageData, description: e.target.value})} 
                   placeholder="Descritivo para ajudar a ranquear no Google..."
                 />
              </div>
           </div>
           <DialogFooter>
              <Button onClick={() => { setIsSeoOpen(false); handleSave(); }}>Salvar e Aplicar SEO</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Elements Library */}
        <aside className="w-64 border-r bg-card shrink-0 flex flex-col">
          <div className="p-3 border-b">
            <h2 className="text-sm font-semibold">Elementos</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <Accordion type="multiple" defaultValue={['Layout', 'Elementos Básicos', 'Módulos da Loja']} className="w-full">
               {WIDGET_CATEGORIES.map((category) => (
                 <AccordionItem value={category.title} key={category.title} className="border-b-0">
                   <AccordionTrigger className="text-xs uppercase font-bold text-muted-foreground hover:no-underline py-3 px-2">
                     {category.title}
                   </AccordionTrigger>
                   <AccordionContent className="px-1">
                     <Droppable droppableId={`sidebar-${category.title}`} isDropDisabled={true} type={category.title === 'Layout' ? 'container' : 'widget'} direction="vertical">
                       {(provided) => (
                         <div 
                           className="grid grid-cols-2 gap-2"
                           ref={provided.innerRef}
                           {...provided.droppableProps}
                         >
                           {category.items.map((item, index) => (
                             <Draggable key={`sidebar-${item.type}`} draggableId={`sidebar-${item.type}`} index={index}>
                               {(provided) => (
                                 <div 
                                   ref={provided.innerRef}
                                   {...provided.draggableProps}
                                   {...provided.dragHandleProps}
                                   className="flex flex-col items-center justify-center gap-2 p-3 bg-muted/40 hover:bg-muted/80 border rounded-md cursor-grab active:cursor-grabbing transition-colors group"
                                 >
                                   <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                   <span className="text-[10px] font-medium text-center">{item.label}</span>
                                 </div>
                               )}
                             </Draggable>
                           ))}
                           {provided.placeholder}
                         </div>
                       )}
                     </Droppable>
                   </AccordionContent>
                 </AccordionItem>
               ))}
            </Accordion>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 bg-muted/30 overflow-y-auto relative p-4 flex justify-center">
            {/* Wrapper for the "Website" look */}
            <div className="w-full max-w-6xl min-h-full bg-background border shadow-sm rounded-sm">
                              <Droppable droppableId="canvas-root" type="container" isDropDisabled={false}>
                 {(provided, snapshot) => (
                    <div 
                      className={`min-h-[500px] w-full flex flex-col gap-2 p-4 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 border-primary border-dashed border-2 rounded-xl' : ''}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {pageData.sections.length === 0 && !snapshot.isDraggingOver && (
                         <div className="p-8 text-center text-muted-foreground mt-20 border-2 border-dashed rounded-xl">
                            Arraste uma Sessão para começar
                         </div>
                      )}
                      
                      <div className="relative w-full">
                         <BuilderRenderer 
                           sections={pageData.sections} 
                           selectedElement={selectedElement} 
                           onSelectElement={(type, id) => setSelectedElement({ type, id })} 
                         />
                      </div>

                      {provided.placeholder}
                    </div>
                 )}
               </Droppable>

            </div>
        </main>

        {/* Right Sidebar - Properties/Styles */}
        <aside className="w-80 border-l bg-card shrink-0 flex flex-col">
           <BuilderProperties 
             elementId={selectedElement?.id || null} 
             elementType={selectedElement?.type || null}
             pageData={pageData}
             onChange={setPageData}
           />
        </aside>
      </div>
    </div>
    </DragDropContext>
  )
}
