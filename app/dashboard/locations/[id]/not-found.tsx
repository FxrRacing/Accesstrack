"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong
          URL.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link href="/dashboard">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>

            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* <div className="pt-4">
            <Button variant="ghost" asChild className="flex items-center gap-2 text-sm">
              <Link href="/search">
                <Search className="w-4 h-4" />
                Search our site
              </Link>
            </Button>
          </div> */}
        </div>

        <div className="mt-12 text-xs text-gray-500 dark:text-gray-400">Error Code: 404</div>
      </div>
    </div>
  )
}
