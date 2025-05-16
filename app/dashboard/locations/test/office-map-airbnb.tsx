"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Office } from "./types/office"

interface OfficeMapAirbnbProps {
  offices: Office[]
  onSelectOffice: (office: Office) => void
  favoriteOffices: number[]
  height?: number
}

export default function OfficeMapAirbnb({
  offices,
  onSelectOffice,
  favoriteOffices,
  height = 600,
}: OfficeMapAirbnbProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeOffice, setActiveOffice] = useState<Office | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = height
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw a light themed world map background
    ctx.fillStyle = "#f8fafc" // slate-50
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0" // slate-200
    ctx.lineWidth = 1

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Vertical lines
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw continents (simplified)
    ctx.fillStyle = "#f1f5f9" // slate-100

    // North America
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.2, canvas.height * 0.3, 80, 60, 0, 0, Math.PI * 2)
    ctx.fill()

    // South America
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.25, canvas.height * 0.6, 40, 70, 0, 0, Math.PI * 2)
    ctx.fill()

    // Europe
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.45, canvas.height * 0.25, 40, 30, 0, 0, Math.PI * 2)
    ctx.fill()

    // Africa
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.5, canvas.height * 0.5, 60, 70, 0, 0, Math.PI * 2)
    ctx.fill()

    // Asia
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.65, canvas.height * 0.3, 90, 70, 0, 0, Math.PI * 2)
    ctx.fill()

    // Australia
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.8, canvas.height * 0.65, 40, 30, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw office locations
    offices.forEach((office) => {
      // Convert lat/long to x,y coordinates (simplified)
      const x = (Number.parseFloat(office.coordinates.longitude) + 180) * (canvas.width / 360)
      const y = (90 - Number.parseFloat(office.coordinates.latitude)) * (canvas.height / 180)

      // Draw shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.beginPath()
      ctx.arc(x, y + 2, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw pin
      ctx.fillStyle = favoriteOffices.includes(office.id)
        ? "#f43f5e" // rose-500
        : office.type === "Headquarters"
          ? "#f43f5e" // rose-500
          : office.type === "Regional"
            ? "#f97316" // orange-500
            : "#6b7280" // gray-500

      // Pin drop shape
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add click event listeners to canvas
      canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const clickY = event.clientY - rect.top

        // Check if click is near any office pin
        offices.forEach((office) => {
          const officeX = (Number.parseFloat(office.coordinates.longitude) + 180) * (canvas.width / 360)
          const officeY = (90 - Number.parseFloat(office.coordinates.latitude)) * (canvas.height / 180)

          const distance = Math.sqrt(Math.pow(clickX - officeX, 2) + Math.pow(clickY - officeY, 2))

          if (distance < 15) {
            setActiveOffice(office)
          }
        })
      })
    })

    // Draw legend
    const legendX = 20
    let legendY = 20

    // HQ
    ctx.fillStyle = "#f43f5e" // rose-500
    ctx.beginPath()
    ctx.arc(legendX, legendY, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#0f172a" // slate-900
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("Headquarters", legendX + 15, legendY)

    // Regional
    legendY += 20
    ctx.fillStyle = "#f97316" // orange-500
    ctx.beginPath()
    ctx.arc(legendX, legendY, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#0f172a" // slate-900
    ctx.font = "12px sans-serif"
    ctx.fillText("Regional Office", legendX + 15, legendY)

    // Satellite
    legendY += 20
    ctx.fillStyle = "#6b7280" // gray-500
    ctx.beginPath()
    ctx.arc(legendX, legendY, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#0f172a" // slate-900
    ctx.font = "12px sans-serif"
    ctx.fillText("Satellite Office", legendX + 15, legendY)
  }, [offices, height, favoriteOffices])

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="h-full w-full rounded-xl border border-gray-200 bg-slate-50"></div>

      {activeOffice && (
        <div className="absolute p-4 bg-white rounded-xl shadow-lg border border-gray-200 w-64 transform -translate-x-1/2 left-1/2 lg:left-auto lg:transform-none lg:w-80">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{activeOffice.name}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <Heart
                className={`h-4 w-4 ${
                  favoriteOffices.includes(activeOffice.id) ? "fill-rose-500 text-rose-500" : "text-gray-600"
                }`}
              />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
          <p className="text-gray-500 text-sm mb-2">
            {activeOffice.city}, {activeOffice.country}
          </p>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{activeOffice.address}</span>
          </div>
          <Button
            onClick={() => onSelectOffice(activeOffice)}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            View Details
          </Button>
        </div>
      )}
    </div>
  )
}
