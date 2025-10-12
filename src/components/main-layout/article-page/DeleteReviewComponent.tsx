import { useState } from "react";
import { useRecoilState } from "recoil";
import type { IComment } from "../../../utils/interfaces/comment-interface";
import { articleAtom } from "../../../recoil/articles/article-atom";
import { articleReplies } from "../../../recoil/articles/article-replies-atom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import notify from "../../utils/Notify";
import { Button, Modal } from "react-bootstrap";
import { LoadingButton } from "../../utils/LoadingButton";


interface IDeleteReviewModalComponent {
  isOpen: boolean;
  handleClose: () => void;
  level: number;
  comment: IComment;
}

export const DeleteReviewModalComponent = ({
  isOpen,
  handleClose,
  level,
  comment,
}: IDeleteReviewModalComponent) => {
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useRecoilState(articleAtom);
  const [replies, setReplies] = useRecoilState(articleReplies);

  const handleDelete = async () => {
    setLoading(true);

    const response = await authAxios(
      true,
      ApiEndpoints.deleteReview(comment._id!),
      "DELETE"
    );

    setLoading(false);

    if (response.status == 204) {
      if (level == 1) {
        const newComments = article?.comments?.filter(
          (co) => co._id != comment._id
        );
        setArticle((prev) => ({ ...prev, comments: newComments }));
      } else {
        if (level == 2) {
          setArticle((prev) => {
            const newComments = prev?.comments?.map((co) =>
              co._id == comment.parentReview
                ? { ...co, numberOfReplies: co.numberOfReplies! - 1 }
                : co
            );
            return {
              ...prev,
              comments: newComments,
            };
          });
        }

        const newReplies = { ...replies };

        for (const replyId in newReplies) {
          // remove current reply
          newReplies[replyId] = newReplies[replyId].filter(
            (reply) => reply._id !== comment._id
          );

          // update parent of current reply
          newReplies[replyId] = newReplies[replyId].map((reply) => {
            return reply._id === comment.parentReview
              ? { ...reply, numberOfReplies: reply.numberOfReplies - 1 }
              : reply;
          });
        }
        setReplies(newReplies);
      }
    } else {
      notify("Something went wrong", "error");
    }

    handleClose();
  };

  return (
    <Modal show={isOpen} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to <strong>permanently delete</strong> this
        comment? <br />
        <small className="text-muted">This action cannot be undone.</small>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          variant="outline-danger"
          onClick={handleDelete}
        >
          Yes, Delete
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
