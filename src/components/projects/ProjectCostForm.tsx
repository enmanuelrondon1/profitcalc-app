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
import { Plus, Copy, DollarSign, Hash, Tag, Zap } from "lucide-react";

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
      toast.success("Costo reutilizable cargado", { description: selectedCost.name });
    }
  };

  return (
    <form ref={formRef} action={formAction} className="relative overflow-hidden border rounded-xl border-border/50 bg-card">
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary/50" />

      <div className="relative p-6 space-y-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-primary/10 border-primary/20">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Añadir Nuevo Costo</h3>
            <p className="text-xs text-muted-foreground">Ingresa los detalles del costo</p>
          </div>
        </div>

        {/* Reusable Costs Section */}
        {reusableCosts && reusableCosts.length > 0 && (
          <div className="p-4 space-y-3 border rounded-lg bg-muted/50 border-border/50">
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4 text-primary" />
              <Label className="text-sm font-semibold">Usar Costo Reutilizable</Label>
            </div>
            <Select onValueChange={handleReusableCostChange}>
              <SelectTrigger className="h-10 transition-colors bg-background border-border/50 hover:border-primary/50">
                <SelectValue placeholder="Selecciona un costo guardado..." />
              </SelectTrigger>
              <SelectContent>
                {reusableCosts.map((cost) => (
                  <SelectItem key={cost.id} value={cost.id}>
                    {cost.name} {cost.category && `• ${cost.category}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
              <Tag className="w-4 h-4 text-muted-foreground" />
              Nombre del Costo
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
              <p className="text-xs font-medium text-destructive animate-pulse">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-semibold">
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
              required
              className="h-10 transition-all duration-300 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            {state?.errors?.quantity && (
              <p className="text-xs font-medium text-destructive animate-pulse">
                {state.errors.quantity[0]}
              </p>
            )}
          </div>

          {/* Costo Unitario */}
          <div className="space-y-2">
            <Label htmlFor="unit_price" className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Costo Unitario
            </Label>
            <Input
              type="number"
              id="unit_price"
              name="unit_price"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0.00"
              step="any"
              required
              className="h-10 transition-all duration-300 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            />
            {state?.errors?.unit_price && (
              <p className="text-xs font-medium text-destructive animate-pulse">
                {state.errors.unit_price[0]}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold">
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
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.category && (
              <p className="text-xs font-medium text-destructive animate-pulse">
                {state.errors.category[0]}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}