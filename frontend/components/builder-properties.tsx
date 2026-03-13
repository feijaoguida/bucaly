import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlignLeft, AlignCenter, AlignRight, Image as ImageIcon } from 'lucide-react'

// P M G Sizes mappings
const PADDING_SIZES = {
  'P': '1rem',
  'M': '3rem',
  'G': '6rem'
}

export function BuilderProperties({
  elementId,
  elementType,
  pageData,
  onChange
}: {
  elementId: string | null
  elementType: 'container' | 'column' | 'widget' | string | null
  pageData: any
  onChange: (newData: any) => void
}) {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content')
  const [presets, setPresets] = useState<any[]>([])
  const [newPresetName, setNewPresetName] = useState('')

  useEffect(() => {
    // Carregar presets ao montar
    const saved = localStorage.getItem('bucaly_builder_presets')
    if (saved) {
      try { setPresets(JSON.parse(saved)) } catch(e){}
    }
  }, [])

  const savePreset = () => {
    if (!newPresetName.trim() || !element) return
    const newPreset = {
      id: crypto.randomUUID(),
      name: newPresetName,
      type: elementType,
      dataBaseType: element.type,
      data: element.data,
      settings: element.settings
    }
    const updated = [...presets, newPreset]
    setPresets(updated)
    localStorage.setItem('bucaly_builder_presets', JSON.stringify(updated))
    setNewPresetName('')
  }

  const applyPreset = (preset: any) => {
    const newPageData = JSON.parse(JSON.stringify(pageData))
    // Aplicador recursivo simples
    const applyToTarget = (sections: any[]) => {
      if (elementType === 'container') {
        const sec = sections.find(s => s.id === elementId)
        if (sec) { sec.data = preset.data; sec.settings = preset.settings }
      } else if (elementType === 'column') {
        sections.forEach(sec => {
          const col = sec.columns?.find((c: any) => c.id === elementId)
          if (col) { col.data = preset.data; col.settings = preset.settings }
        })
      } else {
        sections.forEach(sec => {
          sec.columns?.forEach((col: any) => {
            const wid = col.widgets?.find((w: any) => w.id === elementId)
            if (wid) { wid.data = preset.data; wid.settings = preset.settings }
          })
        })
      }
    }
    applyToTarget(newPageData.sections)
    onChange(newPageData)
  }

  if (!elementId) {
    return (
       <div className="text-xs text-muted-foreground text-center mt-10 p-4">
         Selecione um elemento na Tela para começar a edita-lo.
       </div>
    )
  }

  // Find the selected element deeply in pageData
  let element: any = null
  let elementParent: any = null // Parent ref for updates if needed, though we will just pass a cloned pageData via onChange

  if (elementType === 'container') {
    element = pageData.sections.find((s: any) => s.id === elementId)
  } else if (elementType === 'column') {
    for (const sec of pageData.sections) {
      const col = sec.columns?.find((c: any) => c.id === elementId)
      if (col) { element = col; elementParent = sec; break; }
    }
  } else if (elementType === 'widget') {
    for (const sec of pageData.sections) {
      for (const col of (sec.columns || [])) {
        const wid = col.widgets?.find((w: any) => w.id === elementId)
        if (wid) { element = wid; elementParent = col; break; }
      }
      if (element) break;
    }
  }

  if (!element) return <div className="p-4 text-xs">Elemento não encontrado no estado.</div>

  const updateField = (path: 'data' | 'settings', key: string, value: any) => {
    const newPageData = JSON.parse(JSON.stringify(pageData))
    
    // Find and update the exact reference
    // Para simplificar a recursividade visual aqui:
    const updateTarget = (sections: any[]) => {
      if (elementType === 'container') {
        const sec = sections.find(s => s.id === elementId)
        if (sec) { if(!sec[path]) sec[path] = {}; sec[path][key] = value }
      } else if (elementType === 'column') {
        sections.forEach(sec => {
          const col = sec.columns?.find((c: any) => c.id === elementId)
          if (col) { if(!col[path]) col[path] = {}; col[path][key] = value }
        })
      } else {
        sections.forEach(sec => {
          sec.columns?.forEach((col: any) => {
            const wid = col.widgets?.find((w: any) => w.id === elementId)
            if (wid) { if(!wid[path]) wid[path] = {}; wid[path][key] = value }
          })
        })
      }
    }
    
    updateTarget(newPageData.sections)
    onChange(newPageData)
  }

  const handlePaddingSize = (size: 'P' | 'M' | 'G') => {
    const val = PADDING_SIZES[size]
    const newPageData = JSON.parse(JSON.stringify(pageData))
    const sec = newPageData.sections.find((s: any) => s.id === elementId)
    if (sec) {
      if (!sec.settings) sec.settings = {}
      if (!sec.settings.padding) sec.settings.padding = {}
      sec.settings.padding.top = val
      sec.settings.padding.bottom = val
      onChange(newPageData)
    }
  }

  const data = element.data || {}
  const settings = element.settings || {}

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex gap-2 shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setActiveTab('content')}
          className={`flex-1 rounded-none ${activeTab === 'content' ? 'border-b-2 border-primary bg-muted/50 text-foreground' : 'text-muted-foreground'}`}
        >
          Conteúdo
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setActiveTab('style')}
          className={`flex-1 rounded-none px-1 ${activeTab === 'style' ? 'border-b-2 border-primary bg-muted/50 text-foreground' : 'text-muted-foreground'}`}
        >
          Estilo
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 rounded-none px-1 ${activeTab === 'advanced' ? 'border-b-2 border-primary bg-muted/50 text-foreground' : 'text-muted-foreground'}`}
        >
          Padrões
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
           <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground uppercase">{element.type || elementType}</span>
        </div>

        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* General Text inputs based on common data keys */}
            {elementType === 'widget' && ['heading', 'text_block', 'banner', 'cta'].includes(element.type) && (
              <div className="space-y-2">
                <Label className="text-xs">Título Principal</Label>
                <Input value={data.title || ''} onChange={(e) => updateField('data', 'title', e.target.value)} />
              </div>
            )}

            {elementType === 'widget' && ['text_block', 'banner', 'cta', 'image'].includes(element.type) && (
               <div className="space-y-2">
                 <Label className="text-xs">Conteúdo / Subtítulo</Label>
                 <Textarea className="min-h-[100px]" value={data.content || data.subtitle || ''} onChange={(e) => updateField('data', 'content', e.target.value)} />
               </div>
            )}

            {elementType === 'widget' && ['button', 'cta', 'banner'].includes(element.type) && (
               <>
                 <div className="space-y-2">
                   <Label className="text-xs">Texto do Botão</Label>
                   <Input value={data.buttonText || data.primaryButtonText || ''} onChange={(e) => updateField('data', element.type === 'button' ? 'buttonText' : 'primaryButtonText', e.target.value)} />
                 </div>
                 <div className="space-y-2">
                   <Label className="text-xs">Link (URL)</Label>
                   <Input placeholder="/url-aqui" value={data.buttonLink || data.primaryButtonLink || ''} onChange={(e) => updateField('data', element.type === 'button' ? 'buttonLink' : 'primaryButtonLink', e.target.value)} />
                 </div>
               </>
            )}

            {/* If it's a container or column, they usually don't have text content, but Settings */}
            {(elementType === 'container' || elementType === 'column') && (
              <div className="text-xs text-muted-foreground">
                Sessões e Colunas são elementos estruturais. Alterne para a aba "Estilo" para definir cor de fundo, largura e espaçamentos.
              </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-6">
            
            {elementType === 'container' && (
              <>
                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase">Tamanho do Espaçamento</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePaddingSize('P')}>P</Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePaddingSize('M')}>M</Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePaddingSize('G')}>G</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="space-y-1">
                       <Label className="text-[10px] text-muted-foreground">Topo Exato</Label>
                       <Input value={settings.padding?.top || ''} onChange={(e) => {
                          const newPageData = JSON.parse(JSON.stringify(pageData))
                          const sec = newPageData.sections.find((s: any) => s.id === elementId)
                          if (!sec.settings) sec.settings = {}; if(!sec.settings.padding) sec.settings.padding = {}
                          sec.settings.padding.top = e.target.value; onChange(newPageData);
                       }} />
                    </div>
                    <div className="space-y-1">
                       <Label className="text-[10px] text-muted-foreground">Base Exata</Label>
                       <Input value={settings.padding?.bottom || ''} onChange={(e) => {
                          const newPageData = JSON.parse(JSON.stringify(pageData))
                          const sec = newPageData.sections.find((s: any) => s.id === elementId)
                          if (!sec.settings) sec.settings = {}; if(!sec.settings.padding) sec.settings.padding = {}
                          sec.settings.padding.bottom = e.target.value; onChange(newPageData);
                       }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-semibold uppercase">Fundo (Background)</Label>
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground">Cor (Ex: #ff0000 ou red)</Label>
                    <Input placeholder="#ffffff" value={settings.background?.type === 'color' ? settings.background.value : ''} onChange={(e) => {
                          const newPageData = JSON.parse(JSON.stringify(pageData))
                          const sec = newPageData.sections.find((s: any) => s.id === elementId)
                          if (!sec.settings) sec.settings = {}; sec.settings.background = { type: 'color', value: e.target.value }
                          onChange(newPageData)
                    }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase">Largura Total da Tela</Label>
                  <input type="checkbox" checked={settings.fullWidth || false} onChange={(e) => updateField('settings', 'fullWidth', e.target.checked)} className="w-4 h-4" />
                </div>
              </>
            )}

            {elementType === 'column' && (
              <div className="space-y-3">
                 <Label className="text-xs font-semibold uppercase">Largura da Coluna</Label>
                 <select 
                   className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                   value={element.size || '1/1'}
                   onChange={(e) => {
                      const newPageData = JSON.parse(JSON.stringify(pageData))
                      newPageData.sections.forEach((sec: any) => {
                        const col = sec.columns?.find((c: any) => c.id === elementId)
                        if (col) col.size = e.target.value
                      })
                      onChange(newPageData)
                   }}
                 >
                   <option value="1/1">100% (Cheia)</option>
                   <option value="1/2">50% (Metade)</option>
                   <option value="1/3">33% (Um Terço)</option>
                   <option value="2/3">66% (Dois Terços)</option>
                   <option value="1/4">25% (Um Quarto)</option>
                 </select>
              </div>
            )}

            {elementType === 'widget' && (
              <div className="space-y-4">
                 <div className="p-3 bg-muted rounded flex gap-2 items-start opacity-70">
                    <ImageIcon className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-tight">As Cores e Formas completas são manipuladas via a Aba "Padrões".</p>
                 </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase">Salvar Padrão (Preset)</Label>
              <p className="text-[10px] text-muted-foreground">Salve as configurações atuais deste bloco para reaproveitar depois, evitando formatos desiguais.</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Botão Laranja M" 
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button size="sm" onClick={savePreset} disabled={!newPresetName.trim()}>Salvar</Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label className="text-xs font-semibold uppercase">Padrões Salvos</Label>
              <div className="flex flex-col gap-2">
                {presets.filter(p => p.type === elementType && p.dataBaseType === element.type).length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded border border-dashed">Nenhum Padrão Compatível Salvo.</p>
                ) : (
                  presets.filter(p => p.type === elementType && p.dataBaseType === element.type).map(preset => (
                    <div key={preset.id} className="flex justify-between items-center bg-muted/50 p-2 rounded border">
                      <span className="text-xs font-medium truncate w-[150px]">{preset.name}</span>
                      <Button size="sm" variant="secondary" className="h-6 text-[10px]" onClick={() => applyPreset(preset)}>Aplicar</Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
