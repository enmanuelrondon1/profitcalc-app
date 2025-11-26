//src/components/costs/ReusableCostForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createReusableCost,
  type ReusableCostState,
} from "@/app/(routes)/costs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { costCategories } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, DollarSign, Tag, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const initialState: ReusableCostState = {
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
      {pending ? "Creando..." : "Crear Costo"}
    </Button>
  );
}

export function ReusableCostForm() {
  const [state, formAction] = useActionState(
    createReusableCost,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
      setCategory("");
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
          <Tag className="w-4 h-4 text-muted-foreground" />
          Nombre
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Ej: Tornillos M8"
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

      {/* Precio Unitario */}
      <div className="space-y-2">
        <Label htmlFor="unit_price" className="flex items-center gap-2 text-sm font-semibold">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          Precio Unitario (USD)
        </Label>
        <Input
          type="number"
          id="unit_price"
          name="unit_price"
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

      {/* Submit Button */}
      <SubmitButton />

      {/* Success Message */}
      {state.success && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-success/5 border-success/20 animate-in fade-in">
          <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-success" />
          <p className="text-xs font-medium text-success">{state.message}</p>
        </div>
      )}
    </form>
  );
}