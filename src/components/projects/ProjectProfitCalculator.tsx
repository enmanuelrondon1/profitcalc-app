//src/components/projects/ProjectProfitCalculator.tsx

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import {
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle2,
  Package,
} from "lucide-react";

interface ProjectProfitCalculatorProps {
  projectId: string;
  totalCost: number;
  sellingPrice: number | null;
  quantity: number | null;
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
      className="w-full gap-2 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 h-11"
    >
      {pending ? "Guardando..." : "Guardar Precio"}
    </Button>
  );
}

export function ProjectProfitCalculator({
  projectId,
  totalCost,
  sellingPrice,
  quantity,
  projectName,
}: ProjectProfitCalculatorProps) {
  const [state, formAction] = useActionState(
    updateProjectSellingPrice.bind(null, projectId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [inputMode, setInputMode] = useState<"total" | "unit">("total");

  // Cálculos
  const qty = quantity || 1;
  const costPerUnit = totalCost / qty;

  const profit = sellingPrice ? sellingPrice - totalCost : null;
  const profitPerUnit = sellingPrice ? sellingPrice / qty - costPerUnit : null;
  const profitMargin =
    sellingPrice && profit !== null ? (profit / sellingPrice) * 100 : null;

  const isProfitable = profit !== null && profit > 0;
  const marginStatus = profitMargin
    ? profitMargin >= 50
      ? "excellent"
      : profitMargin >= 20
      ? "good"
      : profitMargin > 0
      ? "fair"
      : "loss"
    : null;

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

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
            <h2 className="text-xl font-bold text-foreground">
              Resumen Financiero
            </h2>
            <p className="text-xs text-muted-foreground">
              {projectName || "Análisis de rentabilidad"}
            </p>
          </div>
        </div>

        {/* Quantity Info */}
        {quantity && (
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-primary/5 border-primary/20">
            <Package className="flex-shrink-0 w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Cantidad:{" "}
              <span className="font-semibold text-foreground">
                {quantity} unidades
              </span>
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              Costo por unidad:{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(costPerUnit, "USD")}
              </span>
            </span>
          </div>
        )}

        {/* Input Form */}
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Precio Total de Venta (USD)
            </Label>
            <div className="relative">
              <span className="absolute font-semibold -translate-y-1/2 left-3 top-1/2 text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                id="selling_price"
                name="selling_price"
                step="0.01"
                defaultValue={sellingPrice ?? ""}
                placeholder="0.00"
                className="pl-8 transition-all duration-300 h-11 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>
            {state?.errors?.selling_price && (
              <p className="flex items-center gap-1 mt-1 text-xs font-medium text-destructive">
                <AlertCircle className="w-3 h-3" />
                {state.errors.selling_price[0]}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>

        {/* Stats Grid - Total */}
        <div className="grid grid-cols-3 gap-3">
          {/* Costo Total */}
          <div className="p-4 transition-colors border rounded-lg bg-muted/50 border-border/50 hover:border-primary/30">
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Costo Total
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(totalCost, "USD")}
            </p>
          </div>

          {/* Precio Total Venta */}
          <div className="p-4 transition-colors border rounded-lg bg-muted/50 border-border/50 hover:border-primary/30">
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Venta Total
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(sellingPrice ?? 0, "USD")}
            </p>
          </div>

          {/* Ganancia Total */}
          <div
            className={`p-4 rounded-lg border transition-colors ${
              isProfitable
                ? "bg-success/10 border-success/30 hover:border-success/50"
                : "bg-destructive/10 border-destructive/30 hover:border-destructive/50"
            }`}
          >
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
              Ganancia Total
            </p>
            <p
              className={`text-lg font-bold ${
                isProfitable ? "text-success" : "text-destructive"
              }`}
            >
              {isProfitable ? "+" : ""}
              {formatCurrency(profit ?? 0, "USD")}
            </p>
          </div>
        </div>

        {/* Stats Grid - Por Unidad */}
        {quantity && profitPerUnit !== null && (
          <div className="p-4 border rounded-lg bg-accent/5 border-accent/20">
            <p className="mb-3 text-sm font-semibold text-foreground">
              Precio por Unidad
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Costo/Unidad
                </p>
                <p className="text-base font-bold text-foreground">
                  {formatCurrency(costPerUnit, "USD")}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Precio/Unidad
                </p>
                <p className="text-base font-bold text-foreground">
                  {formatCurrency((sellingPrice || 0) / qty, "USD")}
                </p>
              </div>
              <div
                className={isProfitable ? "text-success" : "text-destructive"}
              >
                <p className="mb-1 text-xs text-muted-foreground">
                  Ganancia/Unidad
                </p>
                <p className="text-base font-bold">
                  {isProfitable ? "+" : ""}
                  {formatCurrency(profitPerUnit, "USD")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Margen Percentage */}
        {profitMargin !== null && (
          <div
            className={`p-4 border rounded-lg transition-all ${
              marginStatus === "excellent"
                ? "bg-success/10 border-success/20"
                : marginStatus === "good"
                ? "bg-primary/10 border-primary/20"
                : marginStatus === "fair"
                ? "bg-warning/10 border-warning/20"
                : "bg-destructive/10 border-destructive/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Margen de Ganancia
                </p>
                <p
                  className={`text-3xl font-bold ${
                    marginStatus === "excellent"
                      ? "text-success"
                      : marginStatus === "good"
                      ? "text-primary"
                      : marginStatus === "fair"
                      ? "text-warning"
                      : "text-destructive"
                  }`}
                >
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  marginStatus === "excellent"
                    ? "bg-success/20 border-success text-success"
                    : marginStatus === "good"
                    ? "bg-primary/20 border-primary text-primary"
                    : marginStatus === "fair"
                    ? "bg-warning/20 border-warning text-warning"
                    : "bg-destructive/20 border-destructive text-destructive"
                }`}
              >
                {marginStatus === "excellent"
                  ? "✓"
                  : marginStatus === "good"
                  ? "!"
                  : "⚠"}
              </div>
            </div>
          </div>
        )}

        {/* Insight Message */}
        {profit !== null && (
          <div
            className={`rounded-lg p-4 border flex items-start gap-3 ${
              isProfitable
                ? "bg-success/5 border-success/20"
                : "bg-destructive/5 border-destructive/20"
            }`}
          >
            {isProfitable ? (
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-sm">
              <p
                className={
                  isProfitable
                    ? "text-success font-semibold"
                    : "text-destructive font-semibold"
                }
              >
                {isProfitable
                  ? `¡Excelente! Tu proyecto es rentable`
                  : `⚠ Atención: Proyecto no rentable`}
              </p>
              <p
                className={
                  isProfitable
                    ? "text-success/90 text-xs"
                    : "text-destructive/90 text-xs"
                }
              >
                {quantity && profitPerUnit !== null
                  ? `Ganancia total: ${formatCurrency(
                      profit,
                      "USD"
                    )} | Por unidad: ${formatCurrency(profitPerUnit, "USD")}`
                  : `Ganancia total: ${formatCurrency(profit, "USD")}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
