export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-muted rounded mb-8"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    </div>
  )
}
