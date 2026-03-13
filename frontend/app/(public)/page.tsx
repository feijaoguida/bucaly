import { api } from '@/lib/api'
import { getPageData } from '@/lib/cms'
import { DynamicRenderer } from '@/components/dynamic-renderer'

export default async function HomePage() {
  const categories = await api.getCategories()
  const featuredProducts = await api.getFeaturedProducts()
  
  // Requisição CMS para Home
  const pageData = await getPageData('home')
  const dynamicSections = pageData?.sections || []

  return (
    <div className="flex flex-col">
      <main className="flex-1 w-full overflow-x-hidden">
        <DynamicRenderer 
          sections={dynamicSections}
          categories={categories}
          featuredProducts={featuredProducts}
        />
      </main>
    </div>
  )
}
