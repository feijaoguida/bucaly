import Link from 'next/link'
import { ArrowRight, Shield, Truck, Clock, Sparkles, Layout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Droppable, Draggable } from '@hello-pangea/dnd'

export function BuilderRenderer({ 
  sections, 
  selectedElement, 
  onSelectElement 
}: { 
  sections: any[], 
  selectedElement: {type: string, id: string} | null,
  onSelectElement: (type: 'container' | 'column' | 'widget', id: string) => void
}) {

  const renderWidget = (widget: any, idx: number, colId: string) => {
    const isSelected = selectedElement?.id === widget.id

    // Component Render Logic (simplified for builder)
    let content = <div className="p-4 bg-muted text-center text-muted-foreground rounded-lg border">Widget: {widget.type}</div>
    if (widget.type === 'header') content = <div className="border border-dashed p-2 opacity-50 pointer-events-none"><Header data={widget.data} /></div>
    if (widget.type === 'footer') content = <div className="border border-dashed p-2 opacity-50 pointer-events-none"><Footer data={widget.data} /></div>

    return (
      <Draggable key={widget.id} draggableId={`widget-${widget.id}`} index={idx}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={(e) => { e.stopPropagation(); onSelectElement('widget', widget.id) }}
            className={`relative group ring-2 transition-all cursor-pointer rounded-sm ${isSelected ? 'ring-primary shadow-md z-10' : 'ring-transparent hover:ring-primary/40'}`}
          >
             <div className="absolute -top-4 right-2 bg-primary text-primary-foreground text-[10px] px-2 rounded-t-sm opacity-0 group-hover:opacity-100 z-20">
               {widget.type}
             </div>
             {content}
          </div>
        )}
      </Draggable>
    )
  }

  const renderColumn = (col: any, colIdx: number, sectionId: string) => {
    let colWidthClass = "w-full"
    if (col.size === '1/2') colWidthClass = "w-full md:w-1/2"
    if (col.size === '1/3') colWidthClass = "w-full md:w-1/3"
    if (col.size === '2/3') colWidthClass = "w-full md:w-2/3"
    if (col.size === '1/4') colWidthClass = "w-full md:w-1/4"

    const isSelected = selectedElement?.id === col.id

    return (
      <div 
        key={col.id} 
        className={`${colWidthClass} flex flex-col p-1 relative group/col cursor-pointer ring-1 transition-all ${isSelected ? 'ring-primary/80 bg-primary/5' : 'ring-border hover:ring-primary/30'}`}
        onClick={(e) => { e.stopPropagation(); onSelectElement('column', col.id) }}
      >
        <div className="absolute -top-4 left-2 bg-muted text-muted-foreground text-[9px] px-1 rounded-t-sm opacity-0 group-hover/col:opacity-100 z-10 border border-b-0">
          Col {col.size}
        </div>
        <Droppable droppableId={`col-${col.id}`} type="widget">
          {(provided, snapshot) => (
            <div 
              className={`flex-1 flex flex-col gap-2 min-h-[50px] p-2 rounded-sm ${snapshot.isDraggingOver ? 'bg-primary/10 border-primary border-dashed border-2' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {(col.widgets || []).map((w: any, idx: number) => renderWidget(w, idx, col.id))}
              {provided.placeholder}
              {(!col.widgets || col.widgets.length === 0) && !snapshot.isDraggingOver && (
                <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground bg-muted/30 border border-dashed rounded opacity-50 min-h-[80px]">
                  Arraste widgets aqui
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    )
  }

  const renderContainer = (section: any, idx: number) => {
    if (!section.enabled) return null
    if (section.type !== 'container') return null 

    const bgStyle: React.CSSProperties = {}
    if (section.settings?.background?.type === 'color') bgStyle.backgroundColor = section.settings.background.value
    else if (section.settings?.background?.type === 'image') {
      bgStyle.backgroundImage = `url(${section.settings.background.value})`
      bgStyle.backgroundSize = 'cover'
      bgStyle.backgroundPosition = 'center'
    }

    const paddingTop = section.settings?.padding?.top || '2rem'
    const paddingBottom = section.settings?.padding?.bottom || '2rem'
    const isFullWidth = section.settings?.fullWidth === true
    const isSelected = selectedElement?.id === section.id

    return (
      <Draggable key={section.id} draggableId={`section-${section.id}`} index={idx}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`w-full relative group/sec mb-4 transition-all cursor-pointer ring-2 ${isSelected ? 'ring-primary shadow-lg z-10' : 'ring-transparent hover:ring-primary/50'}`}
            onClick={(e) => { e.stopPropagation(); onSelectElement('container', section.id) }}
          >
            {/* Drag Handle & Label */}
            <div 
              {...provided.dragHandleProps}
              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-t-lg opacity-0 group-hover/sec:opacity-100 flex items-center gap-2 hover:bg-primary/90 transition-opacity z-20"
            >
              <Layout className="w-3 h-3" /> Sessão
            </div>

            <section style={{ ...bgStyle, paddingTop, paddingBottom }} className="w-full relative border border-dashed border-border/50">
              <div className={isFullWidth ? "w-full lg:px-4" : "container-bucaly"}>
                <div className="flex flex-wrap md:flex-nowrap gap-4 w-full">
                  {(section.columns || []).map((col: any, colIdx: number) => renderColumn(col, colIdx, section.id))}
                </div>
              </div>
            </section>
          </div>
        )}
      </Draggable>
    )
  }

  return (
    <>
      {sections.map((section, idx) => renderContainer(section, idx))}
    </>
  )
}
