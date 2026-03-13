import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'default' | 'white'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ variant = 'default', size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  }

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const textColor = variant === 'white' ? 'text-white' : 'text-foreground'
  const iconBg = 'bg-primary'

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        iconSizeClasses[size],
        iconBg,
        'rounded-lg flex items-center justify-center'
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5"
        >
          <path
            d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
            fill="currentColor"
            className="text-primary-foreground"
          />
          <path
            d="M12 6c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83L12 15.66l2.83-2.83A3.987 3.987 0 0016 10c0-2.21-1.79-4-4-4z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>
      <span className={cn(
        'font-serif font-bold tracking-tight',
        textColor,
        size === 'sm' && 'text-lg',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-2xl',
      )}>
        Bucaly
      </span>
    </Link>
  )
}
