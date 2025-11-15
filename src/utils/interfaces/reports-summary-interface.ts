import type { IArticle } from "./article.interface";
import type { IReport } from "./report-interface";

export interface IReportSummary {
  _id?: string;
  reportsCount?: number;
  numberOfPendingReports?: number;
  article?: IArticle;
  lastReport?: IReport;
}