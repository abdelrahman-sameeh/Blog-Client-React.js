import { useEffect, useState } from "react";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IFriendRequest } from "../../../utils/interfaces/friend-request.interface";
import { LoadingButton } from "../../../components/utils/LoadingButton";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import { Image } from "react-bootstrap";
import notify from "../../../components/utils/Notify";
import type { IPagination } from "../../../utils/interfaces/pagination-interface";
import { PaginationComp } from "../../../components/utils/PaginationComp";

export const FriendRequestPage = () => {
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<IPagination>({});
  const [friendRequests, setFriendRequests] = useState<IFriendRequest[]>([]);
  const [loadings, setLoadings] = useState<any>({});

  const limit = 10;

  const fetchFriendRequests = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.sendCancelGetRequest(`?page=${page}&limit=${limit}`),
      "GET"
    );
    setPagination(response?.data?.pagination);
    setFriendRequests(response?.data?.data?.friendrequests);
  };

  useEffect(() => {
    fetchFriendRequests();
  }, [page, limit]);

  const handleFriendRequest = async (
    fr: IFriendRequest,
    action: "accept" | "reject"
  ) => {
    setLoadings((prev: any) => ({ ...prev, [action]: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.acceptRejectFriendRequest(fr._id, action),
      "POST"
    );

    setFriendRequests((prev) => prev.filter((f) => f._id !== fr._id));

    if (response?.status === 201) {
      notify(
        action === "accept" ? "Accepted successfully" : "Rejected successfully"
      );
      setPage(1);
    }

    setLoadings((prev: any) => {
      const newState = { ...prev };
      delete newState[action];
      return newState;
    });
  };

  return (
    <main className="main-content">
      <div className="custom-container">
        {!friendRequests?.length && (
          <div className="text-center alert alert-dark">No request sent</div>
        )}
        {friendRequests.map((fr) => {
          return (
            <div
              key={fr._id}
              className="border p-3 rounded d-flex justify-content-between align-items-center mt-2"
            >
              <div className="d-flex align-items-center gap-2">
                {fr?.sender?.picture ? (
                  <Image
                    src={fr?.sender?.picture}
                    className="object-fit-cover rounded-circle user-select-none"
                    width={50}
                    height={50}
                  />
                ) : (
                  <span
                    className="border rounded-circle d-flex justify-content-center align-items-center fs-1 user-select-none bg-secondary text-light"
                    style={{ width: "50px", height: "50px" }}
                  >
                    {fr?.sender.firstName?.[0]}{" "}
                  </span>
                )}
                <div>
                  <p className="mb-0">
                    {fr?.sender?.firstName} {fr?.sender?.lastName}
                  </p>
                </div>
              </div>
              <div>
                <LoadingButton
                  variant="outline-dark"
                  title={"Accept friend request"}
                  onClick={() => handleFriendRequest(fr, "accept")}
                  loading={loadings["accept"]}
                >
                  <GiCheckMark />
                </LoadingButton>
                <LoadingButton
                  variant="outline-danger"
                  className="ms-2"
                  title={"Reject friend request"}
                  onClick={() => handleFriendRequest(fr, "reject")}
                  loading={loadings["reject"]}
                >
                  <GiCrossMark />
                </LoadingButton>
              </div>
            </div>
          );
        })}

        <PaginationComp
          setPage={setPage}
          page={page}
          pages={pagination.pages}
        />
      </div>
    </main>
  );
};
