'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import type { Product, Category } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    precoOriginal: '',
    categoriaId: '',
    marca: '',
    sku: '',
    estoque: '',
    destaque: false,
    novo: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getAllProducts(),
        api.getCategories(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const newProduct = await api.createProduct({
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        precoOriginal: formData.precoOriginal ? parseFloat(formData.precoOriginal) : undefined,
        categoriaId: formData.categoriaId,
        marca: formData.marca,
        sku: formData.sku,
        estoque: parseInt(formData.estoque),
        imagens: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'],
        destaque: formData.destaque,
        novo: formData.novo,
      })
      setProducts([...products, newProduct])
      setIsCreateModalOpen(false)
      resetForm()
      toast.success('Produto criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar produto')
    }
  }

  const handleEdit = async () => {
    if (!selectedProduct) return
    
    try {
      const updatedProduct = await api.updateProduct(selectedProduct.id, {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        precoOriginal: formData.precoOriginal ? parseFloat(formData.precoOriginal) : undefined,
        categoriaId: formData.categoriaId,
        marca: formData.marca,
        sku: formData.sku,
        estoque: parseInt(formData.estoque),
        destaque: formData.destaque,
        novo: formData.novo,
      })
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
      setIsEditModalOpen(false)
      resetForm()
      toast.success('Produto atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar produto')
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return
    
    try {
      await api.deleteProduct(selectedProduct.id)
      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setIsDeleteModalOpen(false)
      setSelectedProduct(null)
      toast.success('Produto excluído com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir produto')
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco.toString(),
      precoOriginal: product.precoOriginal?.toString() || '',
      categoriaId: product.categoriaId,
      marca: product.marca,
      sku: product.sku,
      estoque: product.estoque.toString(),
      destaque: product.destaque,
      novo: product.novo,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      precoOriginal: '',
      categoriaId: '',
      marca: '',
      sku: '',
      estoque: '',
      destaque: false,
      novo: false,
    })
    setSelectedProduct(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.categoriaId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const ProductForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Produto</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Ex: Escova Dental Pro"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Input
            id="marca"
            value={formData.marca}
            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
            placeholder="Ex: Bucaly"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Descrição do produto"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preco">Preço (R$)</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="precoOriginal">Preço Original (Opcional)</Label>
          <Input
            id="precoOriginal"
            type="number"
            step="0.01"
            value={formData.precoOriginal}
            onChange={(e) => setFormData({ ...formData, precoOriginal: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estoque">Estoque</Label>
          <Input
            id="estoque"
            type="number"
            value={formData.estoque}
            onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoriaId">Categoria</Label>
          <Select
            value={formData.categoriaId}
            onValueChange={(value) => setFormData({ ...formData, categoriaId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Ex: ESC-PRO-001"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="destaque"
            checked={formData.destaque}
            onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked as boolean })}
          />
          <Label htmlFor="destaque" className="cursor-pointer">Produto em Destaque</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="novo"
            checked={formData.novo}
            onCheckedChange={(checked) => setFormData({ ...formData, novo: checked as boolean })}
          />
          <Label htmlFor="novo" className="cursor-pointer">Produto Novo</Label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos da sua loja.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou SKU..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <div className="animate-pulse h-12 bg-muted rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                          {product.imagens[0] && (
                            <Image
                              src={product.imagens[0]}
                              alt={product.nome}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{product.nome}</p>
                          <p className="text-xs text-muted-foreground">{product.marca}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === product.categoriaId)?.nome || '-'}
                    </TableCell>
                    <TableCell>{formatPrice(product.preco)}</TableCell>
                    <TableCell>
                      <span className={product.estoque < 10 ? 'text-destructive font-medium' : ''}>
                        {product.estoque}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.novo && (
                          <Badge variant="secondary" className="text-xs">Novo</Badge>
                        )}
                        {product.destaque && (
                          <Badge className="text-xs">Destaque</Badge>
                        )}
                        {!product.novo && !product.destaque && (
                          <Badge variant="outline" className="text-xs">Normal</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/produtos/${product.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver na Loja
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(product)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo produto.
            </DialogDescription>
          </DialogHeader>
          <ProductForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Atualize as informações do produto.
            </DialogDescription>
          </DialogHeader>
          <ProductForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{selectedProduct?.nome}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
