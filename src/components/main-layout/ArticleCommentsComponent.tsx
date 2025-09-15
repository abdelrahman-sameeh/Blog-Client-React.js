import { useRecoilState } from "recoil";
import { articleAtom } from "../../recoil/articles/article-atom";
import { useLoggedInUser } from "../../hooks/useGetLoggedInUser";
import { LoadingButton } from "../utils/LoadingButton";
import { useState } from "react";
import { FaHandsClapping, FaRegTrashCan } from "react-icons/fa6";
import { PiHandsClapping } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { Button } from "react-bootstrap";
import authAxios from "../../api/auth-axios";
import { ApiEndpoints } from "../../api/api-endpoints";

const CommentItem = ({
  comment,
  user,
  loading,
  replies,
  setReplies,
  handleLike,
  handleDislike,
  handleGetReplies,
  level,
}: any) => {
  const isLiked = comment.likes?.includes(user._id);
  const isLoading = loading[comment?._id!] || false;

  const handleDelete = async () => {
    console.log("delete", level);
  };

  return (
    <div className="mt-3">
      {/* User Info */}
      <div className="d-flex justify-content-between">
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
          <div>
            <Button
              onClick={handleDelete}
              className="p-1"
              variant="outline-danger"
            >
              <FaRegTrashCan />
            </Button>
          </div>
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
                loading={isLoading}
                disabled={isLoading || !user._id}
                onClick={() => handleDislike(comment._id!)}
                className="bg-transparent text-dark border-0 p-0 mb-2"
              >
                <FaHandsClapping className="fs-5 pointer" title="Clap" />
              </LoadingButton>
            ) : (
              <LoadingButton
                loading={isLoading}
                disabled={isLoading || !user._id}
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

        <Button className="px-0 bg-transparent text-dark border-0 text-decoration-underline fw-bold">
          Reply
        </Button>
      </div>

      {/* Replies List (recursive) */}
      {replies[comment._id!] && (
        <div className={`${level < 3 ? "ps-5 ms-2 border-start" : ""} mt-2`}>
          {replies[comment._id!].map((reply: any) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              user={user}
              loading={loading}
              replies={replies}
              setReplies={setReplies}
              handleLike={handleLike}
              handleDislike={handleDislike}
              handleGetReplies={handleGetReplies}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ArticleCommentsComponent = () => {
  const [article, setArticle] = useRecoilState(articleAtom);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [replies, setReplies] = useState<{ [key: string]: any[] }>({});
  const { user } = useLoggedInUser();
  let level = 1;

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

    setLoading((prev) => ({ ...prev, [commentId]: true }));
    await authAxios(true, ApiEndpoints.likeReply(commentId), "PATCH");
    setLoading((prev) => ({ ...prev, [commentId]: false }));
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

    setLoading((prev) => ({ ...prev, [commentId]: true }));
    await authAxios(true, ApiEndpoints.dislikeReply(commentId), "PATCH");
    setLoading((prev) => ({ ...prev, [commentId]: false }));
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

  return (
    <div>
      {article.comments?.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          user={user}
          loading={loading}
          replies={replies}
          setReplies={setReplies}
          handleLike={handleLike}
          handleDislike={handleDislike}
          handleGetReplies={handleGetReplies}
          level={level}
        />
      ))}
    </div>
  );
};
