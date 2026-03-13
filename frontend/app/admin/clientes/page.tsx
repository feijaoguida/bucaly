'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  ShieldCheck,
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
  DropdownMenuSeparator,
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
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminClientesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: '',
    role: 'cliente' as 'cliente' | 'admin',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch {
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.nome.trim() || !formData.email.trim()) {
      toast.error('Nome e e-mail são obrigatórios')
      return
    }
    try {
      const newUser = await api.createUser({
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        senha: formData.senha,
        role: formData.role,
      })
      setUsers(prev => [...prev, newUser])
      setIsCreateModalOpen(false)
      resetForm()
      toast.success('Cliente criado com sucesso!')
    } catch {
      toast.error('Erro ao criar cliente')
    }
  }

  const handleEdit = async () => {
    if (!selectedUser) return
    try {
      const updated = await api.updateUser(selectedUser.id, {
        nome: formData.nome,
        sobrenome: formData.sobrenome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        role: formData.role,
      })
      setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)))
      setIsEditModalOpen(false)
      resetForm()
      toast.success('Cliente atualizado com sucesso!')
    } catch {
      toast.error('Erro ao atualizar cliente')
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      await api.deleteUser(selectedUser.id)
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      toast.success('Cliente excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir cliente')
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      nome: user.nome,
      sobrenome: user.sobrenome,
      email: user.email,
      telefone: user.telefone || '',
      cpf: user.cpf || '',
      senha: '',
      role: user.role,
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (user: User) => {
    setSelectedUser(user)
    setIsViewModalOpen(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      sobrenome: '',
      email: '',
      telefone: '',
      cpf: '',
      senha: '',
      role: 'cliente',
    })
    setSelectedUser(null)
    setShowPassword(false)
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.cpf || '').includes(searchTerm)
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const clientes = users.filter(u => u.role === 'cliente')
  const admins = users.filter(u => u.role === 'admin')

  const UserForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="u-nome">Nome</Label>
          <Input
            id="u-nome"
            value={formData.nome}
            onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            placeholder="João"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="u-sobrenome">Sobrenome</Label>
          <Input
            id="u-sobrenome"
            value={formData.sobrenome}
            onChange={e => setFormData(prev => ({ ...prev, sobrenome: e.target.value }))}
            placeholder="Silva"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="u-email">E-mail</Label>
        <Input
          id="u-email"
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="joao@exemplo.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="u-cpf">CPF</Label>
          <Input
            id="u-cpf"
            value={formData.cpf}
            onChange={e => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
            placeholder="000.000.000-00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="u-telefone">Telefone</Label>
          <Input
            id="u-telefone"
            value={formData.telefone}
            onChange={e => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="u-role">Perfil</Label>
          <Select
            value={formData.role}
            onValueChange={value =>
              setFormData(prev => ({ ...prev, role: value as 'cliente' | 'admin' }))
            }
          >
            <SelectTrigger id="u-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="u-senha">Senha</Label>
          <div className="relative">
            <Input
              id="u-senha"
              type={showPassword ? 'text' : 'password'}
              value={formData.senha}
              onChange={e => setFormData(prev => ({ ...prev, senha: e.target.value }))}
              placeholder="Mínimo 8 caracteres"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes e usuários cadastrados.
          </p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateModalOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold">{clientes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p className="text-2xl font-bold">{admins.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, e-mail ou CPF..."
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Perfis</SelectItem>
                <SelectItem value="cliente">Clientes</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <div className="animate-pulse h-12 bg-muted rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {user.nome.charAt(0)}{user.sobrenome.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.nome} {user.sobrenome}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.cpf || '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.telefone || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className={
                          user.role === 'admin'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                            : ''
                        }
                      >
                        {user.role === 'admin' ? 'Admin' : 'Cliente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openViewModal(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(user)}
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
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Preencha os dados do novo cliente.</DialogDescription>
          </DialogHeader>
          <UserForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Atualize os dados do cliente.</DialogDescription>
          </DialogHeader>
          <UserForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {selectedUser.nome.charAt(0)}{selectedUser.sobrenome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedUser.nome} {selectedUser.sobrenome}
                  </h3>
                  <Badge
                    variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}
                    className={
                      selectedUser.role === 'admin'
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                        : ''
                    }
                  >
                    {selectedUser.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </Badge>
                </div>
              </div>

              <div className="divide-y rounded-lg border overflow-hidden">
                {[
                  { label: 'E-mail', value: selectedUser.email },
                  { label: 'CPF', value: selectedUser.cpf || '—' },
                  { label: 'Telefone', value: selectedUser.telefone || '—' },
                  {
                    label: 'Cadastrado em',
                    value: new Date(selectedUser.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    }),
                  },
                ].map(item => (
                  <div key={item.label} className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
            {selectedUser && (
              <Button onClick={() => { setIsViewModalOpen(false); openEditModal(selectedUser) }}>
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente{' '}
              <strong>
                "{selectedUser?.nome} {selectedUser?.sobrenome}"
              </strong>
              ? Esta ação não pode ser desfeita.
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
