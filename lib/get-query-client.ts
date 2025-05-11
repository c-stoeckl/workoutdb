// lib/get-query-client.ts
import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

// cache() ensures that QueryClient is only created once per request
// This is crucial for Server Components to avoid creating a new client for every component instance during a single request.
const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      // Set default staleTime consistent with the client-side provider
      staleTime: 60 * 1000,
    },
  },
}))
export default getQueryClient
