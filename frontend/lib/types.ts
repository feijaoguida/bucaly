// ============================================
// BUCALY - TIPOS E INTERFACES
// ============================================

// Usuário / Cliente
export interface User {
  id: string
  nome: string
  sobrenome: string
  email: string
  cpf?: string
  telefone?: string
  role: 'admin' | 'cliente'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface UserCreate {
  nome: string
  sobrenome: string
  email: string
  cpf: string
  telefone: string
  senha: string
}

export interface UserLogin {
  email: string
  senha: string
}

// Categoria
export interface Category {
  id: string
  nome: string
  descricao: string
  slug: string
  icone?: string
  imagem?: string
  produtosCount: number
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryCreate {
  nome: string
  descricao: string
  slug?: string
  icone?: string
  imagem?: string
  ativo?: boolean
}

// Produto
export interface Product {
  id: string
  nome: string
  descricao: string
  preco: number
  precoOriginal?: number
  categoriaId: string
  categoria?: Category
  marca: string
  imagens: string[]
  estoque: number
  sku: string
  tags: string[]
  destaque: boolean
  novo: boolean
  ativo: boolean
  avaliacoes: number
  mediaAvaliacoes: number
  createdAt: string
  updatedAt: string
}

export interface ProductCreate {
  nome: string
  descricao: string
  preco: number
  precoOriginal?: number
  categoriaId: string
  marca: string
  imagens: string[]
  estoque: number
  sku: string
  tags?: string[]
  destaque?: boolean
  novo?: boolean
}

// Carrinho
export interface CartItem {
  id: string
  produtoId: string
  produto: Product
  quantidade: number
  variante?: string
}

export interface Cart {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  frete: number
  desconto: number
  total: number
}

// Endereço
export interface Address {
  id: string
  userId: string
  nome: string
  sobrenome: string
  endereco: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  principal: boolean
}

// Pedido
export interface Order {
  id: string
  userId: string
  items: CartItem[]
  endereco: Address
  metodoPagamento: 'cartao' | 'pix' | 'boleto' | 'paypal'
  metodoEnvio: 'padrao' | 'expresso'
  subtotal: number
  frete: number
  impostos: number
  desconto: number
  total: number
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado'
  createdAt: string
  updatedAt: string
}

// Contato
export interface ContactMessage {
  id: string
  nome: string
  sobrenome: string
  email: string
  assunto: string
  mensagem: string
  lido: boolean
  createdAt: string
}

// Filtros
export interface ProductFilters {
  categoria?: string
  precoMin?: number
  precoMax?: number
  disponivel?: boolean
  emPromocao?: boolean
  novidades?: boolean
  ordenar?: 'relevancia' | 'preco-asc' | 'preco-desc' | 'nome' | 'mais-vendidos'
  busca?: string
  page?: number
  limit?: number
}

// Resposta paginada
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Dashboard Admin
export interface DashboardStats {
  totalProdutos: number
  totalClientes: number
  totalPedidos: number
  receitaTotal: number
  pedidosPendentes: number
  produtosBaixoEstoque: number
}
