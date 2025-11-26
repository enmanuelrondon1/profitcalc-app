//src/components/projects/ProjectCostForm.tsx
"use client";

import { useFormStatus } from "react-dom";
import {
  createProjectCost,
  CostState,
} from "@/app/(routes)/projects/[projectId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { costCategories } from "@/lib/utils";
import { toast } from "sonner";
import { ReusableCost } from "@/lib/types";
import {
  Plus,
  Copy,
  DollarSign,
  Hash,
  Tag,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface ProjectCostFormProps {
  projectId: string;
  reusableCosts: ReusableCost[];
}

const initialState: CostState = {
  message: "",
  errors: {},
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
      <Plus className="w-4 h-4" />
      {pending ? "Añadiendo..." : "Añadir Costo"}
    </Button>
  );
}

export function ProjectCostForm({
  projectId,
  reusableCosts,
}: ProjectCostFormProps) {
  const [state, formAction] = useActionState(
    createProjectCost.bind(null, projectId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [category, setCategory] = useState("");
  const [showReusable, setShowReusable] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
      setName("");
      setQuantity("");
      setUnitPrice("");
      setCategory("");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleReusableCostChange = (costId: string) => {
    const selectedCost = reusableCosts.find((c) => c.id === costId);
    if (selectedCost) {
      setName(selectedCost.name);
      setUnitPrice(selectedCost.unit_price.toString());
      setCategory(selectedCost.category ?? "");
      toast.success("Costo reutilizable cargado", {
        description: selectedCost.name,
        duration: 2000,
      });
    }
  };

  // Calcular total
  const totalCost =
    quantity && unitPrice
      ? (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2)
      : "0.00";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="relative overflow-hidden border rounded-xl border-border/50 bg-card"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

      <div className="relative p-6 space-y-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-primary/10 border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Añadir Nuevo Costo
              </h3>
              <p className="text-xs text-muted-foreground">
                Ingresa los detalles del costo del proyecto
              </p>
            </div>
          </div>
        </div>

        {/* Reusable Costs Section - Collapsible */}
        {reusableCosts && reusableCosts.length > 0 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowReusable(!showReusable)}
              className="flex items-center gap-2 text-sm font-semibold transition-colors text-primary hover:text-primary/80"
            >
              <Copy className="w-4 h-4" />
              {showReusable ? "Ocultar" : "Ver"} Costos Reutilizables (
              {reusableCosts.length})
            </button>

            {showReusable && (
              <div className="p-4 space-y-3 border rounded-lg bg-primary/5 border-primary/20 animate-in fade-in">
                <Select onValueChange={handleReusableCostChange}>
                  <SelectTrigger className="h-10 transition-colors bg-background border-border/50 hover:border-primary/50">
                    <SelectValue placeholder="Selecciona un costo guardado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reusableCosts.map((cost) => (
                      <SelectItem key={cost.id} value={cost.id}>
                        <div className="flex items-center gap-2">
                          <span>{cost.name}</span>
                          {cost.category && (
                            <span className="text-xs text-muted-foreground">
                              • {cost.category}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-primary">
                            ${cost.unit_price.toFixed(2)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Tag className="w-4 h-4 text-muted-foreground" />
              Nombre
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Materiales"
              required
              className="h-10 transition-all duration-300 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            {state?.errors?.name && (
              <p className="flex items-center gap-1 text-xs font-medium text-destructive animate-pulse">
                <AlertCircle className="w-3 h-3" />
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <Label
              htmlFor="quantity"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Hash className="w-4 h-4 text-muted-foreground" />
              Cantidad
            </Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              step="any"
              min="0"
              required
              className="h-10 transition-all duration-300 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            {state?.errors?.quantity && (
              <p className="flex items-center gap-1 text-xs font-medium text-destructive animate-pulse">
                <AlertCircle className="w-3 h-3" />
                {state.errors.quantity[0]}
              </p>
            )}
          </div>

          {/* Costo Unitario */}
          <div className="space-y-2">
            <Label
              htmlFor="unit_price"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Precio Unit.
            </Label>
            <Input
              type="number"
              id="unit_price"
              name="unit_price"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="h-10 transition-all duration-300 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            {state?.errors?.unit_price && (
              <p className="flex items-center gap-1 text-xs font-medium text-destructive animate-pulse">
                <AlertCircle className="w-3 h-3" />
                {state.errors.unit_price[0]}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Tag className="w-4 h-4 text-muted-foreground" />
              Categoría
            </Label>
            <Select
              name="category"
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger className="h-10 transition-colors bg-muted/50 border-border/50 hover:border-primary/50">
                <SelectValue placeholder="Selecciona..." />
              </SelectTrigger>
              <SelectContent>
                {costCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.category && (
              <p className="flex items-center gap-1 text-xs font-medium text-destructive animate-pulse">
                <AlertCircle className="w-3 h-3" />
                {state.errors.category[0]}
              </p>
            )}
          </div>
        </div>

        {/* Preview Total */}
        {quantity && unitPrice && (
          <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary/20">
            <span className="text-sm font-medium text-muted-foreground">
              Subtotal estimado:
            </span>
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              ${totalCost}
            </span>
          </div>
        )}

        {/* Submit Button */}
        <SubmitButton />

        {/* Success Message */}
        {state.success && (
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-success/5 border-success/20 animate-in fade-in">
            <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-success" />
            <p className="text-sm font-medium text-success">{state.message}</p>
          </div>
        )}
      </div>
    </form>
  );
}
