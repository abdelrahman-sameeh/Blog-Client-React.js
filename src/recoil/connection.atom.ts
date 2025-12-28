import { atom } from "recoil";
import type { IUser } from "../utils/interfaces/user-interface";

export const connectionsAtom = atom<IUser[]>({
  key: "connectionAtom",
  default: []
})