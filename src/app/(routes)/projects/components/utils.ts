export function formatDate(date: string | null): string {
  if (!date) return "Reciente";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(amount: number | null): string {
  if (amount === null) return "$0.00";
  return `$${amount.toFixed(2)}`;
}

export function calculateProfitability(profit: number | null, totalCost: number | null): number | null {
  if (profit === null || totalCost === null || totalCost === 0) return null;
  return (profit / totalCost) * 100;
}

export function getProfitabilityColor(profitability: number | null): string {
  if (profitability === null) return "text-muted-foreground";
  if (profitability > 50) return "text-green-600";
  if (profitability > 20) return "text-green-500";
  if (profitability > 0) return "text-yellow-500";
  return "text-red-500";
}

export function getProfitabilityBadgeVariant(profitability: number | null): "default" | "secondary" | "destructive" | "success" {
  if (profitability === null) return "secondary";
  if (profitability > 20) return "success";
  if (profitability > 0) return "default";
  return "destructive";
}