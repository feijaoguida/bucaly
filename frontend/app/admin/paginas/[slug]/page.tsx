'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Save, ArrowLeft, Plus, Trash2, Settings, Columns, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

export default function EditPageCMS() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    sections: [] as any[]
  })

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchSlug = Array.isArray(slug) ? slug[0] : slug;
        if (fetchSlug) {
          const res = await apiClient.get(`/pages/${fetchSlug}`)
          if (res.data?.data) {
            setPageData({
              title: res.data.data.title || '',
              description: res.data.data.description || '',
              sections: Array.isArray(res.data.data.sections) ? res.data.data.sections : []
            })
          }
        }
      } catch (error) {
        toast.error('Erro ao carregar página. Ela pode não existir.')
      } finally {
        setLoading(false)
      }
    }
    
    if (slug) fetchPage()
  }, [slug])

  const handleSave = async () => {
    try {
      setSaving(true)
      const fetchSlug = Array.isArray(slug) ? slug[0] : slug;
      await apiClient.patch(`/pages/${fetchSlug}`, {
        title: pageData.title,
        description: pageData.description,
        sections: pageData.sections,
      })
      toast.success('Página salva com sucesso!')
    } catch {
      toast.error('Erro ao salvar página')
    } finally {
      setSaving(false)
    }
  }

  const handleAddContainer = () => {
    const newContainer = {
      id: crypto.randomUUID(),
      type: 'container',
      enabled: true,
      settings: { padding: { top: '4rem', bottom: '4rem' }, fullWidth: false },
      columns: [
        {
          id: crypto.randomUUID(),
          size: '1/1',
          widgets: []
        }
      ]
    }
    setPageData(prev => ({ ...prev, sections: [...prev.sections, newContainer] }))
  }

  const handleDeleteContainer = (containerIndex: number) => {
    if(!confirm("Tem certeza que deseja apagar esta seção inteira?")) return;
    const newSections = [...pageData.sections]
    newSections.splice(containerIndex, 1)
    setPageData(prev => ({ ...prev, sections: newSections }))
  }

  const handleAddWidget = (containerIndex: number, colIndex: number, type: string) => {
    const newSections = [...pageData.sections]
    const defaultData: any = {}
    
    if (type === 'banner') {
      defaultData.title = 'Novo Banner'
      defaultData.image = ''
    } else if (type === 'text_block') {
      defaultData.title = 'Novo Título'
      defaultData.content = 'Texto...'
    } else if (type === 'products' || type === 'featuredProducts') {
      defaultData.title = 'Produtos'
      defaultData.limit = 4
    }

    newSections[containerIndex].columns[colIndex].widgets.push({
      id: crypto.randomUUID(),
      type,
      data: defaultData
    })
    
    setPageData(prev => ({ ...prev, sections: newSections }))
  }

  const handleDeleteWidget = (containerIndex: number, colIndex: number, widgetIndex: number) => {
    const newSections = [...pageData.sections]
    newSections[containerIndex].columns[colIndex].widgets.splice(widgetIndex, 1)
    setPageData(prev => ({ ...prev, sections: newSections }))
  }

  const handleUpdateWidgetData = (containerIndex: number, colIndex: number, widgetIndex: number, field: string, value: any) => {
    const newSections = [...pageData.sections]
    newSections[containerIndex].columns[colIndex].widgets[widgetIndex].data[field] = value
    setPageData(prev => ({ ...prev, sections: newSections }))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    // Por enquanto suportando apenas reordenação raiz de containers
    if (result.type === 'CONTAINER') {
      const items = Array.from(pageData.sections);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      
      setPageData(prev => ({ ...prev, sections: items }));
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando Construtor...</div>

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-card z-30 py-4 px-6 border-b shadow-sm m-4 rounded-xl">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="hidden sm:flex">
            <Link href="/admin/paginas"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">{pageData.title || slug} (Builder)</h1>
            <p className="text-muted-foreground text-xs">Arraste sessões, crie colunas e coloque widgets.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Publicação'}
        </Button>
      </div>

      <div className="px-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="CONTAINER">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                
                {pageData.sections.map((container, cIdx) => (
                  <Draggable key={container.id} draggableId={container.id} index={cIdx}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        className={`bg-background border rounded-xl overflow-hidden transition-all shadow-sm ${snapshot.isDragging ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      >
                        {/* Container Header */}
                        <div className="flex items-center justify-between bg-muted/50 p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="cursor-grab hover:text-primary active:cursor-grabbing text-muted-foreground">
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-semibold flex items-center gap-2">
                              <Columns className="h-4 w-4" /> Secção Principal
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Ativo</Label>
                              <Switch 
                                checked={container.enabled} 
                                onCheckedChange={(val) => {
                                  const ns = [...pageData.sections]; ns[cIdx].enabled = val; setPageData(p => ({...p, sections: ns}))
                                }} 
                              />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContainer(cIdx)} className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Columns Area */}
                        <div className={`p-4 bg-grid-slate-50 relative ${!container.enabled ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                          <div className="flex flex-col md:flex-row gap-4 min-h-[150px]">
                            
                            {(container.columns || []).map((col: any, colIdx: number) => (
                              <div key={col.id} className="flex-1 border-2 border-dashed border-primary/20 rounded-lg p-3 bg-card flex flex-col gap-3 relative min-h-[120px]">
                                <div className="absolute -top-3 left-3 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-card">Coluna</div>
                                
                                {/* Widgets List */}
                                {(col.widgets || []).map((widget: any, wIdx: number) => (
                                  <div key={widget.id} className="bg-muted p-3 flex items-center justify-between rounded-md border text-sm group">
                                    <div className="flex flex-col">
                                      <span className="font-semibold">{widget.data.title || widget.type}</span>
                                      <span className="text-xs text-muted-foreground capitalize">{widget.type}</span>
                                    </div>
                                    
                                    {/* Edit Widget Modal */}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Settings className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-h-[85vh] overflow-y-auto">
                                        <DialogHeader><DialogTitle>Editar {widget.type}</DialogTitle></DialogHeader>
                                        <div className="space-y-4 py-4">
                                          {widget.data?.title !== undefined && (
                                            <div className="space-y-2">
                                              <Label>Título</Label>
                                              <Input value={widget.data.title} onChange={e => handleUpdateWidgetData(cIdx, colIdx, wIdx, 'title', e.target.value)} />
                                            </div>
                                          )}
                                          {widget.data?.subtitle !== undefined && (
                                            <div className="space-y-2">
                                              <Label>Subtítulo</Label>
                                              <Input value={widget.data.subtitle} onChange={e => handleUpdateWidgetData(cIdx, colIdx, wIdx, 'subtitle', e.target.value)} />
                                            </div>
                                          )}
                                          {widget.data?.content !== undefined && (
                                            <div className="space-y-2">
                                              <Label>Texto Base / Conteúdo</Label>
                                              <Textarea rows={4} value={widget.data.content} onChange={e => handleUpdateWidgetData(cIdx, colIdx, wIdx, 'content', e.target.value)} />
                                            </div>
                                          )}
                                          {widget.data?.image !== undefined && (
                                            <div className="space-y-2">
                                              <Label>Imagem (URL)</Label>
                                              <Input value={widget.data.image} onChange={e => handleUpdateWidgetData(cIdx, colIdx, wIdx, 'image', e.target.value)} />
                                            </div>
                                          )}
                                          {widget.data?.buttonText !== undefined && (
                                            <div className="space-y-2">
                                              <Label>Botão Principal (Texto e Link)</Label>
                                              <div className="flex gap-2">
                                                <Input placeholder="Texto" value={widget.data.buttonText} onChange={e => handleUpdateWidgetData(cIdx, colIdx, wIdx, 'buttonText', e.target.value)} />
                                                <Input placeholder="/url" value={widget.data.buttonLink} onChange={e => handleUpdateWidgetData(cIdx, colIdx, wIdx, 'buttonLink', e.target.value)} />
                                              </div>
                                            </div>
                                          )}
                                          {widget.data?.limit !== undefined && (
                                            <div className="space-y-2">
                                              <Label>Limite de Itens Exibidos</Label>
                                              <Input type="number" value={widget.data.limit} onChange={e => handleUpdateWidgetData(cIdx, colIdx, wIdx, 'limit', parseInt(e.target.value, 10))} />
                                            </div>
                                          )}
                                        </div>
                                        <DialogFooter className="flex items-center justify-between w-full">
                                          <Button variant="destructive" onClick={() => handleDeleteWidget(cIdx, colIdx, wIdx)}><Trash2 className="h-4 w-4 mr-2" /> Excluir Widget</Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                ))}

                                {/* Add Widget Trigger */}
                                <div className="mt-auto pt-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground border border-dashed border-transparent hover:border-primary/50">
                                        <Plus className="h-3 w-3 mr-1" /> Add Widget
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader><DialogTitle>Adicionar Elemento</DialogTitle></DialogHeader>
                                      <div className="grid grid-cols-2 gap-4 py-4">
                                        {[
                                          { type: 'banner', label: 'Banner' },
                                          { type: 'text_block', label: 'Texto & Heading' },
                                          { type: 'categories', label: 'Grade Categorias' },
                                          { type: 'featuredProducts', label: 'Carrossel Produtos' },
                                          { type: 'cta', label: 'Call To Action' }
                                        ].map(opt => (
                                          <Button key={opt.type} variant="outline" className="h-20 flex-col gap-2" onClick={() => handleAddWidget(cIdx, colIdx, opt.type)}>
                                            <span className="font-semibold">{opt.label}</span>
                                          </Button>
                                        ))}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </Draggable>
                ))}
                
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="pt-8">
          <Button variant="outline" onClick={handleAddContainer} className="w-full py-8 border-dashed bg-muted/20 hover:bg-muted text-muted-foreground hover:text-foreground">
            <Plus className="h-5 w-5 mr-2" /> Nova Sessão de Trabalho (Container)
          </Button>
        </div>
      </div>
    </div>
  )
}

