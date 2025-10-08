import * as React from "react"
import { cn } from "@/lib/utils"

export interface NeumorphicCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pressed' | 'inset' | 'gradient'
  hover?: boolean
}

const NeumorphicCard = React.forwardRef<
  HTMLDivElement,
  NeumorphicCardProps
>(({ className, variant = 'default', hover = true, ...props }, ref) => {
  const baseClasses = "neu-animate neu-focus-ring"
  
  const variantClasses = {
    default: "neu-card",
    pressed: "neu-card neu-pressed",
    inset: "neu-inset p-6",
    gradient: "neu-card neu-gradient"
  }
  
  const hoverClasses = hover ? "hover:scale-[1.02] hover:-translate-y-1" : ""

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        className
      )}
      {...props}
    />
  )
})
NeumorphicCard.displayName = "NeumorphicCard"

export interface NeumorphicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'pressed' | 'gradient' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const NeumorphicButton = React.forwardRef<
  HTMLButtonElement,
  NeumorphicButtonProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const baseClasses = "neu-animate neu-focus-ring border-0 outline-none font-medium"
  
  const variantClasses = {
    default: "neu-button",
    pressed: "neu-button neu-pressed",
    gradient: "neu-button neu-gradient",
    icon: "neu-icon-button"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl",
    icon: "w-12 h-12 rounded-full" // Override for icon variant
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant !== 'icon' && sizeClasses[size],
        className
      )}
      {...props}
    />
  )
})
NeumorphicButton.displayName = "NeumorphicButton"

export interface NeumorphicInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'inset'
}

const NeumorphicInput = React.forwardRef<
  HTMLInputElement,
  NeumorphicInputProps
>(({ className, variant = 'inset', type, ...props }, ref) => {
  const baseClasses = "neu-animate neu-focus-ring border-0 outline-none w-full"
  
  const variantClasses = {
    default: "neu-container p-3 rounded-xl",
    inset: "neu-input"
  }

  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
NeumorphicInput.displayName = "NeumorphicInput"

export interface NeumorphicBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pressed' | 'gradient'
}

const NeumorphicBadge = React.forwardRef<
  HTMLDivElement,
  NeumorphicBadgeProps
>(({ className, variant = 'default', ...props }, ref) => {
  const baseClasses = "neu-animate inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full"
  
  const variantClasses = {
    default: "neu-small",
    pressed: "neu-small neu-pressed",
    gradient: "neu-small neu-gradient"
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
NeumorphicBadge.displayName = "NeumorphicBadge"

export { NeumorphicCard, NeumorphicButton, NeumorphicInput, NeumorphicBadge }