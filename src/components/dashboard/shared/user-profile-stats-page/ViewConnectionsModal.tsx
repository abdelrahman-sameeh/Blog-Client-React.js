import { Button, Modal, Spinner } from "react-bootstrap";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import authAxios from "../../../../api/auth-axios";
import { ApiEndpoints } from "../../../../api/api-endpoints";
import { useEffect, useState } from "react";
import {
  activeTapAtom,
  type ActiveTabType,
} from "../../../../recoil/active-tap.atom";
import { connectionsAtom } from "../../../../recoil/connection.atom";
import { paginationAtom } from "../../../../recoil/pagination.atom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { userProfileStatsAtom } from "../../../../recoil/user-profile-stats.atom";

const apiMap = {
  followers: "getFollowers",
  following: "getFollowing",
  "followers-only": "getFollowersOnly",
  "following-only": "getFollowingOnly",
  "pending-requests-sent": "pendingRequestsSent",
};

export const ViewConnectionsModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [loadings, setLoadings] = useState<Map<string, boolean>>(new Map());
  const [connections, setConnections] = useRecoilState(connectionsAtom);
  const [pagination, setPagination] = useRecoilState(paginationAtom);
  const activeTab = useRecoilValue(activeTapAtom);
  const setUserProfileStats = useSetRecoilState(userProfileStatsAtom);

  const limit = 10;

  const fetchConnections = async (activeTab: ActiveTabType) => {
    const endpointKey = apiMap[activeTab];
    setLoadings((prev) => new Map(prev).set("fetch", true));
    const response = await authAxios(
      true,
      (ApiEndpoints as any)[endpointKey](`?page=${page}&limit=${limit}`)
    );
    setLoadings((prev) => {
      const newMap = new Map(prev);
      newMap.delete("fetch");
      return newMap;
    });
    if (response?.status == 200) {
      const newData = response.data.data;
      setConnections((prev) => (page === 1 ? newData : [...prev, ...newData]));
      setPagination(response?.data?.pagination);
    }
  };

  useEffect(() => {
    if (show) {
      fetchConnections(activeTab);
    }
  }, [show, activeTab, page]);

  const handleFollow = async (userId: string) => {
    const response = await authAxios(true, ApiEndpoints.follow, "POST", {
      following: userId,
    });

    if (response.status === 201) {
      setConnections((prev) => prev.filter((c) => c._id != userId));
      setUserProfileStats((prev) => ({
        ...prev,
        followersCount: (prev?.followersCount || 0) + 1,
        followersOnlyCount: (prev?.followersOnlyCount || 0) - 1,
      }));
    }
  };

  const handleUnFollow = async (userId: string) => {
    const response = await authAxios(true, ApiEndpoints.unfollow, "POST", {
      following: userId,
    });

    if (response.status === 201) {
      setConnections((prev) => prev.filter((c) => c._id != userId));
      setUserProfileStats((prev) => ({
        ...prev,
        followersCount: (prev.followersCount || 1) - 1,
        followingOnlyCount: (prev.followingOnlyCount || 1) - 1,
      }));
    }
  };

  const handleSendCancelRequest = async (
    token: "send" | "cancel",
    userId: string
  ) => {
    const data = {
      receiver: userId,
    };

    const friendRequest = await authAxios(
      true,
      ApiEndpoints.sendCancelGetRequest(),
      token == "send" ? "POST" : "DELETE",
      data
    );

    if (friendRequest.status == 201 || friendRequest.status == 204) {
      setConnections((prev) => prev.filter((c) => c._id != userId));
    }

    // Send friend request
    if (friendRequest.status == 201) {
      setUserProfileStats((prev) => ({
        ...prev,
        pendingFriendRequestSentCount: (prev.pendingFriendRequestSentCount || 0) + 1,
        followersOnlyCount: (prev.followersOnlyCount || 1) - 1,
      }));
    }

    // Cancel friend request
    if (friendRequest.status == 204) {
      setUserProfileStats((prev) => ({
        ...prev,
        pendingFriendRequestSentCount: (prev.pendingFriendRequestSentCount || 1) - 1,
      }));
    }
  };

  return (
    <Modal show={show} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Connections</Modal.Title>
      </Modal.Header>
      <Modal.Body
        id="modal-body"
        style={{ height: "350px", overflowY: "auto" }}
      >
        <InfiniteScroll
          dataLength={connections.length}
          next={() => {
            setPage((prev) => prev + 1);
          }}
          hasMore={(pagination.page as any) < (pagination.pages as any)}
          loader={
            <div className="text-center py-2">
              <Spinner animation="border" size="sm" />
            </div>
          }
          scrollableTarget="modal-body"
        >
          {connections.map((user) => (
            <div
              key={user._id}
              className="d-flex align-items-center justify-content-between p-2 border-bottom"
              style={{ height: "60px" }}
            >
              <Link
                to={`/writer/${user._id}`}
                className="d-flex align-items-center text-decoration-none text-dark flex-grow-1"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.username}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.username?.[0]}
                  </div>
                )}
                <div className="ms-2">
                  <div className="fw-bold">{user.username}</div>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              </Link>

              {/* الجزء الخاص بالـ Buttons */}
              <div className="ms-2">
                {activeTab === "pending-requests-sent" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    onClick={() =>
                      handleSendCancelRequest("cancel", user._id as string)
                    }
                  >
                    Cancel Request
                  </Button>
                )}
                {activeTab === "followers-only" &&
                user?.visibility == "public" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => handleFollow(user._id as string)}
                  >
                    Follow
                  </Button>
                ) : (
                  activeTab === "followers-only" &&
                  user?.visibility == "private" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        handleSendCancelRequest("send", user._id as string)
                      }
                    >
                      Send Request
                    </Button>
                  )
                )}
                {activeTab === "following-only" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleUnFollow(user._id as string)}
                  >
                    Unfollow
                  </Button>
                )}
              </div>
            </div>
          ))}
        </InfiniteScroll>
        {connections.length === 0 && !loadings.get("fetch") && (
          <p className="text-center">No connections found.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={() => {
            setPage(1);
            setConnections([]);
            setPagination({});
            handleClose();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
