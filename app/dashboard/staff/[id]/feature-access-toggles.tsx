"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface FeatureAccessTogglesProps {
  userId: string
}

export function FeatureAccessToggles({ userId }: FeatureAccessTogglesProps) {
  
  const features = [
    { name: "Analytics Dashboard", defaultEnabled: true },
    { name: "User Management", defaultEnabled: false },
    { name: "Billing Management", defaultEnabled: false },
    { name: "API Access", defaultEnabled: false },
    { name: "Report Generation", defaultEnabled: false },
  ]
console.log({userId})
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>(
    features.reduce(
      (acc, feature) => {
        acc[feature.name] = feature.defaultEnabled
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  const handleToggleFeature = (featureName: string) => {
    setEnabledFeatures((prev) => ({
      ...prev,
      [featureName]: !prev[featureName],
    }))
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {features.map((feature) => (
        <div key={feature.name} className="flex items-center justify-between rounded-md border bg-card p-3 shadow-sm">
          <span>{feature.name}</span>
          <Switch checked={enabledFeatures[feature.name]} onCheckedChange={() => handleToggleFeature(feature.name)} />
        </div>
      ))}
    </div>
  )
}
