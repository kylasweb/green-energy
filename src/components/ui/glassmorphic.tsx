"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// Glassmorphic Card Component
const glassCardVariants = cva(
  "glass-card",
  {
    variants: {
      variant: {
        default: "glass-card",
        subtle: "glass-card-subtle",
        strong: "glass-card-strong",
        inset: "glass-card border-2",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GlassmorphicCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassmorphicCard = React.forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant, size }), className)}
      {...props}
    />
  )
)
GlassmorphicCard.displayName = "GlassmorphicCard"

// Glassmorphic Button Component
const glassButtonVariants = cva(
  "glass-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "glass-button",
        pressed: "glass-button transform translate-y-0 shadow-inner",
        gradient: "glass-button-gradient",
        icon: "glass-button !p-2 aspect-square",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GlassmorphicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassmorphicButton = React.forwardRef<HTMLButtonElement, GlassmorphicButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(glassButtonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassmorphicButton.displayName = "GlassmorphicButton"

// Glassmorphic Input Component
export type GlassmorphicInputProps = React.InputHTMLAttributes<HTMLInputElement>

const GlassmorphicInput = React.forwardRef<HTMLInputElement, GlassmorphicInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "glass-input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassmorphicInput.displayName = "GlassmorphicInput"

// Glassmorphic Badge Component
const glassBadgeVariants = cva(
  "glass-badge inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "glass-badge",
        secondary: "glass-badge opacity-80",
        destructive: "glass-badge border-red-500/50 text-red-600",
        outline: "glass-badge border-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface GlassmorphicBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassBadgeVariants> {}

function GlassmorphicBadge({ className, variant, ...props }: GlassmorphicBadgeProps) {
  return (
    <div className={cn(glassBadgeVariants({ variant }), className)} {...props} />
  )
}

export { GlassmorphicCard, GlassmorphicButton, GlassmorphicInput, GlassmorphicBadge, glassCardVariants, glassButtonVariants, glassBadgeVariants }