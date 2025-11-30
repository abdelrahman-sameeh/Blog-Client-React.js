import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IUser } from "../../../utils/interfaces/user-interface";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { Image } from "react-bootstrap";
import { LoadingButton } from "../../../components/utils/LoadingButton";
import notify from "../../../components/utils/Notify";
import { useModal } from "../../../hooks/useModal";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArticleCardComponent } from "../../../components/main-layout/search-articles-page/ArticleCardComponent";
import { DeleteArticleModalComponent } from "../../../components/main-layout/search-articles-page/DeleteArticleModalComponent";
import type { IArticle } from "../../../utils/interfaces/article.interface";

export const WriterProfilePage = () => {
  const { id } = useParams();
  const { user } = useLoggedInUser();
  const [writer, setWriter] = useState<IUser>({});
  const [relationship, setRelationship] = useState<{
    followers: string[];
    blockers: string[];
  }>({
    followers: [],
    blockers: [],
  });
  const [loadings, setLoadings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchWriter = async (id: string) => {
      const response = await authAxios(
        user?._id ? true : false,
        ApiEndpoints.getWriter(id)
      );
      setWriter(response?.data?.writer);
      setRelationship({
        followers: response?.data?.followers,
        blockers: response?.data?.blockers,
      });
    };
    fetchWriter(id as string);
  }, [user]);

  const [articles, setArticles] = useState<IArticle[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const deleteArticleModal = useModal();

  const fetchArticles = async () => {
    let responseData: any = [];
    const response = await authAxios(
      true,
      ApiEndpoints.getArticlesByWriter(id as string, `?limit=3&page=${page}`)
    );
    responseData = response?.data?.data?.articles || [];

    setArticles((prev) => [...prev, ...responseData]);
    if (responseData.length === 0) setHasMore(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleFollow = async () => {
    setLoadings((prev: any) => ({ ...prev, follow: true }));

    const response = await authAxios(true, ApiEndpoints.follow, "POST", {
      following: id,
    });

    if (response.status == 201) {
      setRelationship((prev: any) => ({
        ...prev,
        followers: [...prev.followers, user._id],
        blockers: prev.blockers.filter((id: any) => id != user._id),
      }));
      notify("You are followed writer successfully");
    } else {
      notify("Something went wring", "error");
    }

    setLoadings((prev: any) => {
      delete prev["follow"];
      return {
        ...prev,
      };
    });
  };

  const handleUnfollow = async () => {
    setLoadings((prev: any) => ({ ...prev, unfollow: true }));

    const response = await authAxios(true, ApiEndpoints.unfollow, "POST", {
      following: id,
    });

    if (response.status == 201) {
      setRelationship((prev: any) => ({
        ...prev,
        followers: prev.followers.filter((id: any) => id != user._id),
        blockers: prev.blockers.filter((id: any) => id != user._id),
      }));
      notify("You are unfollowed writer successfully");
    } else {
      notify("Something went wring", "error");
    }

    setLoadings((prev: any) => {
      delete prev["unfollow"];
      return {
        ...prev,
      };
    });
  };

  const handleBlock = async () => {
    setLoadings((prev: any) => ({ ...prev, block: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.block(id as string),
      "PATCH"
    );

    if (response.status == 200) {
      setRelationship((prev: any) => ({
        ...prev,
        blockers: [...prev.blockers, user._id],
        followers: prev.followers.filter((e: any) => e !== user._id), // remove from followers
      }));
      notify("You are blocked writer successfully");
    } else {
      notify("Something went wring", "error");
    }

    setLoadings((prev: any) => {
      delete prev["block"];
      return {
        ...prev,
      };
    });
  };

  const handleUnblock = async () => {
    setLoadings((prev: any) => ({ ...prev, unblock: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.unblock(id as string),
      "PATCH"
    );

    if (response.status == 200) {
      setRelationship((prev: any) => ({
        ...prev,
        followers: [...prev.followers, user._id],
        blockers: prev.blockers.filter((e: any) => e !== user._id),
      }));
      notify("You are unblocked writer successfully");
    } else {
      notify("Something went wring", "error");
    }

    setLoadings((prev: any) => {
      delete prev["unblock"];
      return {
        ...prev,
      };
    });
  };

  return (
    <main className="main-content">
      <div className="custom-container">
        <div className=" border-bottom border-secondary pb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              {writer.picture ? (
                <Image
                  src={writer.picture}
                  className="object-fit-cover rounded-full user-select-none"
                  width={100}
                  height={100}
                />
              ) : (
                <span
                  className="border rounded-full d-flex justify-content-center align-items-center fs-1 user-select-none bg-secondary text-light"
                  style={{ width: "100px", height: "100px" }}
                >
                  {writer.firstName?.[0]}{" "}
                </span>
              )}
              <div>
                <p className="mb-0">
                  {writer?.firstName} {writer?.lastName}
                </p>
                <p className="mb-0 text-muted small">@{writer?.username}</p>
              </div>
            </div>
            {/* controls */}

            {user?._id !== writer?._id ? (
              user?._id ? (
                <div className="d-flex gap-2">
                  {/* لو مش تابعين ومفيش block */}
                  {!relationship?.followers?.length &&
                    !relationship?.blockers?.length && (
                      <LoadingButton
                        loading={loadings?.follow}
                        onClick={handleFollow}
                        variant="outline-primary"
                      >
                        Follow
                      </LoadingButton>
                    )}

                  {/* لو أنا تابعت writer ومفيش block */}
                  {relationship?.followers?.includes(user._id) &&
                    !relationship?.blockers?.includes(id as string) && (
                      <>
                        <LoadingButton variant="outline-dark">
                          Chat
                        </LoadingButton>
                        <LoadingButton
                          loading={loadings?.unfollow}
                          onClick={handleUnfollow}
                          variant="outline-danger"
                        >
                          Unfollow
                        </LoadingButton>
                        <LoadingButton
                          loading={loadings?.block}
                          onClick={handleBlock}
                          variant="outline-danger"
                        >
                          Block
                        </LoadingButton>
                      </>
                    )}

                  {/* لو انا عامل block */}
                  {relationship?.blockers?.includes(user._id) && (
                    <LoadingButton
                      loading={loadings?.unblock}
                      onClick={handleUnblock}
                      variant="outline-primary"
                    >
                      Unblock
                    </LoadingButton>
                  )}

                  {/* لو الاتنين موجودين: أنا تابعت والكاتب عامل block */}
                  {relationship?.followers?.length > 0 &&
                    relationship?.blockers?.length > 0 && (
                      <div className="text-danger">
                        You have followed this writer but you are blocked.
                      </div>
                    )}

                  {!relationship?.followers?.includes(user._id) &&
                    relationship?.blockers?.includes(id as string) && (
                      <div className="text-danger">
                        {writer.firstName} blocked you.
                      </div>
                    )}
                </div>
              ) : (
                <div className="d-flex align-items-end flex-column justify-content-center">
                  <Link
                    to={"/login"}
                    title="You must be logged in to follow this writer."
                  >
                    Login
                  </Link>
                  <div
                    className="mt-2 text-danger "
                    style={{ fontSize: "0.9rem" }}
                  >
                    You must be logged in to follow this writer.
                  </div>
                </div>
              )
            ) : (
              <></>
            )}
          </div>
          {/* Bio */}
          <p style={{ marginLeft: "112px" }} className="mt-3 small text-muted">
            Bio Bio Bio Bio Bio
          </p>
        </div>

        {relationship?.blockers?.length ? (
          <div className="text-center p-4 alert alert-danger rounded mt-3">
            You are blocked from viewing this writer's articles.
          </div>
        ) : (
          <>
            {/* articles for this writer */}
            <InfiniteScroll
              dataLength={articles.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<p className="text-center my-3">Loading...</p>}
              endMessage={<p className="text-center my-3">No more articles</p>}
            >
              {articles.map((article) => (
                <ArticleCardComponent
                  key={article._id}
                  article={article}
                  deleteArticleModal={deleteArticleModal}
                />
              ))}
            </InfiniteScroll>

            <DeleteArticleModalComponent
              isOpen={deleteArticleModal.isOpen}
              handleClose={deleteArticleModal.close}
            />
          </>
        )}
      </div>
    </main>
  );
};
