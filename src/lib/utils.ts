//src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export const costCategories = [
  { value: "materiales", label: "Materiales", color: "#8884d8" },
  { value: "mano_de_obra", label: "Mano de Obra", color: "#82ca9d" },
  { value: "herramientas", label: "Herramientas", color: "#ffc658" },
  { value: "transporte", label: "Transporte", color: "#ff8042" },
  { value: "otros", label: "Otros", color: "#a4de6c" },
];