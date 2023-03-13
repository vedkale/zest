export function formatDate(input: string | number): string {
    const date = new Date(input)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

export function formatDollar(input: number | null): string {
    if (!input) return "$0"
    return input.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    })
  }