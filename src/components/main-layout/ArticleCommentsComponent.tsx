import { useRecoilState, useRecoilValue } from "recoil";
import { articleAtom } from "../../recoil/articles/article-atom";
import { useLoggedInUser } from "../../hooks/useGetLoggedInUser";
import { LoadingButton } from "../utils/LoadingButton";
import { useState, type FormEvent } from "react";
import { FaHandsClapping, FaRegTrashCan } from "react-icons/fa6";
import { PiHandsClapping } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { Button, Form } from "react-bootstrap";
import authAxios from "../../api/auth-axios";
import { ApiEndpoints } from "../../api/api-endpoints";
import { articleReplies } from "../../recoil/articles/article-replies-atom";
import notify from "../utils/Notify";
import { DeleteReviewModalComponent } from "./DeleteReviewComponent";
import { useModal } from "../../hooks/useModal";

const CommentItem = ({ comment, user, level }: any) => {
  const [article, setArticle] = useRecoilState(articleAtom);
  const [replies, setReplies] = useRecoilState(articleReplies);
  const isLiked = comment.likes?.includes(user._id);
  const [loadings, setLoadings] = useState<any>({});
  const [reply, setReply] = useState("");
  const [showForm, setShowForm] = useState(false);
  const deleteReviewModal = useModal();

  const updateReplies = (
    replies: { [key: string]: any[] },
    commentId: string,
    updateFn: (c: any) => any
  ) => {
    const newReplies = { ...replies };

    for (const parentId in newReplies) {
      newReplies[parentId] = newReplies[parentId].map((c) =>
        c._id === commentId ? updateFn(c) : c
      );
    }

    return newReplies;
  };

  const handleLike = async (commentId: string) => {
    setArticle((prev: any) => ({
      ...prev,
      comments: prev.comments.map((c: any) =>
        c._id === commentId ? { ...c, likes: [...c.likes, user._id] } : c
      ),
    }));

    setReplies((prev) =>
      updateReplies(prev, commentId, (c) => ({
        ...c,
        likes: [...c.likes, user._id],
      }))
    );

    setLoadings((prev: any) => ({ ...prev, [`like-${commentId}`]: true }));
    await authAxios(true, ApiEndpoints.likeReply(commentId), "PATCH");
    setLoadings((prev: any) => {
      const newData = { ...prev };
      delete newData[`like-${commentId}`];
      return newData;
    });
  };

  const handleDislike = async (commentId: string) => {
    setArticle((prev: any) => ({
      ...prev,
      comments: prev.comments.map((c: any) =>
        c._id === commentId
          ? { ...c, likes: c.likes.filter((id: any) => id !== user._id) }
          : c
      ),
    }));

    setReplies((prev) =>
      updateReplies(prev, commentId, (c) => ({
        ...c,
        likes: c.likes.filter((id: any) => id !== user._id),
      }))
    );

    setLoadings((prev: any) => ({ ...prev, [`dislike-${commentId}`]: true }));
    await authAxios(true, ApiEndpoints.dislikeReply(commentId), "PATCH");
    setLoadings((prev: any) => {
      const newData = { ...prev };
      delete newData[`dislike-${commentId}`];
      return newData;
    });
  };

  const handleGetReplies = async (commentId: string) => {
    if (replies[commentId]) {
      setReplies((prev) => {
        const updated = { ...prev };
        delete updated[commentId];
        return updated;
      });
      return;
    }

    const response = await authAxios(
      false,
      ApiEndpoints.getReviewReplies(commentId)
    );
    setReplies((prev) => ({ ...prev, [commentId]: response.data.data }));
  };

  const handleCreateReply = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      reviewId: comment._id,
      content: reply,
    };

    setLoadings((prev: any) => ({ ...prev, [`reply-${comment._id}`]: true }));

    const response = await authAxios(
      true,
      ApiEndpoints.createReply,
      "POST",
      data
    );

    setLoadings((prev: any) => {
      const newLoadings = { ...prev };
      delete newLoadings[`reply-${comment._id}`];
      return newLoadings;
    });

    if (response.status == 201) {
      if (!replies[comment._id]) {
        const newComments = article?.comments?.map((co) =>
          co._id == comment._id ? { ...co, numberOfReplies: 1 } : co
        );
        setArticle((prev) => ({ ...prev, comments: newComments }));
        handleGetReplies(comment._id);
      } else {
        setReplies((prev: any) => {
          const newData = {
            ...response?.data?.data,
            author: user,
          };
          const targetComment = {
            [comment._id]: [...prev[comment._id], newData],
          };
          return {
            ...prev,
            ...targetComment,
          };
        });
      }
      setReply("");
    } else {
      notify("Something went wrong", "error");
    }
  };

  return (
    <div className="mt-3">
      {/* User Info */}
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex gap-2">
          <div>
            {comment?.author?.picture ? (
              <img
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={comment?.author?.picture}
              />
            ) : (
              <p
                style={{ width: "40px", height: "40px" }}
                className="d-flex justify-content-center align-items-center border m-0 rounded-full border-dark text-uppercase"
              >
                {comment?.author?.firstName?.[0]}
                {comment?.author?.lastName?.[0]}
              </p>
            )}
          </div>
          <div>
            <p className="mb-0 fw-bold">
              {comment?.author?.firstName + " " + comment?.author?.lastName}
            </p>
            <p className="small text-secondary">
              {comment?.createdAt
                ? new Date(comment?.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Now"}
            </p>
          </div>
        </div>

        {comment?.author?._id === user._id && (
          <>
            <hr style={{ flex: 1 }} />
            <div>
              <LoadingButton
                onClick={deleteReviewModal.open}
                className="p-1"
                variant="outline-danger"
              >
                <FaRegTrashCan />
              </LoadingButton>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <p>{comment.content}</p>

      {/* Actions */}
      <div className="d-flex align-items-center gap-3">
        {/* Likes */}
        <div className="likes">
          <div title={user._id ? "" : "Login to make this action"}>
            {isLiked ? (
              <LoadingButton
                loading={loadings[`dislike-${comment._id}`]}
                disabled={loadings[`dislike-${comment._id}`] || !user._id}
                onClick={() => handleDislike(comment._id!)}
                className="bg-transparent text-dark border-0 p-0 mb-2"
              >
                <FaHandsClapping className="fs-5 pointer" title="Clap" />
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={loadings[`like-${comment._id}`]}
                disabled={loadings[`like-${comment._id}`] || !user._id}
                onClick={() => handleLike(comment._id!)}
                className="bg-transparent text-dark border-0 p-0 m-0"
              >
                <PiHandsClapping className="fs-5 pointer" title="Clap" />
              </LoadingButton>
            )}
            <span className="ms-2 pointer" title="Claps">
              {comment.likes?.length}
            </span>
          </div>
        </div>

        {/* Replies */}
        {comment.numberOfReplies ? (
          <div
            className="comments text-secondary pointer"
            title="Comments"
            onClick={() => handleGetReplies(comment._id!)}
          >
            <FaRegComment className="fs-5" />
            <span className="ms-2">{comment.numberOfReplies} replies</span>
          </div>
        ) : null}

        <Button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-0 bg-transparent text-dark border-0 text-decoration-underline fw-bold"
        >
          Reply
        </Button>
      </div>

      {/* Reply */}
      <Form
        className={`mt-2 mb-4 reply-form ${showForm ? "show" : "hide"} rounded`}
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
            rows={3}
            value={reply}
            onChange={(e) => {
              setReply(e.target.value);
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
            onClick={handleCreateReply}
            type="submit"
            className={`text-capitalize`}
            disabled={!reply.length || loadings[`reply-${comment._id}`]}
            loading={loadings[`reply-${comment._id}`]}
            variant="dark"
            tabIndex={0}
          >
            reply
          </LoadingButton>
        </div>
      </Form>

      <DeleteReviewModalComponent
        isOpen={deleteReviewModal.isOpen}
        handleClose={deleteReviewModal.close}
        level={level}
        comment={comment}
      />

      {/* Replies List (recursive) */}
      {replies[comment._id!] && (
        <div className={`${level < 3 ? "ps-5 ms-2 border-start" : ""} mt-2`}>
          {replies[comment._id!].map((reply: any, index) => (
            <div key={index}>
              <CommentItem comment={reply} user={user} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ArticleCommentsComponent = () => {
  const article = useRecoilValue(articleAtom);
  const { user } = useLoggedInUser();
  let level = 1;

  return (
    <>
      {article.comments?.map((comment, index) => (
        <div key={index}>
          <CommentItem comment={comment} user={user} level={level} />
        </div>
      ))}
    </>
  );
};
