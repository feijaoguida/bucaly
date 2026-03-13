// ============================================
// BUCALY - MOCK API SERVICE
// Simula chamadas a uma API NestJS
// ============================================

import {
  User,
  UserCreate,
  UserLogin,
  Category,
  CategoryCreate,
  Product,
  ProductCreate,
  CartItem,
  Cart,
  Order,
  ContactMessage,
  ProductFilters,
  PaginatedResponse,
  DashboardStats,
  Address,
} from './types'

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const API_DELAY = 300

// ============================================
// DADOS MOCK
// ============================================

// Categorias
const mockCategories: Category[] = [
  {
    id: '1',
    nome: 'Ortodontia',
    descricao: 'Produtos para tratamentos ortodônticos',
    slug: 'ortodontia',
    icone: 'braces',
    imagem: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400',
    produtosCount: 24,
    ativo: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    nome: 'Higiene Oral',
    descricao: 'Produtos para higiene bucal diária',
    slug: 'higiene-oral',
    icone: 'tooth',
    imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    produtosCount: 36,
    ativo: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    nome: 'Restauradora',
    descricao: 'Materiais restauradores',
    slug: 'restauradora',
    icone: 'filling',
    imagem: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400',
    produtosCount: 18,
    ativo: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    nome: 'Instrumentos',
    descricao: 'Instrumentos odontológicos profissionais',
    slug: 'instrumentos',
    icone: 'tools',
    imagem: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400',
    produtosCount: 42,
    ativo: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    nome: 'Laboratório',
    descricao: 'Equipamentos e materiais de laboratório',
    slug: 'laboratorio',
    icone: 'lab',
    imagem: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
    produtosCount: 15,
    ativo: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '6',
    nome: 'Alinhadores',
    descricao: 'Alinhadores transparentes',
    slug: 'alinhadores',
    icone: 'aligners',
    imagem: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=400',
    produtosCount: 8,
    ativo: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Produtos
const mockProducts: Product[] = [
  {
    id: '1',
    nome: 'Sistema de Bráquetes Cerâmicos',
    descricao: 'Bráquetes cerâmicos estéticos de alta durabilidade para tratamento ortodôntico discreto.',
    preco: 249.00,
    categoriaId: '1',
    marca: 'BUCALY PRO',
    imagens: ['https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500'],
    estoque: 50,
    sku: 'BRA-CER-001',
    tags: ['ortodontia', 'estético', 'cerâmica'],
    destaque: true,
    novo: true,
    ativo: true,
    avaliacoes: 45,
    mediaAvaliacoes: 4.8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    nome: 'Placas Alinhadoras Digitais',
    descricao: 'Alinhadores transparentes moldados sob medida para ajustes ortodônticos precisos.',
    preco: 159.00,
    precoOriginal: 189.00,
    categoriaId: '6',
    marca: 'PRECISIONFIT',
    imagens: ['https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=500'],
    estoque: 30,
    sku: 'ALI-DIG-001',
    tags: ['alinhadores', 'transparente', 'digital'],
    destaque: true,
    novo: false,
    ativo: true,
    avaliacoes: 67,
    mediaAvaliacoes: 4.9,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    nome: 'Conjunto de Alicates Ortodônticos',
    descricao: 'Conjunto essencial de 5 ferramentas para dobra e ajuste de fios ortodônticos.',
    preco: 320.00,
    categoriaId: '4',
    marca: 'MASTERTOOLS',
    imagens: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500'],
    estoque: 25,
    sku: 'ALI-ORT-001',
    tags: ['instrumentos', 'ortodontia', 'alicates'],
    destaque: false,
    novo: false,
    ativo: true,
    avaliacoes: 32,
    mediaAvaliacoes: 4.7,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    nome: 'Corrente Elástica Power Chain',
    descricao: 'Rolo de elásticos em cadeia sem látex de grau médico em várias cores.',
    preco: 45.00,
    categoriaId: '1',
    marca: 'SMILECOLORS',
    imagens: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'],
    estoque: 100,
    sku: 'ELA-POW-001',
    tags: ['ortodontia', 'elásticos', 'colorido'],
    destaque: false,
    novo: false,
    ativo: true,
    avaliacoes: 89,
    mediaAvaliacoes: 4.6,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '5',
    nome: 'Pacote de Arco Niti',
    descricao: 'Arcos pré-formados de níquel titânio termoativos com formato natural.',
    preco: 89.00,
    categoriaId: '1',
    marca: 'FLEXIWIRE',
    imagens: ['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500'],
    estoque: 75,
    sku: 'ARC-NIT-001',
    tags: ['ortodontia', 'arcos', 'niti'],
    destaque: false,
    novo: false,
    ativo: true,
    avaliacoes: 56,
    mediaAvaliacoes: 4.5,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '6',
    nome: 'Kit de Colagem Ortodôntica',
    descricao: 'Sistema adesivo para bráquetes fotopolimerizável com frascos de primer e adesivo.',
    preco: 175.00,
    categoriaId: '1',
    marca: 'BONDMASTER',
    imagens: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500'],
    estoque: 40,
    sku: 'COL-ORT-001',
    tags: ['ortodontia', 'colagem', 'adesivo'],
    destaque: true,
    novo: true,
    ativo: true,
    avaliacoes: 28,
    mediaAvaliacoes: 4.8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '7',
    nome: 'Escova de Dentes Sonic Pro',
    descricao: 'Escova elétrica com tecnologia sônica para limpeza profunda e avançada.',
    preco: 129.00,
    categoriaId: '2',
    marca: 'BUCALY',
    imagens: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'],
    estoque: 60,
    sku: 'ESC-SON-001',
    tags: ['higiene', 'escova', 'sônica'],
    destaque: true,
    novo: false,
    ativo: true,
    avaliacoes: 112,
    mediaAvaliacoes: 4.9,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '8',
    nome: 'Kit de Cuidado de Alinhadores',
    descricao: 'Kit completo para manutenção diária de alinhadores transparentes.',
    preco: 45.00,
    categoriaId: '6',
    marca: 'BUCALY',
    imagens: ['https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=500'],
    estoque: 85,
    sku: 'KIT-ALI-001',
    tags: ['alinhadores', 'cuidado', 'manutenção'],
    destaque: true,
    novo: false,
    ativo: true,
    avaliacoes: 78,
    mediaAvaliacoes: 4.7,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '9',
    nome: 'Conjunto de Gel LumiWhite',
    descricao: 'Gel clareador de força clínica para resultados profissionais.',
    preco: 89.00,
    categoriaId: '2',
    marca: 'BUCALY',
    imagens: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'],
    estoque: 45,
    sku: 'GEL-CLA-001',
    tags: ['clareamento', 'gel', 'profissional'],
    destaque: true,
    novo: true,
    ativo: true,
    avaliacoes: 94,
    mediaAvaliacoes: 4.8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Usuários/Clientes
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'João',
    sobrenome: 'Silva',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    role: 'cliente',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    nome: 'Maria',
    sobrenome: 'Santos',
    email: 'maria@email.com',
    cpf: '987.654.321-00',
    telefone: '(11) 98888-8888',
    role: 'cliente',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20',
  },
  {
    id: '3',
    nome: 'Admin',
    sobrenome: 'Bucaly',
    email: 'admin@bucaly.com',
    cpf: '000.000.000-00',
    telefone: '(11) 97777-7777',
    role: 'admin',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Carrinho mock
let mockCart: Cart = {
  id: '1',
  items: [],
  subtotal: 0,
  frete: 0,
  desconto: 0,
  total: 0,
}

// ============================================
// API SERVICE CLASS
// ============================================

class MockApiService {
  // ========================
  // AUTENTICAÇÃO
  // ========================
  
  async login(credentials: UserLogin): Promise<{ user: User; token: string }> {
    await delay(API_DELAY)
    const user = mockUsers.find(u => u.email === credentials.email)
    if (!user) {
      throw new Error('Credenciais inválidas')
    }
    return {
      user,
      token: 'mock-jwt-token-' + user.id,
    }
  }

  async register(data: UserCreate): Promise<{ user: User; token: string }> {
    await delay(API_DELAY)
    const newUser: User = {
      id: String(mockUsers.length + 1),
      nome: data.nome,
      sobrenome: data.sobrenome,
      email: data.email,
      cpf: data.cpf,
      telefone: data.telefone,
      role: 'cliente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    return {
      user: newUser,
      token: 'mock-jwt-token-' + newUser.id,
    }
  }

  async getCurrentUser(): Promise<User | null> {
    await delay(API_DELAY)
    return mockUsers[0] // Simula usuário logado
  }

  // ========================
  // CATEGORIAS
  // ========================
  
  async getCategories(): Promise<Category[]> {
    await delay(API_DELAY)
    return mockCategories.filter(c => c.ativo)
  }

  async getAllCategories(): Promise<Category[]> {
    await delay(API_DELAY)
    return [...mockCategories]
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await delay(API_DELAY)
    return mockCategories.find(c => c.id === id) || null
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await delay(API_DELAY)
    return mockCategories.find(c => c.slug === slug) || null
  }

  async createCategory(data: CategoryCreate): Promise<Category> {
    await delay(API_DELAY)
    const newCategory: Category = {
      id: String(mockCategories.length + 1),
      nome: data.nome,
      descricao: data.descricao,
      slug: data.slug || data.nome.toLowerCase().replace(/\s+/g, '-'),
      icone: data.icone,
      imagem: data.imagem,
      produtosCount: 0,
      ativo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockCategories.push(newCategory)
    return newCategory
  }

  async updateCategory(id: string, data: Partial<CategoryCreate>): Promise<Category> {
    await delay(API_DELAY)
    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Categoria não encontrada')
    
    mockCategories[index] = {
      ...mockCategories[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockCategories[index]
  }

  async deleteCategory(id: string): Promise<void> {
    await delay(API_DELAY)
    const index = mockCategories.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Categoria não encontrada')
    mockCategories.splice(index, 1)
  }

  // ========================
  // PRODUTOS
  // ========================
  
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    await delay(API_DELAY)
    let products = [...mockProducts].filter(p => p.ativo)

    // Aplicar filtros
    if (filters?.categoria) {
      products = products.filter(p => p.categoriaId === filters.categoria)
    }
    if (filters?.precoMin) {
      products = products.filter(p => p.preco >= filters.precoMin!)
    }
    if (filters?.precoMax) {
      products = products.filter(p => p.preco <= filters.precoMax!)
    }
    if (filters?.disponivel) {
      products = products.filter(p => p.estoque > 0)
    }
    if (filters?.emPromocao) {
      products = products.filter(p => p.precoOriginal && p.precoOriginal > p.preco)
    }
    if (filters?.novidades) {
      products = products.filter(p => p.novo)
    }
    if (filters?.busca) {
      const search = filters.busca.toLowerCase()
      products = products.filter(
        p => p.nome.toLowerCase().includes(search) || 
             p.descricao.toLowerCase().includes(search)
      )
    }

    // Ordenação
    if (filters?.ordenar) {
      switch (filters.ordenar) {
        case 'preco-asc':
          products.sort((a, b) => a.preco - b.preco)
          break
        case 'preco-desc':
          products.sort((a, b) => b.preco - a.preco)
          break
        case 'nome':
          products.sort((a, b) => a.nome.localeCompare(b.nome))
          break
        case 'mais-vendidos':
          products.sort((a, b) => b.avaliacoes - a.avaliacoes)
          break
      }
    }

    // Paginação
    const page = filters?.page || 1
    const limit = filters?.limit || 12
    const start = (page - 1) * limit
    const paginatedProducts = products.slice(start, start + limit)

    // Adicionar categoria aos produtos
    const productsWithCategory = paginatedProducts.map(p => ({
      ...p,
      categoria: mockCategories.find(c => c.id === p.categoriaId),
    }))

    return {
      data: productsWithCategory,
      total: products.length,
      page,
      limit,
      totalPages: Math.ceil(products.length / limit),
    }
  }

  async getAllProducts(): Promise<Product[]> {
    await delay(API_DELAY)
    return [...mockProducts]
  }

  async getProductById(id: string): Promise<Product | null> {
    await delay(API_DELAY)
    const product = mockProducts.find(p => p.id === id)
    if (!product) return null
    return {
      ...product,
      categoria: mockCategories.find(c => c.id === product.categoriaId),
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await delay(API_DELAY)
    return mockProducts
      .filter(p => p.destaque && p.ativo)
      .map(p => ({
        ...p,
        categoria: mockCategories.find(c => c.id === p.categoriaId),
      }))
  }

  async getNewProducts(): Promise<Product[]> {
    await delay(API_DELAY)
    return mockProducts
      .filter(p => p.novo && p.ativo)
      .map(p => ({
        ...p,
        categoria: mockCategories.find(c => c.id === p.categoriaId),
      }))
  }

  async createProduct(data: ProductCreate): Promise<Product> {
    await delay(API_DELAY)
    const newProduct: Product = {
      id: String(mockProducts.length + 1),
      ...data,
      tags: data.tags || [],
      destaque: data.destaque || false,
      novo: data.novo || false,
      ativo: true,
      avaliacoes: 0,
      mediaAvaliacoes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return newProduct
  }

  async updateProduct(id: string, data: Partial<ProductCreate>): Promise<Product> {
    await delay(API_DELAY)
    const index = mockProducts.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Produto não encontrado')
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockProducts[index]
  }

  async deleteProduct(id: string): Promise<void> {
    await delay(API_DELAY)
    const index = mockProducts.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Produto não encontrado')
    mockProducts.splice(index, 1)
  }

  // ========================
  // CARRINHO
  // ========================
  
  async getCart(): Promise<Cart> {
    await delay(API_DELAY)
    return this.calculateCartTotals(mockCart)
  }

  async addToCart(productId: string, quantidade: number = 1, variante?: string): Promise<Cart> {
    await delay(API_DELAY)
    const product = mockProducts.find(p => p.id === productId)
    if (!product) throw new Error('Produto não encontrado')

    const existingItem = mockCart.items.find(
      item => item.produtoId === productId && item.variante === variante
    )

    if (existingItem) {
      existingItem.quantidade += quantidade
    } else {
      mockCart.items.push({
        id: String(mockCart.items.length + 1),
        produtoId: productId,
        produto: product,
        quantidade,
        variante,
      })
    }

    return this.calculateCartTotals(mockCart)
  }

  async updateCartItem(itemId: string, quantidade: number): Promise<Cart> {
    await delay(API_DELAY)
    const item = mockCart.items.find(i => i.id === itemId)
    if (!item) throw new Error('Item não encontrado')

    if (quantidade <= 0) {
      mockCart.items = mockCart.items.filter(i => i.id !== itemId)
    } else {
      item.quantidade = quantidade
    }

    return this.calculateCartTotals(mockCart)
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    await delay(API_DELAY)
    mockCart.items = mockCart.items.filter(i => i.id !== itemId)
    return this.calculateCartTotals(mockCart)
  }

  async clearCart(): Promise<Cart> {
    await delay(API_DELAY)
    mockCart.items = []
    return this.calculateCartTotals(mockCart)
  }

  private calculateCartTotals(cart: Cart): Cart {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.produto.preco * item.quantidade,
      0
    )
    const frete = subtotal >= 200 ? 0 : subtotal > 0 ? 15 : 0
    const total = subtotal + frete - cart.desconto

    return {
      ...cart,
      subtotal,
      frete,
      total,
    }
  }

  // ========================
  // CLIENTES (ADMIN)
  // ========================
  
  async getUsers(): Promise<User[]> {
    await delay(API_DELAY)
    return [...mockUsers]
  }

  async getUserById(id: string): Promise<User | null> {
    await delay(API_DELAY)
    return mockUsers.find(u => u.id === id) || null
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { senha?: string }): Promise<User> {
    await delay(API_DELAY)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senha, ...userData } = data
    const newUser: User = {
      id: String(Date.now()),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    return newUser
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await delay(API_DELAY)
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) throw new Error('Usuário não encontrado')
    
    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return mockUsers[index]
  }

  async deleteUser(id: string): Promise<void> {
    await delay(API_DELAY)
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) throw new Error('Usuário não encontrado')
    mockUsers.splice(index, 1)
  }

  // ========================
  // CONTATO
  // ========================
  
  async sendContactMessage(data: Omit<ContactMessage, 'id' | 'lido' | 'createdAt'>): Promise<ContactMessage> {
    await delay(API_DELAY)
    const message: ContactMessage = {
      id: String(Date.now()),
      ...data,
      lido: false,
      createdAt: new Date().toISOString(),
    }
    return message
  }

  // ========================
  // DASHBOARD
  // ========================
  
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(API_DELAY)
    return {
      totalProdutos: mockProducts.length,
      totalClientes: mockUsers.filter(u => u.role === 'cliente').length,
      totalPedidos: 156,
      receitaTotal: 45680.50,
      pedidosPendentes: 12,
      produtosBaixoEstoque: mockProducts.filter(p => p.estoque < 10).length,
    }
  }
}

// Exportar instância única
export const api = new MockApiService()
