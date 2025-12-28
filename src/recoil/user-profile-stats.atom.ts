import { atom } from "recoil";
import type { IUserProfileStats } from "../utils/interfaces/user-profile-stats.interface";

export const userProfileStatsAtom = atom<IUserProfileStats>({
  key: "userProfileStatsAtom",
  default: {}
})