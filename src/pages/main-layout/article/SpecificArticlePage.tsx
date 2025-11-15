import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import { useRecoilState } from "recoil";
import { articleAtom } from "../../../recoil/articles/article-atom";
import notify from "../../../components/utils/Notify";
import { PiHandsClapping } from "react-icons/pi";
import { FaBookmark, FaRegBookmark, FaRegComment } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { LoadingButton } from "../../../components/utils/LoadingButton";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MdOutlineCategory } from "react-icons/md";
import { Button, Dropdown, Form } from "react-bootstrap";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useModal } from "../../../hooks/useModal";
import { ArticleCommentsComponent } from "../../../components/main-layout/specific-article-page/ArticleCommentsComponent";
import { ReportModal } from "../../../components/main-layout/specific-article-page/ReportModal";

export const SpecificArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useRecoilState(articleAtom);
  const navigate = useNavigate();
  const { user } = useLoggedInUser();
  const [loading, setLoading] = useState({
    reactionLoading: false,
    bookmarkLoading: false,
    commentLoading: false,
  });
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const reportModal = useModal();

  useEffect(() => {
    const getArticleDetails = async () => {
      const response = await authAxios(
        true,
        ApiEndpoints.getDeleteArticle(id as string)
      );
      if (response.status !== 200) {
        notify("Invalid article id", "error", 2000);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      setArticle(response?.data?.data);
    };

    getArticleDetails();
  }, []);

  const handleLike = async () => {
    const newLikes = [
      ...(article.likes || []),
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    ];
    if (user.picture) {
      newLikes[newLikes.length - 1]["picture"] = user.picture;
    }
    setArticle((prev) => ({ ...prev, likes: newLikes }));

    setLoading((prev) => ({ ...prev, reactionLoading: true }));
    await authAxios(true, ApiEndpoints.likeArticle(id as string), "PATCH");
    setLoading((prev) => ({ ...prev, reactionLoading: false }));
  };

  const handleDislike = async () => {
    const newLikes = article.likes?.filter((u) => u._id != user._id);
    setArticle((prev) => ({ ...prev, likes: newLikes }));

    setLoading((prev) => ({ ...prev, reactionLoading: true }));
    await authAxios(true, ApiEndpoints.dislikeArticle(id as string), "PATCH");
    setLoading((prev) => ({ ...prev, reactionLoading: false }));
  };

  const handleSave = async () => {
    setArticle((prev) => ({ ...prev, isSavedArticle: true }));

    setLoading((prev) => ({ ...prev, bookmarkLoading: true }));
    const data = {
      articles: [id],
    };
    await authAxios(true, ApiEndpoints.saveArticle, "POST", data);
    setLoading((prev) => ({ ...prev, bookmarkLoading: false }));
  };

  const handleUnsave = async () => {
    setArticle((prev) => ({ ...prev, isSavedArticle: false }));

    setLoading((prev) => ({ ...prev, bookmarkLoading: true }));
    const data = {
      articles: [id],
    };
    await authAxios(true, ApiEndpoints.unsaveArticle, "DELETE", data);
    setLoading((prev) => ({ ...prev, bookmarkLoading: false }));
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      notify("Comment is required", "warning");
      return;
    }
    const data = {
      article: id,
      content: comment,
    };
    setLoading((prev) => ({ ...prev, commentLoading: true }));
    const response = await authAxios(
      true,
      ApiEndpoints.createComment,
      "POST",
      data
    );
    setLoading((prev) => ({ ...prev, commentLoading: false }));

    if (response.status === 201) {
      const data = {
        ...response.data.data,
        author: user,
      };
      setArticle((prev) => ({
        ...prev,
        comments: [...(prev?.comments as any), data],
      }));
      setComment("");
    }
  };

  return (
    <main className="main-content">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="fw-bold text-capitalize">{article?.title}</h2>
          {article?.category?.title && (
            <h5 className="text-capitalize">
              <MdOutlineCategory /> {article.category?.title}
            </h5>
          )}
        </div>

        {/* Writer */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link
            to="user"
            className="text-dark text-decoration-none d-flex align-items-center gap-2 flex-wrap"
          >
            {article?.user?.picture ? (
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={article?.user.picture}
              />
            ) : (
              <p
                style={{ width: "50px", height: "50px" }}
                className="d-flex justify-content-center align-items-center border m-0 rounded-full border-dark text-uppercase"
              >
                {article?.user?.firstName?.[0]}
                {article?.user?.lastName?.[0]}{" "}
              </p>
            )}
            {`${article?.user?.firstName} ${article?.user?.lastName}`}
          </Link>
          <span className="small text-secondary">
            {article?.createdAt
              ? new Date(article?.createdAt as Date).toLocaleDateString(
                  "en-GB",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "Now"}
          </span>
        </div>

        <hr />

        {/* Likes, bookmark and report article */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-4">
            <div className="likes">
              {(() => {
                const isLiked = article.likes?.some((userLike) => {
                  return userLike._id == user._id;
                });
                return (
                  <div title={user._id ? "" : "Login to make this action"}>
                    {isLiked ? (
                      <LoadingButton
                        loading={loading.reactionLoading}
                        disabled={loading.reactionLoading || !user._id}
                        onClick={handleDislike}
                        className="bg-transparent text-dark border-0 p-0 mb-2"
                      >
                        <FaHandsClapping
                          className="fs-5 pointer"
                          title="Clap"
                        />
                      </LoadingButton>
                    ) : (
                      <LoadingButton
                        loading={loading.reactionLoading}
                        disabled={loading.reactionLoading || !user._id}
                        // title={"Login to make this action"}
                        onClick={handleLike}
                        className="bg-transparent text-dark border-0 p-0 m-0"
                      >
                        <PiHandsClapping
                          className="fs-5 pointer"
                          title="Clap"
                        />
                      </LoadingButton>
                    )}
                    <span className="ms-2 pointer" title="Claps">
                      {article?.likes?.length}
                    </span>
                  </div>
                );
              })()}
            </div>
            <div className="comments text-secondary pointer" title="Comments">
              <FaRegComment className="fs-5" />
              <span className="ms-2">{article?.comments?.length} </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div
              className="pointer"
              title={user._id ? "Save" : "Login to make this action"}
            >
              {article.isSavedArticle ? (
                <LoadingButton
                  loading={loading.bookmarkLoading}
                  disabled={loading.bookmarkLoading || !user._id}
                  onClick={handleUnsave}
                  className="bg-transparent text-dark border-0 p-0"
                >
                  <FaBookmark className="fs-4" />
                </LoadingButton>
              ) : (
                <LoadingButton
                  loading={loading.bookmarkLoading}
                  disabled={loading.bookmarkLoading || !user._id}
                  onClick={handleSave}
                  className="bg-transparent text-dark border-0 p-0"
                >
                  <FaRegBookmark className="fs-4" />
                </LoadingButton>
              )}
            </div>

            <Dropdown>
              <Dropdown.Toggle
                bsPrefix="custom-toggle"
                variant="outline-light"
                className="text-dark bg-none p-1"
                id="dropdown-basic"
              >
                <HiOutlineDotsHorizontal />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="mt-1">
                <Dropdown.Item onClick={reportModal.open}>
                  Report This Article
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <hr />

        {/* Blocks */}
        <div>
          {article?.blocks?.map((articleBlock) => {
            return (
              <div key={articleBlock?.order}>
                {articleBlock?.type == "text" && (
                  <p className="mt-3 mb-0">{articleBlock?.data}</p>
                )}
                {articleBlock.type == "image" && (
                  <img
                    className="mt-3"
                    style={{ width: "100%" }}
                    src={articleBlock.data}
                  />
                )}
                {articleBlock.type == "video" && (
                  <video
                    className="mt-3"
                    controls
                    style={{ width: "100%", borderRadius: "20px" }}
                    src={articleBlock.data}
                  ></video>
                )}

                {articleBlock.type == "code" && (
                  <SyntaxHighlighter
                    className="rounded mt-3 p-3"
                    language={articleBlock?.lang || "javascript"}
                    style={docco}
                  >
                    {articleBlock.data}
                  </SyntaxHighlighter>
                )}
              </div>
            );
          })}
        </div>

        <hr />

        <div>
          {/* Tags */}
          {article?.tags?.map((item, index) => {
            return (
              <span key={index} className="ms-2 fw-bold">
                #{item?.title}
              </span>
            );
          })}
        </div>

        <hr />

        {/* Comments */}
        <div className="mb-3">
          <h4>Comments ({article.comments?.length}) </h4>
          {user?._id ? (
            <>
              <div className="text-dark text-decoration-none d-flex align-items-center gap-2 flex-wrap">
                {user?.picture ? (
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    src={user.picture}
                  />
                ) : (
                  <p className="border m-0 rounded-full px-2 py-2 border-dark text-uppercase">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}{" "}
                  </p>
                )}
                <span className="text-capitalize">{user?.username}</span>
              </div>
              <Form
                onClick={() => setShowForm(true)}
                className={`mt-2 mb-4 comment-form ${
                  showForm ? "show" : "hide"
                } rounded`}
              >
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    style={{
                      resize: "none",
                      backgroundColor: "#f2f2f2",
                      borderBottomRightRadius: "0",
                      borderBottomLeftRadius: "0",
                    }}
                    className="shadow-none border-0"
                    as="textarea"
                    rows={5}
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    placeholder="What are you thoughts?"
                  />
                </Form.Group>
                <div
                  className="d-flex gap-2 p-3"
                  style={{
                    flexDirection: "row-reverse",
                    marginTop: "-3px",
                    backgroundColor: "#f2f2f2",
                    borderBottomRightRadius: "6px",
                    borderBottomLeftRadius: "6px",
                  }}
                >
                  <LoadingButton
                    onClick={handleCreateComment}
                    type="submit"
                    className={`text-capitalize`}
                    disabled={!comment.length || loading.commentLoading}
                    loading={loading.commentLoading}
                    variant="dark"
                    tabIndex={0}
                  >
                    comment
                  </LoadingButton>
                  <Button
                    type="button"
                    onClick={() => {
                      setComment("");
                    }}
                    disabled={
                      (!comment.length ? true : false) || loading.commentLoading
                    }
                    className={`text-capitalize`}
                    variant="danger"
                  >
                    reset
                  </Button>
                </div>
              </Form>
            </>
          ) : (
            ""
          )}
          <hr />

          <ArticleCommentsComponent />
        </div>
      </div>

      <ReportModal show={reportModal.isOpen} handleClose={reportModal.close} />
    </main>
  );
};
