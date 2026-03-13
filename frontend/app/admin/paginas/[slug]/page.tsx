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
import { Save, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function EditPageCMS() {
  const { slug } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    sections: {} as Record<string, any>
  })

  // Exemplo de seção default para nova adição
  const [newSectionKey, setNewSectionKey] = useState('')

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchSlug = Array.isArray(slug) ? slug[0] : slug;
        // O Endpoint garante retorno de JSON vazio preenchido (ensurePageExists)
        if (fetchSlug) {
          const res = await apiClient.get(`/pages/${fetchSlug}`)
          if (res.data?.data) {
            setPageData({
              title: res.data.data.title || '',
              description: res.data.data.description || '',
              sections: res.data.data.sections || {}
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

  const handleUpdateSection = (key: string, field: string, value: any) => {
    setPageData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: {
          ...prev.sections[key],
          [field]: value
        }
      }
    }))
  }

  const handleAddSection = () => {
    if (!newSectionKey.trim()) return
    const key = newSectionKey.toLowerCase().replace(/\s+/g, '-')
    if (pageData.sections[key]) {
      toast.error('Já existe uma seção com esse nome')
      return;
    }
    
    setPageData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: { enabled: true, title: 'Nova Seção', content: '' }
      }
    }))
    setNewSectionKey('')
  }

  const handleDeleteSection = (key: string) => {
    const newSections = { ...pageData.sections }
    delete newSections[key]
    setPageData(prev => ({ ...prev, sections: newSections }))
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando editor CMS...</div>

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/paginas"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">CMS: {slug}</h1>
            <p className="text-muted-foreground text-sm">Edite o conteúdo em formato JSON injetado na interface</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meta SEO e Títulos</CardTitle>
          <CardDescription>Informações básicas para exibição na aba do navegador e buscadores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Título Interno (exibido na UI)</Label>
            <Input 
              value={pageData.title} 
              onChange={e => setPageData(p => ({ ...p, title: e.target.value }))} 
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição (Meta Description)</Label>
            <Textarea 
              value={pageData.description} 
              onChange={e => setPageData(p => ({ ...p, description: e.target.value }))}
              placeholder="Descreva o conteúdo para o Google..." 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-xl font-bold">Seções Dinâmicas</h2>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Nova seção (ex: hero_banner)" 
            className="w-48 h-9"
            value={newSectionKey}
            onChange={e => setNewSectionKey(e.target.value)}
          />
          <Button size="sm" variant="secondary" onClick={handleAddSection}>
            <Plus className="mr-2 h-4 w-4"/> Add Bloco
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(pageData.sections).map(([key, data]: [string, any]) => (
          <Card key={key} className={!data.enabled ? 'opacity-50' : ''}>
            <CardHeader className="flex flex-row items-center space-y-0 py-3 bg-muted/30 border-b">
              <div className="flex items-center gap-3 flex-1">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <CardTitle className="text-base font-mono">#{key}</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                     checked={data.enabled !== false}
                     onCheckedChange={(c) => handleUpdateSection(key, 'enabled', c)}
                  />
                  <Label className="text-xs">Visível</Label>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDeleteSection(key)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               {/* Renderer Simplificado de Propriedades Comuns */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Título / Headline</Label>
                   <Input 
                     value={data.title || ''} 
                     onChange={e => handleUpdateSection(key, 'title', e.target.value)} 
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Imagem / URL Background</Label>
                   <Input 
                     value={data.image || ''} 
                     onChange={e => handleUpdateSection(key, 'image', e.target.value)} 
                     placeholder="https://..."
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Conteúdo Adicional (Texto / Payload JSON extra)</Label>
                 <Textarea 
                    rows={3} 
                    value={data.content || data.subtitle || ''}
                    onChange={e => handleUpdateSection(key, 'content', e.target.value)}
                 />
               </div>
            </CardContent>
          </Card>
        ))}

        {Object.keys(pageData.sections).length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            Nenhuma seção dinâmica adicionada nesta página. Utilize o botão acima.
          </div>
        )}
      </div>

    </div>
  )
}
