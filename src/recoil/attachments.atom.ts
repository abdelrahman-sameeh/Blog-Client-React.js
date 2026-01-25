import { atom } from "recoil";



export const attachmentsAtom = atom<{ file: any, type: "image" | "video" | "document" }[]>({
  key: "attachment-atom",
  default: []
})