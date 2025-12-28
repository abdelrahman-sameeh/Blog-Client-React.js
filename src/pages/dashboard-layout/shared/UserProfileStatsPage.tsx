import { useEffect, useRef, useState } from "react";
import { Button, Badge, Spinner } from "react-bootstrap";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import { Link } from "react-router-dom";
import notify from "../../../components/utils/Notify";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { useModal } from "../../../hooks/useModal";
import { UpdateInfoModal } from "../../../components/dashboard/shared/user-profile-stats-page/UpdateInfoModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userProfileStatsAtom } from "../../../recoil/user-profile-stats.atom";
import { paginationAtom } from "../../../recoil/pagination.atom";
import { connectionsAtom } from "../../../recoil/connection.atom";
import { ViewConnectionsModal } from "../../../components/dashboard/shared/user-profile-stats-page/ViewConnectionsModal";
import { activeTapAtom } from "../../../recoil/active-tap.atom";

export const UserProfileStatsPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loadings, setLoadings] = useState<Record<string, boolean>>({});
  const { setUser } = useLoggedInUser();
  const updateInfoModal = useModal();
  const [userProfileStats, setUserProfileStats] =
    useRecoilState(userProfileStatsAtom);
  const connectionsModal = useModal();

  const setActiveTab = useSetRecoilState(activeTapAtom);
  const setPagination = useSetRecoilState(paginationAtom);
  const setConnections = useSetRecoilState(connectionsAtom);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // optional validation
    if (file.size > 2 * 1024 * 1024) {
      notify("Max image size is 2MB", "warning");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    // 🔥 هنا بعد كده تبعت الصورة للسيرفر
    const data = { picture: file };

    setLoadings((prev) => ({ ...prev, uploadImage: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.changeProfileImage,
      "PATCH",
      data,
      "multipart/form-data"
    );
    setLoadings((prev) => {
      const data = { ...prev };
      delete data["uploadImage"];
      return data;
    });

    if (response.status == 200) {
      notify("profile picture changed successfully");
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (user?._id) {
        user.picture = response.data.picture;
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser((prev) => ({ ...prev, picture: response.data.picture }));
      }
    } else {
      notify("something went wrong", "error");
    }
  };

  const getUserProfileStats = async () => {
    const response = await authAxios(true, ApiEndpoints.getUserProfileStats);
    setUserProfileStats(response?.data);
  };

  useEffect(() => {
    getUserProfileStats();
  }, []);

  const handelSelectFollowers = () => {
    setConnections([]);
    setPagination({});
    setActiveTab("followers");
    connectionsModal.open();
  };

  const handelSelectFollowing = () => {
    setConnections([]);
    setPagination({});
    setActiveTab("following");
    connectionsModal.open();
  };

  const handelSelectFollowersOnly = () => {
    setConnections([]);
    setPagination({});
    setActiveTab("followers-only");
    connectionsModal.open();
  };

  const handelSelectFollowingOnly = () => {
    setConnections([]);
    setPagination({});
    setActiveTab("following-only");
    connectionsModal.open();
  };

  const handleSelectPendingRequestSent = () => {
    setConnections([]);
    setPagination({});
    setActiveTab("pending-requests-sent");
    connectionsModal.open();
  };

  return (
    <div className="user-profile-stats custom-container mt-4">
      <div className="d-flex gap-5 align-items-start">
        {/* الصورة */}
        <div
          className="image pointer position-relative"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          {preview || userProfileStats?.user?.picture ? (
            <img
              width={100}
              height={100}
              className="object-fit-cover rounded-circle border"
              src={preview ?? userProfileStats?.user?.picture}
              alt={userProfileStats?.user?.username}
            />
          ) : (
            <div
              style={{ width: "100px", height: "100px" }}
              className="d-flex justify-content-center align-items-center rounded-circle border text-uppercase"
            >
              {userProfileStats?.user?.firstName?.[0]}{" "}
              {userProfileStats?.user?.lastName?.[0]}
            </div>
          )}

          {loadings.uploadImage && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center rounded-circle"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <Spinner animation="border" variant="light" />
            </div>
          )}
        </div>

        {/* المعلومات */}
        <div className="info w-100">
          <div className="d-flex gap-3 align-items-center">
            <span className="fw-bold fs-5">
              {userProfileStats?.user?.firstName}{" "}
              {userProfileStats?.user?.lastName}
            </span>

            <Button
              onClick={updateInfoModal.open}
              className="py-0 small"
              variant="outline-dark"
            >
              Edit
            </Button>
          </div>

          <div className="text-muted">@{userProfileStats?.user?.username}</div>
          <div className="text-muted small">{userProfileStats?.user?.bio}</div>

          {/* الإحصائيات */}
          {userProfileStats?.user?.role == "user" && (
            <>
              <div className="d-flex gap-4 mt-3">
                <Link
                  to="/dashboard/user/articles"
                  className="text-decoration-none text-dark"
                >
                  <strong className="pointer">
                    {userProfileStats?.numberOfArticlesForUser}
                  </strong>
                  <div className="small pointer text-muted">Articles</div>
                </Link>

                <div>
                  <strong onClick={handelSelectFollowers} className="pointer">
                    {userProfileStats?.followersCount}
                  </strong>
                  <div
                    onClick={handelSelectFollowers}
                    className="small pointer text-muted"
                  >
                    Followers
                  </div>
                </div>

                <div>
                  <strong onClick={handelSelectFollowing} className="pointer">
                    {userProfileStats?.followingCount}
                  </strong>
                  <div
                    onClick={handelSelectFollowing}
                    className="small pointer text-muted"
                  >
                    Following
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-3">
                <div>
                  <strong
                    onClick={handleSelectPendingRequestSent}
                    className="pointer"
                  >
                    {userProfileStats?.pendingFriendRequestSentCount}
                  </strong>
                  <div
                    onClick={handleSelectPendingRequestSent}
                    className="small text-muted pointer"
                  >
                    Friend request <br /> (I sent not response)
                  </div>
                </div>
                <div>
                  <strong
                    onClick={handelSelectFollowersOnly}
                    className="pointer"
                  >
                    {userProfileStats?.followersOnlyCount}
                  </strong>
                  <div
                    onClick={handelSelectFollowersOnly}
                    className="small pointer text-muted"
                  >
                    Followers only <br /> (I don’t follow)
                  </div>
                </div>
                <div>
                  <strong
                    onClick={handelSelectFollowingOnly}
                    className="pointer"
                  >
                    {userProfileStats?.followingOnlyCount}
                  </strong>
                  <div
                    onClick={handelSelectFollowingOnly}
                    className="small pointer text-muted"
                  >
                    Following only <br /> (not following me)
                  </div>
                </div>
              </div>

              {/* الاهتمامات */}
              <div className="mt-4 d-flex flex-wrap gap-2">
                {userProfileStats?.user?.preferences?.map((pref, index) => {
                  if (typeof pref === "string") return null;
                  return (
                    <Badge bg="secondary" key={pref._id ?? index}>
                      {pref.title}
                    </Badge>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <UpdateInfoModal
        show={updateInfoModal.isOpen}
        handleClose={updateInfoModal.close}
      />

      <ViewConnectionsModal
        show={connectionsModal.isOpen}
        handleClose={connectionsModal.close}
      />
    </div>
  );
};
