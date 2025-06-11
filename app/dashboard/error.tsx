'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  const router = useRouter()
  return (
    <div>
      <h2>Something went wrong! A team member has been notified.</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again   
      </Button>
      {/* go home */}
      <Button
        onClick={
          () => router.push('/')
        }
      >
        Go Home
      </Button>
    </div>
  )
}