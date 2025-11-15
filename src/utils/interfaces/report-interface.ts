import type { IUser } from "./user-interface";

export interface IReportReason {
  _id?: string;
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export type ReportStatusType = "pending" | "approved" | "rejected"

export interface IReport {
  _id?: string;
  reporter?: IUser;
  reason?: IReportReason;
  description?:string
  status?: ReportStatusType,
  createdAt?: Date;
  updatedAt?: Date;
}