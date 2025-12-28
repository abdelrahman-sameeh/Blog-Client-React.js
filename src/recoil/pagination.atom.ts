import { atom } from "recoil";
import type { IPagination } from "../utils/interfaces/pagination-interface";

export const paginationAtom = atom<IPagination>({
  key: "paginationAtom",
  default: {}
})