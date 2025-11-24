//src/components/costs/ReusableCostForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createReusableCost } from "@/app/(routes)/costs/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { costCategories } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState = {
  message: "",
  // La propiedad 'errors' no debe estar presente si 'message' lo está.
  // Al eliminarla, el estado inicial cumple con el tipo esperado por el hook.
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Añadiendo..." : "Añadir Costo"}
    </Button>
  );
}

export function ReusableCostForm() {
  const [state, formAction] = useActionState(createReusableCost, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === "Costo creado.") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Costo</Label>
        <Input id="name" name="name" required />
        {state.errors?.name && (
          <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="unit_price">Precio Unitario (USD)</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step="0.01"
          required
        />
        {state.errors?.unit_price && (
          <p className="text-red-500 text-xs mt-1">
            {state.errors.unit_price}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {costCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.category && (
          <p className="text-red-500 text-xs mt-1">{state.errors.category}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}