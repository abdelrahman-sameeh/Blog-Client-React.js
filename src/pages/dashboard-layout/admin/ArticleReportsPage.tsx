import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import { useSetRecoilState } from "recoil";
import { articleAtom } from "../../../recoil/articles/article-atom";
import type {
  IReport,
  ReportStatusType,
} from "../../../utils/interfaces/report-interface";
import { Button, Form, Image, Table } from "react-bootstrap";
import notify from "../../../components/utils/Notify";
import { CiPlay1 } from "react-icons/ci";
import { useModal } from "../../../hooks/useModal";
import { PreviewModal } from "../../../components/dashboard/user/articles/PreviewModal";

export const ArticleReportsPage = () => {
  const { id } = useParams();
  const setArticle = useSetRecoilState(articleAtom);
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const previewModal = useModal();

  useEffect(() => {
    const fetchData = async () => {
      const response = await authAxios(
        true,
        ApiEndpoints.getArticleReport(id as string)
      );
      setArticle(response?.data?.article);
      setReports(response?.data?.reports);
    };
    fetchData();
  }, []);

  const handleChangeReportStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    report: IReport
  ) => {
    const newStatus = e.target.value;

    setLoading((prev: any) => ({ ...prev, [report._id as string]: true }));
    const data = { status: newStatus };
    const response = await authAxios(
      true,
      ApiEndpoints.changeReportStatus(report._id as string),
      "PATCH",
      data
    );

    setLoading((prev: any) => {
      delete prev[report._id as string];
      return { ...prev };
    });

    if (response.status == 200) {
      notify("Report status changed successfully");
      setReports((prev) =>
        prev.map((r) =>
          r._id === report._id
            ? { ...r, status: newStatus as ReportStatusType }
            : r
        )
      );
    } else {
      notify("Something went wrong", "error");
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <nav className="text-muted" style={{ fontSize: "14px" }}>
          Article / <span className="text-dark fw-semibold">Reports</span>
        </nav>
        <Button
          onClick={() => {
            previewModal.open();
          }}
          variant={"outline-dark"}
        >
          <CiPlay1 className="fs-5" />
          View Article
        </Button>
      </div>

      <Table hover responsive="sm" className="align-middle mt-3">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Reporter</th>
            <th>Reason</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={report._id}>
              <td>{index + 1}</td>
              <td className="d-flex justify-content-start align-items-center gap-2">
                {report.reporter?.picture ? (
                  <Image
                    src={report.reporter?.picture}
                    alt={report.reporter?.firstName}
                    style={{ objectFit: "cover" }}
                    roundedCircle
                    width={40}
                    height={40}
                  />
                ) : (
                  <span
                    style={{ width: "40px", height: "40px" }}
                    className="border d-flex justify-content-center align-items-center rounded-circle text-capitalize"
                  >
                    {report.reporter?.firstName?.[0]}
                  </span>
                )}
                <span className="text-capitalize">
                  {report.reporter?.username}
                </span>
              </td>
              <td>{report.reason?.reason}</td>
              <td>{report?.description}</td>
              <td>
                <Form.Select
                  disabled={loading[report._id as string]}
                  className="shadow-none"
                  onChange={(e) => handleChangeReportStatus(e, report)}
                  value={report.status}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </td>
              <td style={{ fontFamily: "Arial" }}>
                {new Date(report?.createdAt || new Date()).toLocaleString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  }
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PreviewModal
        isOpen={previewModal.isOpen}
        handleClose={previewModal.close}
      />
    </div>
  );
};

