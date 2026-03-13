'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Filter, Grid, List, ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ProductCard } from '@/components/product-card'
import { api } from '@/lib/api'
import { getPageData } from '@/lib/cms'
import type { Product, Category } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '')
  const [priceRange, setPriceRange] = useState([10, 500])
  const [disponivel, setDisponivel] = useState(true)
  const [emPromocao, setEmPromocao] = useState(false)
  const [novidades, setNovidades] = useState(false)
  const [ordenar, setOrdenar] = useState('relevancia')
  
  // CMS state
  const [pageData, setPageData] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [selectedCategory, disponivel, emPromocao, novidades, ordenar])

  useEffect(() => {
    getPageData('produtos').then(setPageData)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [categoriesData, productsData] = await Promise.all([
        api.getCategories(),
        api.getProducts({
          categoria: selectedCategory || undefined,
          precoMin: priceRange[0],
          precoMax: priceRange[1],
          disponivel: disponivel || undefined,
          emPromocao: emPromocao || undefined,
          novidades: novidades || undefined,
          ordenar: ordenar as 'relevancia' | 'preco-asc' | 'preco-desc' | 'nome' | 'mais-vendidos',
        }),
      ])
      setCategories(categoriesData)
      setProducts(productsData.data)
      setTotalProducts(productsData.total)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setPriceRange([10, 500])
    setDisponivel(true)
    setEmPromocao(false)
    setNovidades(false)
    setOrdenar('relevancia')
  }

  const activeCategory = categories.find(c => c.id === selectedCategory || c.slug === selectedCategory)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          Categorias
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? '' : category.id
              )}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                selectedCategory === category.id || selectedCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              {category.nome}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Faixa de Preço</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={10}
          max={500}
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>R$ {priceRange[0]}</span>
          <span>R$ {priceRange[1]}</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Disponibilidade</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="disponivel"
              checked={disponivel}
              onCheckedChange={(checked) => setDisponivel(checked as boolean)}
            />
            <Label htmlFor="disponivel" className="text-sm cursor-pointer">
              Disponível Agora
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="promocao"
              checked={emPromocao}
              onCheckedChange={(checked) => setEmPromocao(checked as boolean)}
            />
            <Label htmlFor="promocao" className="text-sm cursor-pointer">
              Em Promoção
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="novidades"
              checked={novidades}
              onCheckedChange={(checked) => setNovidades(checked as boolean)}
            />
            <Label htmlFor="novidades" className="text-sm cursor-pointer">
              Novidades
            </Label>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Limpar Filtros
      </Button>
    </div>
  )

  return (
    <div className="container-bucaly py-6 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {activeCategory ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/produtos">Produtos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activeCategory.nome}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Produtos</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterContent />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">
                {activeCategory?.nome || pageData?.sections?.header?.title || pageData?.title || 'Todos os Produtos'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {pageData?.sections?.header?.content && !activeCategory 
                  ? pageData.sections.header.content 
                  : `Mostrando 1-${products.length} de ${totalProducts} produtos`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={ordenar} onValueChange={setOrdenar}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevancia">Mais Relevantes</SelectItem>
                  <SelectItem value="preco-asc">Menor Preço</SelectItem>
                  <SelectItem value="preco-desc">Maior Preço</SelectItem>
                  <SelectItem value="nome">Nome A-Z</SelectItem>
                  <SelectItem value="mais-vendidos">Mais Vendidos</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden sm:flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'rounded-r-none',
                    viewMode === 'grid' && 'bg-muted'
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'rounded-l-none',
                    viewMode === 'list' && 'bg-muted'
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            )}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Limpar filtros
              </Button>
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className="flex justify-center mt-10">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  {'<'}
                </Button>
                <Button variant="default" size="icon">1</Button>
                <Button variant="outline" size="icon">2</Button>
                <Button variant="outline" size="icon">3</Button>
                <span className="px-2">...</span>
                <Button variant="outline" size="icon">8</Button>
                <Button variant="outline" size="icon">
                  {'>'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
