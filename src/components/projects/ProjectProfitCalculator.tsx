//src/components/projects/ProjectProfitCalculator.tsx

"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProjectSellingPrice,
  type SellingPriceState,
} from "@/app/(routes)/projects/[projectId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { TrendingUp, DollarSign, Target } from "lucide-react";

interface ProjectProfitCalculatorProps {
  projectId: string;
  totalCost: number;
  sellingPrice: number | null;
  exchangeRate: number | null;
  projectName?: string;
}

const initialState: SellingPriceState = {
  errors: {},
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30"
    >
      {pending ? "Guardando..." : "Guardar Precio"}
    </Button>
  );
}

export function ProjectProfitCalculator({
  projectId,
  totalCost,
  sellingPrice,
  projectName,
}: ProjectProfitCalculatorProps) {
  const [state, formAction] = useActionState(
    updateProjectSellingPrice.bind(null, projectId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  const profit = sellingPrice ? sellingPrice - totalCost : null;
  const profitMargin =
    sellingPrice && profit !== null ? (profit / sellingPrice) * 100 : null;

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const isProfitable = profit !== null && profit > 0;

  return (
    <div className="relative overflow-hidden border rounded-xl border-border/50 bg-card">
      {/* Gradient background effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

      <div className="relative p-6 space-y-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-primary/10 border-primary/20">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Resumen Financiero</h2>
            <p className="text-xs text-muted-foreground">{projectName || "Análisis de rentabilidad"}</p>
          </div>
        </div>

        {/* Input Form */}
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="selling_price" className="text-sm font-semibold">
              Precio de Venta (USD)
            </Label>
            <div className="relative">
              <DollarSign className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                type="number"
                id="selling_price"
                name="selling_price"
                step="any"
                defaultValue={sellingPrice ?? ""}
                placeholder="0.00"
                className="pl-8 transition-all duration-300 h-11 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            {state?.errors?.selling_price && (
              <p className="mt-1 text-xs font-medium text-destructive animate-pulse">
                {state.errors.selling_price[0]}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Costo Total */}
          <div className="p-4 transition-colors duration-300 border rounded-lg bg-muted/50 border-border/50 hover:border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                Costo Total
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalCost, "USD")}
            </p>
          </div>

          {/* Precio de Venta */}
          {sellingPrice !== null && (
            <div className="p-4 transition-colors duration-300 border rounded-lg bg-muted/50 border-border/50 hover:border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  Precio de Venta
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(sellingPrice, "USD")}
              </p>
            </div>
          )}

          {/* Ganancia / Pérdida */}
          {profit !== null && (
            <div className={`rounded-lg border p-4 transition-colors duration-300 ${
              isProfitable
                ? "bg-success/10 border-success/30 hover:border-success/50"
                : "bg-destructive/10 border-destructive/30 hover:border-destructive/50"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`h-4 w-4 ${isProfitable ? "text-success" : "text-destructive"}`} />
                <p className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  Ganancia
                </p>
              </div>
              <p className={`text-2xl font-bold ${isProfitable ? "text-success" : "text-destructive"}`}>
                {isProfitable ? "+" : ""}{formatCurrency(profit, "USD")}
              </p>
            </div>
          )}
        </div>

        {/* Margen Percentage */}
        {profitMargin !== null && (
          <div className="p-4 border rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs font-medium tracking-wide uppercase text-muted-foreground">
                  Margen de Ganancia
                </p>
                <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 border rounded-full bg-primary/20 border-primary/30">
                <span className="text-lg font-bold text-primary">
                  {profitMargin > 50 ? "✓" : profitMargin > 0 ? "!" : "✗"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Insight Message */}
        {profit !== null && (
          <div className={`rounded-lg p-4 border text-sm ${
            isProfitable
              ? "bg-success/5 border-success/20 text-success"
              : "bg-destructive/5 border-destructive/20 text-destructive"
          }`}>
            {isProfitable ? (
              <p>✓ ¡Excelente! Tu proyecto es rentable con una ganancia de {formatCurrency(profit, "USD")}</p>
            ) : (
              <p>⚠ Atención: Tu proyecto no es rentable. Considera ajustar costos o precio de venta.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}