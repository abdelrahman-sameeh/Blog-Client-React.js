import { atom } from "recoil";
import type { IMessage } from "../utils/interfaces/message.interface";

export const messagesAtom = atom<IMessage[]>({
  key: 'messagesAtom',
  default: []
})