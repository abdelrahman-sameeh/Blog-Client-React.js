import { atom } from "recoil";
import type { IReportSummary } from "../utils/interfaces/reports-summary-interface";



export const reportsSummaryAtom = atom<IReportSummary[]>({
  key: "articlesReports",
  default: []
})
