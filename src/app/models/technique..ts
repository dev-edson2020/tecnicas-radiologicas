import { Category } from "./category";
export interface Technique {
  id: number | null;
  name: string;
  kv: number;
  mas: number;
  ma: number;
  distance: number;
  category: Category;
  fullName?: string;
}
