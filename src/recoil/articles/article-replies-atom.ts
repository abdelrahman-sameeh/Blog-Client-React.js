import { atom } from "recoil";



export const articleReplies = atom<{ [key: string]: any[] }>({
  key: "articleReplies",
  default: {}
})
