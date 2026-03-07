import { atom } from "recoil";
import type { IUser } from "../utils/interfaces/user-interface";

export const receiverAtom = atom<Partial<IUser>>({
  key: "receiver-atom",
  default: {}
})