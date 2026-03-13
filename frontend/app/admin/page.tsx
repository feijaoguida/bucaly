'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { DashboardStats, Product, User } from '@/lib/types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [recentCustomers, setRecentCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statsData, productsData] = await Promise.all([
        api.getDashboardStats(),
        api.getAllProducts(),
      ])
      setStats(statsData)
      setRecentProducts(productsData.slice(0, 5))
      const customersData = await api.getUsers()
      setRecentCustomers(customersData.filter((u: any) => u.role === 'cliente').slice(0, 5))
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total de Produtos',
      value: stats?.totalProdutos || 0,
      icon: Package,
      change: '+12%',
      changeType: 'positive' as const,
      href: '/admin/produtos',
    },
    {
      title: 'Total de Clientes',
      value: stats?.totalClientes || 0,
      icon: Users,
      change: '+8%',
      changeType: 'positive' as const,
      href: '/admin/clientes',
    },
    {
      title: 'Total de Pedidos',
      value: stats?.totalPedidos || 0,
      icon: ShoppingCart,
      change: '+23%',
      changeType: 'positive' as const,
      href: '/admin/pedidos',
    },
    {
      title: 'Receita Total',
      value: formatPrice(stats?.receitaTotal || 0),
      icon: DollarSign,
      change: '+18%',
      changeType: 'positive' as const,
      href: '/admin/pedidos',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo da Bucaly.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <span
                  className={`text-xs font-medium flex items-center gap-1 ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {stats && stats.produtosBaixoEstoque > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Alerta de Estoque Baixo</p>
              <p className="text-sm text-muted-foreground">
                {stats.produtosBaixoEstoque} produtos estão com estoque baixo.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/produtos?estoqueBaixo=true">
                Ver Produtos
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Produtos Recentes</CardTitle>
              <CardDescription>Últimos produtos adicionados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/produtos">
                Ver Todos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted" />
                    <div>
                      <p className="font-medium text-sm line-clamp-1">
                        {product.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatPrice(product.preco)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Clientes Recentes</CardTitle>
              <CardDescription>Últimos clientes cadastrados</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/clientes">
                Ver Todos
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {customer.nome.charAt(0)}
                        {customer.sobrenome.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {customer.nome} {customer.sobrenome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
