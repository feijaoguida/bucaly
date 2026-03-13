import { getPageData } from '@/lib/cms'
import { DynamicRenderer } from '@/components/dynamic-renderer'
import { api } from '@/lib/api' // Para carregar categorias caso o header as utilize

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerData = await getPageData('global-header')
  const footerData = await getPageData('global-footer')
  const categories = await api.getCategories() // Utilidade pras categorias na navbar

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
         {headerData ? (
           <DynamicRenderer sections={headerData.sections} categories={categories} />
         ) : null}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="w-full border-t bg-muted/20">
         {footerData ? (
           <DynamicRenderer sections={footerData.sections} />
         ) : null}
      </footer>
    </>
  )
}
