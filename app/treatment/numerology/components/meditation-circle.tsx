"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { getMeditationBell } from "@/lib/utils/meditation-bell"

interface MeditationCircleProps {
  numbers: string[]
  color: string
  targetCount?: number
  onComplete?: () => void
}

export function MeditationCircle({
  numbers,
  color,
  targetCount = 49,
  onComplete,
}: MeditationCircleProps) {
  const [count, setCount] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const circleRef = useRef<HTMLDivElement>(null)
  const rippleIdRef = useRef(0)

  const progress = (count / targetCount) * 100
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const handleTap = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || count >= targetCount) return

    // Get tap position for ripple effect
    const rect = circleRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Add ripple
      const rippleId = rippleIdRef.current++
      setRipples((prev) => [...prev, { id: rippleId, x, y }])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId))
      }, 1000)
    }

    // Play bell sound
    const bell = getMeditationBell()
    bell.playTap()

    // Increment count
    const newCount = count + 1
    setCount(newCount)

    // Check completion
    if (newCount >= targetCount) {
      setIsActive(false)
      bell.playCompletion()
      onComplete?.()
    }
  }

  const handleStart = async () => {
    if (isActive) {
      setIsActive(false)
      return
    }

    setIsActive(true)

    // Play opening bell
    const bell = getMeditationBell()
    await bell.playOpening()
  }

  const handleReset = () => {
    setCount(0)
    setIsActive(false)
    setRipples([])
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Meditation Circle */}
      <div
        ref={circleRef}
        className="relative cursor-pointer select-none"
        onClick={handleTap}
        style={{
          width: "280px",
          height: "280px",
        }}
      >
        {/* SVG Progress Ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="280"
          height="280"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={`${color}30`}
            strokeWidth="12"
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Numbers */}
          <div className="flex items-center gap-3 mb-4">
            {numbers.map((num, idx) => (
              <div
                key={idx}
                className="text-4xl font-bold transition-transform hover:scale-110"
                style={{ color }}
              >
                {num}
              </div>
            ))}
          </div>

          {/* Count */}
          <div className="text-center">
            <div className="text-6xl font-bold text-foreground">{count}</div>
            <div className="text-sm text-muted-foreground mt-1">/ {targetCount}</div>
          </div>

          {isActive && count < targetCount && (
            <div className="text-xs text-muted-foreground mt-3 animate-pulse">
              Chạm để niệm
            </div>
          )}
        </div>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="rounded-full animate-ripple"
              style={{
                width: "10px",
                height: "10px",
                background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
                animation: "ripple 1s ease-out",
              }}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleStart}
          size="lg"
          className="gap-2"
          variant={isActive ? "outline" : "default"}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              Tạm dừng
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Bắt đầu
            </>
          )}
        </Button>

        <Button onClick={handleReset} size="lg" variant="outline" className="gap-2 bg-transparent">
          <RotateCcw className="w-4 h-4" />
          Đặt lại
        </Button>
      </div>

      {/* Completion message */}
      {count >= targetCount && (
        <div className="text-center space-y-2 animate-in fade-in duration-500">
          <div className="text-2xl font-semibold text-primary">🙏 Hoàn thành!</div>
          <p className="text-sm text-muted-foreground">
            Bạn đã hoàn thành {targetCount} lần niệm số
          </p>
        </div>
      )}

      {/* Ripple animation styles */}
      <style jsx>{`
        @keyframes ripple {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
