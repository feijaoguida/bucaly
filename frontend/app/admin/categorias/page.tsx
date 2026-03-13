'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  FolderTree,
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import type { Category } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    slug: '',
    imagem: '',
    ativo: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch {
      toast.error('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (nome: string) =>
    nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

  const handleNomeChange = (nome: string) => {
    setFormData(prev => ({
      ...prev,
      nome,
      slug: generateSlug(nome),
    }))
  }

  const handleCreate = async () => {
    if (!formData.nome.trim()) {
      toast.error('O nome da categoria é obrigatório')
      return
    }
    try {
      const newCategory = await api.createCategory({
        nome: formData.nome,
        descricao: formData.descricao,
        slug: formData.slug || generateSlug(formData.nome),
        imagem:
          formData.imagem ||
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        ativo: formData.ativo,
      })
      setCategories(prev => [...prev, newCategory])
      setIsCreateModalOpen(false)
      resetForm()
      toast.success('Categoria criada com sucesso!')
    } catch {
      toast.error('Erro ao criar categoria')
    }
  }

  const handleEdit = async () => {
    if (!selectedCategory) return
    try {
      const updated = await api.updateCategory(selectedCategory.id, {
        nome: formData.nome,
        descricao: formData.descricao,
        slug: formData.slug,
        imagem: formData.imagem,
        ativo: formData.ativo,
      })
      setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)))
      setIsEditModalOpen(false)
      resetForm()
      toast.success('Categoria atualizada com sucesso!')
    } catch {
      toast.error('Erro ao atualizar categoria')
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return
    try {
      await api.deleteCategory(selectedCategory.id)
      setCategories(prev => prev.filter(c => c.id !== selectedCategory.id))
      setIsDeleteModalOpen(false)
      setSelectedCategory(null)
      toast.success('Categoria excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir categoria')
    }
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      nome: category.nome,
      descricao: category.descricao,
      slug: category.slug || '',
      imagem: category.imagem || '',
      ativo: category.ativo ?? true,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ nome: '', descricao: '', slug: '', imagem: '', ativo: true })
    setSelectedCategory(null)
  }

  const filteredCategories = categories.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const CategoryForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cat-nome">Nome da Categoria</Label>
          <Input
            id="cat-nome"
            value={formData.nome}
            onChange={e => handleNomeChange(e.target.value)}
            placeholder="Ex: Ortodontia"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-slug">Slug (URL)</Label>
          <Input
            id="cat-slug"
            value={formData.slug}
            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="Ex: ortodontia"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cat-descricao">Descrição</Label>
        <Textarea
          id="cat-descricao"
          value={formData.descricao}
          onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descrição da categoria"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cat-imagem">URL da Imagem</Label>
        <Input
          id="cat-imagem"
          value={formData.imagem}
          onChange={e => setFormData(prev => ({ ...prev, imagem: e.target.value }))}
          placeholder="https://..."
        />
        {formData.imagem && (
          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted mt-2">
            <Image
              src={formData.imagem}
              alt="Prévia da imagem"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="cat-ativo"
          checked={formData.ativo}
          onCheckedChange={checked => setFormData(prev => ({ ...prev, ativo: checked }))}
        />
        <Label htmlFor="cat-ativo" className="cursor-pointer">
          Categoria ativa
        </Label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de produtos da sua loja.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderTree className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <FolderTree className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">{categories.filter(c => c.ativo).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <FolderTree className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativas</p>
                <p className="text-2xl font-bold">{categories.filter(c => !c.ativo).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou slug..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <div className="animate-pulse h-12 bg-muted rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma categoria encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          {category.imagem && (
                            <Image
                              src={category.imagem}
                              alt={category.nome}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{category.nome}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {category.descricao}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>{category.produtosCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={category.ativo ? 'default' : 'secondary'}
                        className={category.ativo ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                      >
                        {category.ativo ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(category)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(category)}
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>Preencha as informações da nova categoria.</DialogDescription>
          </DialogHeader>
          <CategoryForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar Categoria</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>Atualize as informações da categoria.</DialogDescription>
          </DialogHeader>
          <CategoryForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria{' '}
              <strong>"{selectedCategory?.nome}"</strong>? Esta ação não pode ser
              desfeita.
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
