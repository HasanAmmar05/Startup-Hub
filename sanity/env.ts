export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-05'

// Provide default values for development environment
const isDevelopment = process.env.NODE_ENV === 'development'

export const dataset = isDevelopment
  ? (process.env.NEXT_PUBLIC_SANITY_DATASET || 'hasandev')
  : assertValue(
      process.env.NEXT_PUBLIC_SANITY_DATASET,
      'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
    )

export const projectId = isDevelopment
  ? (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mq1ahvt8')
  : assertValue(
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
    )

export const token = process.env.SANITY_WRITE_TOKEN;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
