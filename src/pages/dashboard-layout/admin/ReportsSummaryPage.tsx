import { useRecoilState } from "recoil";
import { reportsSummaryAtom } from "../../../recoil/reports-summary-atom";
import { useEffect, useState } from "react";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IPagination } from "../../../utils/interfaces/pagination-interface";
import { Badge, Image, Table } from "react-bootstrap";
import { PaginationComp } from "../../../components/utils/PaginationComp";
import { useNavigate } from "react-router-dom";

export const ReportsSummaryPage = () => {
  const [pagination, setPagination] = useState<IPagination>({});
  const [page, setPage] = useState(1);
  const [reportsSummary, setReportsSummary] =
    useRecoilState(reportsSummaryAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const query = () => {
        let query = "?";
        query += `page=${page}`;
        return query;
      };

      const response = await authAxios(
        true,
        ApiEndpoints.getReportsSummary(query())
      );
      setPagination(response?.data?.pagination);
      setReportsSummary(response?.data?.data);
    };
    fetchData();
  }, [page]);

  return (
    <div className=" mt-4">
      <h3 className="mb-4">Articles Reports Summary</h3>

      <Table bordered hover responsive className="align-middle shadow-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Article</th>
            <th>Author</th>
            <th>Reports</th>
            <th>Pending</th>
            <th>Last Status</th>
            <th>Last Reported</th>
          </tr>
        </thead>
        <tbody>
          {reportsSummary?.map((item, index) => (
            <tr
              onClick={() => navigate(`/dashboard/admin/article/${item?.article?._id}/reports`)}
              key={item?.article?._id}
              className="pointer"
            >
              <td>{index + 1}</td>

              <td title={item?.article?.title}>
                <div className="text-truncate-2" style={{ maxWidth: "250px" }}>
                  {item?.article?.title}
                </div>
              </td>

              <td>
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src={item?.article?.user?.picture}
                    roundedCircle
                    width={32}
                    height={32}
                    alt="user"
                  />
                  <span>
                    {item?.article?.user?.firstName}{" "}
                    {item?.article?.user?.lastName}
                  </span>
                </div>
              </td>

              <td>{item.reportsCount}</td>

              <td>
                {(item?.numberOfPendingReports || 0) > 0 ? (
                  <Badge bg="warning" text="dark">
                    {item.numberOfPendingReports}
                  </Badge>
                ) : (
                  <Badge bg="secondary">0</Badge>
                )}
              </td>

              <td>
                <Badge
                  bg={
                    item?.lastReport?.status === "pending"
                      ? "warning"
                      : item?.lastReport?.status === "approved"
                      ? "success"
                      : "danger"
                  }
                >
                  {item?.lastReport?.status}
                </Badge>
              </td>

              <td>
                {new Date(
                  item?.lastReport?.createdAt || new Date()
                ).toLocaleDateString("en-GB")}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PaginationComp
        page={pagination.page}
        pages={pagination.pages}
        setPage={setPage}
      />
    </div>
  );
};
