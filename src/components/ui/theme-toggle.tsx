"use client"

import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'default' | 'icon' | 'dropdown'
}

export function ThemeToggle({ className, variant = 'icon' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  if (variant === 'icon') {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className={cn(
          "neu-button relative overflow-hidden transition-all duration-300",
          "hover:scale-105 active:scale-95",
          className
        )}
      >
        <Sun className={cn(
          "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all",
          theme === 'dark' && "-rotate-90 scale-0"
        )} />
        <Moon className={cn(
          "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all",
          theme === 'dark' && "rotate-0 scale-100"
        )} />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  if (variant === 'default') {
    return (
      <Button
        variant="outline"
        onClick={toggleTheme}
        className={cn(
          "neu-button gap-2",
          className
        )}
      >
        {theme === 'light' ? (
          <>
            <Sun className="h-4 w-4" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="h-4 w-4" />
            Dark Mode
          </>
        )}
      </Button>
    )
  }

  return null
}

// Animated theme toggle with neumorphism
export function AnimatedThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div 
      className={cn(
        "neu-container p-2 rounded-full cursor-pointer select-none",
        "transition-all duration-300 hover:scale-105 active:scale-95",
        className
      )}
      onClick={toggleTheme}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-full transition-all duration-300",
          theme === 'light' ? 'neu-pressed' : 'opacity-50'
        )}>
          <Sun className="h-5 w-5 text-amber-500" />
        </div>
        
        <div className="relative">
          <div className={cn(
            "w-12 h-6 rounded-full neu-inset transition-all duration-300",
            "flex items-center px-1"
          )}>
            <div className={cn(
              "w-4 h-4 rounded-full neu-button transition-all duration-300",
              "shadow-sm",
              theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
            )} />
          </div>
        </div>
        
        <div className={cn(
          "p-2 rounded-full transition-all duration-300",
          theme === 'dark' ? 'neu-pressed' : 'opacity-50'
        )}>
          <Moon className="h-5 w-5 text-blue-500" />
        </div>
      </div>
    </div>
  )
}