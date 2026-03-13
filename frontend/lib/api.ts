import axios from 'axios';
import {
  User,
  UserCreate,
  UserLogin,
  Category,
  CategoryCreate,
  Product,
  ProductCreate,
  Cart,
  Order,
  ContactMessage,
  ProductFilters,
  PaginatedResponse,
  DashboardStats,
} from './types';

// O backend local roda na porta 3001
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

class ApiService {
  private getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  }

  // ========================
  // AUTENTICAÇÃO
  // ========================

  async login(credentials: UserLogin): Promise<{ user: User; token: string }> {
    const res = await apiClient.post('/auth/login', credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', res.data.data.access_token);
      const sessionId = localStorage.getItem('cart_session_id');
      if (sessionId) {
        await this.mergeCart(sessionId).catch(() => {});
      }
    }
    return {
      user: res.data.data.user,
      token: res.data.data.access_token,
    };
  }

  async register(data: UserCreate): Promise<{ user: User; token: string }> {
    await apiClient.post('/auth/register', data);
    return this.login({ email: data.email, senha: data.senha });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (typeof window === 'undefined') return null;
      if (!localStorage.getItem('access_token')) return null;
      const res = await apiClient.get('/auth/me');
      return res.data.data;
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      return null;
    }
  }

  // ========================
  // CATEGORIAS
  // ========================

  async getCategories(): Promise<Category[]> {
    const res = await apiClient.get('/categories');
    return res.data.data;
  }

  async getAllCategories(): Promise<Category[]> {
    const res = await apiClient.get('/categories/all');
    return res.data.data;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const res = await apiClient.get(`/categories/${id}`);
    return res.data.data;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const res = await apiClient.get(`/categories/slug/${slug}`);
    return res.data.data;
  }

  async createCategory(data: CategoryCreate): Promise<Category> {
    const res = await apiClient.post('/categories', data);
    return res.data.data;
  }

  async updateCategory(id: string, data: Partial<CategoryCreate>): Promise<Category> {
    const res = await apiClient.patch(`/categories/${id}`, data);
    return res.data.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }

  // ========================
  // PRODUTOS
  // ========================

  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params: Record<string, any> = { ...filters };
    if (params.precoMin) params.precoMin = Number(params.precoMin);
    if (params.precoMax) params.precoMax = Number(params.precoMax);

    const res = await apiClient.get('/products', { params });
    return {
      data: res.data.data,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: res.data.meta.totalPages
    };
  }

  async getAllProducts(): Promise<Product[]> {
    const res = await apiClient.get('/products/all');
    return res.data.data;
  }

  async getProductById(id: string): Promise<Product | null> {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const res = await apiClient.get('/products/featured');
    return res.data.data;
  }

  async getNewProducts(): Promise<Product[]> {
    const res = await apiClient.get('/products/new');
    return res.data.data;
  }

  async createProduct(data: ProductCreate): Promise<Product> {
    const res = await apiClient.post('/products', data);
    return res.data.data;
  }

  async updateProduct(id: string, data: Partial<ProductCreate>): Promise<Product> {
    const res = await apiClient.patch(`/products/${id}`, data);
    return res.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }

  // ========================
  // CARRINHO
  // ========================

  async getCart(): Promise<Cart> {
    const res = await apiClient.get('/cart', { params: { sessionId: this.getSessionId() } });
    return this.calculateCartTotals(res.data.data);
  }

  async addToCart(productId: string, quantidade: number = 1, variante?: string): Promise<Cart> {
    const res = await apiClient.post('/cart/items', {
      produtoId: productId,
      quantidade,
      variante,
      sessionId: this.getSessionId()
    });
    return this.calculateCartTotals(res.data.data);
  }

  async updateCartItem(itemId: string, quantidade: number): Promise<Cart> {
    if (quantidade <= 0) return this.removeFromCart(itemId);
    const res = await apiClient.patch(`/cart/items/${itemId}`, {
      quantidade,
      sessionId: this.getSessionId()
    });
    return this.calculateCartTotals(res.data.data);
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const res = await apiClient.delete(`/cart/items/${itemId}`, { params: { sessionId: this.getSessionId() } });
    return this.calculateCartTotals(res.data.data);
  }

  async clearCart(): Promise<Cart> {
    const res = await apiClient.delete('/cart/clear', { params: { sessionId: this.getSessionId() } });
    return this.calculateCartTotals(res.data.data);
  }

  async mergeCart(sessionId: string): Promise<void> {
    await apiClient.post('/cart/merge', { sessionId });
  }

  calculateCartTotals(cart: any): Cart {
    if (!cart || !cart.items) return { id: '', items: [], subtotal: 0, frete: 0, desconto: 0, total: 0 };
    const subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + Number(item.produto?.preco || 0) * item.quantidade,
      0
    );
    const frete = subtotal >= 200 ? 0 : subtotal > 0 ? 15 : 0;
    const total = subtotal + frete - (cart.desconto || 0);

    return {
      ...cart,
      subtotal,
      frete,
      total,
      desconto: cart.desconto || 0
    };
  }

  // ========================
  // CLIENTES (ADMIN)
  // ========================

  async getUsers(): Promise<User[]> {
    const res = await apiClient.get('/users');
    return res.data.data;
  }

  async getUserById(id: string): Promise<User | null> {
    const res = await apiClient.get(`/users/${id}`).catch(() => null);
    return res?.data?.data || null;
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { senha?: string }): Promise<User> {
    const res = await apiClient.post('/auth/register', data);
    return res.data.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return data as User;
  }

  async deleteUser(id: string): Promise<void> {
    // console.log("Usuario nao deletavel nesta versao");
  }

  // ========================
  // CONTATO
  // ========================

  async sendContactMessage(data: Omit<ContactMessage, 'id' | 'lido' | 'createdAt'>): Promise<ContactMessage> {
    const res = await apiClient.post('/contact', data);
    return res.data.data;
  }

  // ========================
  // DASHBOARD
  // ========================

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get('/dashboard/stats');
    const { totalUsers, totalProducts, totalOrders, totalRevenue } = res.data.data;
    return {
      totalProdutos: totalProducts,
      totalClientes: totalUsers,
      totalPedidos: totalOrders,
      receitaTotal: Number(totalRevenue),
      pedidosPendentes: 0,
      produtosBaixoEstoque: 0,
    };
  }
}

export const api = new ApiService();
export { apiClient };
