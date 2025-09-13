import { atom } from "recoil";
import type { ICategory } from "../utils/interfaces/category-interface";

export const categoriesAtom = atom<ICategory[]>({
  key: 'categories',
  default: []
})