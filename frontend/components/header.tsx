'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ShoppingCart, Heart, User } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const defaultNavLinks = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/sobre', label: 'Sobre Nós' },
  { href: '/contato', label: 'Contato' },
]

interface HeaderProps {
  data?: any // Dados vindos do CMS
}

export function Header({ data }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount] = useState(3) // Mock cart count
  const pathname = usePathname()

  const navLinks = data?.menuItems ? data.menuItems.map((item: any) => ({ href: item.link, label: item.label })) : defaultNavLinks

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-bucaly">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link: { href: string; label: string }) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="w-full pl-10 bg-secondary border-0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Toggle - Mobile/Tablet */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
              <Link href="/favoritos">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favoritos</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/carrinho">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
                  >
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">Carrinho</span>
              </Link>
            </Button>

            {/* User */}
            <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Conta</span>
              </Link>
            </Button>

            {/* CTA Button - Desktop */}
            <Button asChild className="hidden md:flex">
              <Link href="/cadastro">Inscrever-se</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>
                    <Logo size="sm" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link: { href: string; label: string }) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary py-2',
                        pathname === link.href
                          ? 'text-primary'
                          : 'text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <Link
                    href="/favoritos"
                    className="text-lg font-medium transition-colors hover:text-primary py-2 flex items-center gap-3"
                  >
                    <Heart className="h-5 w-5" />
                    Favoritos
                  </Link>
                  <Link
                    href="/login"
                    className="text-lg font-medium transition-colors hover:text-primary py-2 flex items-center gap-3"
                  >
                    <User className="h-5 w-5" />
                    Minha Conta
                  </Link>
                  <hr className="my-4" />
                  <Button asChild className="w-full">
                    <Link href="/cadastro">Criar Conta</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">Entrar</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="w-full pl-10 bg-secondary border-0"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
