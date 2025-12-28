import { atom } from "recoil";


export type ActiveTabType =
  | "followers"
  | "following"
  | "followers-only"
  | "following-only"
  | "pending-requests-sent";

export const activeTapAtom = atom<ActiveTabType>({
  key: "activeTapAtom",
  default: "followers",
})