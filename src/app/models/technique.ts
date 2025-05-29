import { Category } from "./category";
export interface Technique {
  id: any;
  name: string;
  kv: number;
  mas: number;
  ma: number;
  distance: number;
  category?: any;
  fullName?:string;
}
