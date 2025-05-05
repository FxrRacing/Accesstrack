"use client"

import { useMemo } from "react"

interface GradientAvatarProps {
  seed: string
  size?: number
  className?: string
}

export function GradientAvatar({ seed, size = 40, className = "" }: GradientAvatarProps) {
  // Generate deterministic colors based on the seed
  const { color1, color2, rotation } = useMemo(() => {
    // Simple hash function to generate a number from a string
    const hashString = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return hash
    }

    // Convert hash to hex color
    const intToHSL = (int: number, saturation = 85, lightness = 65) => {
      const hue = Math.abs(int) % 360
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`
    }

    const hash = hashString(seed)
    const hash2 = hashString(seed + seed)

    return {
      color1: intToHSL(hash),
      color2: intToHSL(hash2, 75, 55),
      rotation: Math.abs(hash) % 360,
    }
  }, [seed])

  return (
    <div
      className={`rounded-full flex-shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `linear-gradient(${rotation}deg, ${color1}, ${color2})`,
      }}
      aria-hidden="true"
    />
  )
}
