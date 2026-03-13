'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, apiClient } from '@/lib/api'
import { getPageData } from '@/lib/cms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, ArrowLeft, Plus, Trash2, GripVertical, Settings } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function EditPageCMS() {
  const { slug } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    sections: [] as any[]
  })

  // Novo item sendo criado
  const [newSectionType, setNewSectionType] = useState('banner')

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchSlug = Array.isArray(slug) ? slug[0] : slug;
        // O Endpoint garante retorno 
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(pageData.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPageData(prev => ({
      ...prev,
      sections: items
    }));
  }

  const handleUpdateSection = (index: number, field: string, value: any) => {
    const newSections = [...pageData.sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setPageData(prev => ({ ...prev, sections: newSections }));
  }

  const handleUpdateSectionData = (index: number, field: string, value: any) => {
    const newSections = [...pageData.sections];
    newSections[index] = {
      ...newSections[index],
      data: {
        ...newSections[index].data,
        [field]: value
      }
    };
    setPageData(prev => ({ ...prev, sections: newSections }));
  }

  const handleAddSection = () => {
    const defaultData: any = {};
    if (newSectionType === 'banner') {
      defaultData.title = 'Novo Banner';
      defaultData.subtitle = '';
      defaultData.image = '';
    } else if (newSectionType === 'products' || newSectionType === 'featuredProducts') {
      defaultData.title = 'Produtos';
      defaultData.limit = 4;
    } else if (newSectionType === 'text_block') {
      defaultData.title = 'Novo Título';
      defaultData.content = 'Insira seu texto...';
    }

    const newSection = {
      id: crypto.randomUUID(),
      type: newSectionType,
      name: `Nova Seção (${newSectionType})`,
      enabled: true,
      data: defaultData
    }

    setPageData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
    toast.success('Seção adicionada!')
  }

  const handleDeleteSection = (index: number) => {
    if(!confirm("Atenção: A seção será apagada e você não conseguirá recuperar sem recarregar a página. Continuar?")) return;
    const newSections = [...pageData.sections]
    newSections.splice(index, 1)
    setPageData(prev => ({ ...prev, sections: newSections }))
  }

  const getSectionIcon = (type: string) => {
    // Pode expandir depois
    return <Settings className="h-5 w-5 text-primary" />
  }

  const getSectionTypeName = (type: string) => {
    const map: Record<string, string> = {
      'banner': 'Banner',
      'categories': 'Categorias',
      'products': 'Produtos',
      'featuredProducts': 'Produtos em Destaque',
      'benefits': 'Benefícios',
      'cta': 'Call to Action',
      'text_block': 'Bloco de Texto'
    }
    return map[type] || type
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando editor CMS...</div>

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-card z-10 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="hidden sm:flex">
            <Link href="/admin"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{pageData.title || slug}</h1>
            <p className="text-muted-foreground text-sm">Reordene, ative ou edite cada seção da página.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <div className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections-list">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-3"
              >
                {pageData.sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-4 p-4 bg-background border rounded-lg shadow-sm transition-colors ${
                          snapshot.isDragging ? 'border-primary ring-1 ring-primary/20' : ''
                        } ${!section.enabled ? 'opacity-60 grayscale-[0.2]' : ''}`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="p-2 -ml-2 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5" />
                        </div>
                        
                        <div className="p-2 bg-primary/10 rounded-md">
                          {getSectionIcon(section.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold truncate">{section.name || section.data?.title}</h3>
                          <p className="text-xs text-muted-foreground truncate">{getSectionTypeName(section.type)}</p>
                        </div>

                        <div className="flex items-center gap-4 pl-4 shrink-0">
                          <Switch 
                            checked={section.enabled}
                            onCheckedChange={(checked) => handleUpdateSection(index, 'enabled', checked)}
                          />

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-9">
                                <Settings className="h-4 w-4 mr-2" /> Editar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Editar {section.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                  <Label>Nome Interno da Seção</Label>
                                  <Input 
                                    value={section.name} 
                                    onChange={e => handleUpdateSection(index, 'name', e.target.value)} 
                                  />
                                </div>
                                <div className="border-t pt-4 space-y-4">
                                  <h4 className="font-medium text-sm text-muted-foreground">Conteúdo ({section.type})</h4>
                                  
                                  {/* Inputs Genéricos baseados no conteudo */}
                                  {section.data?.title !== undefined && (
                                    <div className="space-y-2">
                                      <Label>Título / Headline</Label>
                                      <Input 
                                        value={section.data.title || ''} 
                                        onChange={e => handleUpdateSectionData(index, 'title', e.target.value)} 
                                      />
                                    </div>
                                  )}

                                  {section.data?.subtitle !== undefined && (
                                    <div className="space-y-2">
                                      <Label>Subtítulo</Label>
                                      <Input 
                                        value={section.data.subtitle || ''} 
                                        onChange={e => handleUpdateSectionData(index, 'subtitle', e.target.value)} 
                                      />
                                    </div>
                                  )}

                                  {section.data?.image !== undefined && (
                                    <div className="space-y-2">
                                      <Label>Imagem (URL)</Label>
                                      <Input 
                                        value={section.data.image || ''} 
                                        onChange={e => handleUpdateSectionData(index, 'image', e.target.value)} 
                                      />
                                    </div>
                                  )}

                                  {section.data?.content !== undefined && (
                                    <div className="space-y-2">
                                      <Label>Texto / Conteúdo Longo</Label>
                                      <Textarea 
                                        rows={4}
                                        value={section.data.content || ''} 
                                        onChange={e => handleUpdateSectionData(index, 'content', e.target.value)} 
                                      />
                                    </div>
                                  )}

                                  {section.data?.buttonText !== undefined && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Texto Botão Principal</Label>
                                        <Input 
                                          value={section.data.buttonText || section.data.primaryButtonText || ''} 
                                          onChange={e => {
                                            if (section.data.primaryButtonText !== undefined) {
                                              handleUpdateSectionData(index, 'primaryButtonText', e.target.value)
                                            } else {
                                              handleUpdateSectionData(index, 'buttonText', e.target.value)
                                            }
                                          }} 
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Link Botão Principal</Label>
                                        <Input 
                                          value={section.data.buttonLink || section.data.primaryButtonLink || ''} 
                                          onChange={e => {
                                            if (section.data.primaryButtonLink !== undefined) {
                                              handleUpdateSectionData(index, 'primaryButtonLink', e.target.value)
                                            } else {
                                              handleUpdateSectionData(index, 'buttonLink', e.target.value)
                                            }
                                          }} 
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {section.data?.limit !== undefined && (
                                    <div className="space-y-2">
                                      <Label>Limite de Exibição (Qtd)</Label>
                                      <Input 
                                        type="number"
                                        value={section.data.limit || 4} 
                                        onChange={e => handleUpdateSectionData(index, 'limit', parseInt(e.target.value))} 
                                      />
                                    </div>
                                  )}

                                </div>
                              </div>
                              <DialogFooter className="flex items-center sm:justify-between w-full">
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteSection(index)}>
                                  <Trash2 className="h-4 w-4 mr-2" /> Excluir Seção
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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

        {pageData.sections.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground bg-muted/30">
            Nenhuma seção dinâmica encontrada.
          </div>
        )}

        <div className="flex items-center gap-2 pt-6 pb-12">
          <Select value={newSectionType} onValueChange={setNewSectionType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de Seção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banner">Banner Hero</SelectItem>
              <SelectItem value="products">Lista de Produtos</SelectItem>
              <SelectItem value="categories">Lista de Categorias</SelectItem>
              <SelectItem value="text_block">Bloco de Texto</SelectItem>
              <SelectItem value="cta">Call to Action</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={handleAddSection}>
            <Plus className="mr-2 h-4 w-4"/> Adicionar nova seção
          </Button>
        </div>
      </div>
    </div>
  )
}
