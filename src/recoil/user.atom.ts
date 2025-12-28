import { atom } from "recoil";
import type { IUser } from "../utils/interfaces/user-interface";

export const userAtom = atom<IUser>({
  key: "userAtom",
  default: {}
}) 