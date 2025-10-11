import { atom } from "recoil";
import type { ITag } from "../utils/interfaces/tag-interface";

export const tagsAtom = atom<ITag[]>({
  key: "tags",
  default: []
})

