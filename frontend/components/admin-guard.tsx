'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Apenas rodar verificação no client side
    let mounted = true

    const checkAuth = async () => {
      try {
        const user = await api.getCurrentUser()
        
        if (!mounted) return

        if (!user) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
          return
        }

        if (user.role.toLowerCase() !== 'admin') {
          // Usuário logado mas não é admin
          router.replace('/')
          return
        }

        setIsAuthorized(true)
      } catch (err) {
        if (mounted) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [pathname, router]) // re-checa quando muda de rota

  // Tela de Loading enquanto confere permissão
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Validando permissões...</p>
        </div>
      </div>
    )
  }

  // Se verificado e autorizado, exibe o painel Admin
  return <>{children}</>
}
