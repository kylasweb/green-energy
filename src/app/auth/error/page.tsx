"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid.',
  Default: 'An error occurred during authentication.'
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessage = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="mt-4 text-xl font-semibold text-gray-900">
            Authentication Error
          </CardTitle>
          <CardDescription className="mt-2">
            {errorMessage}
          </CardDescription>
          {error && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded">
              Error Code: {error}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Common solutions:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your internet connection</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try signing in again</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <strong>Debug Info (Development Only):</strong>
              <pre className="mt-1 whitespace-pre-wrap">
                Error: {error}
                URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}