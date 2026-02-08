export interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  createdAt: string;
  updatedAt: string;
}
