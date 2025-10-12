import { Button, Modal } from "react-bootstrap";
import { LoadingButton } from "../../utils/LoadingButton";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  articleAtom,
  articlesAtom,
} from "../../../recoil/articles/article-atom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import notify from "../../utils/Notify";

export const DeleteArticleModalComponent = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useRecoilState(articleAtom);
  const setArticles = useSetRecoilState(articlesAtom);

  const handleDelete = async () => {
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.getDeleteArticle(article._id as string),
      "DELETE"
    );
    setLoading(false);

    if (response.status == 204) {
      notify("Article delete successfully");
      setArticles((prev) => [...prev.filter((ar) => ar._id != article._id)]);
      setArticle({});
      handleClose();
    } else {
      notify("Something went wrong", "error");
    }
  };

  return (
    <Modal show={isOpen} centered onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to <strong>permanently delete</strong> this
        article? <br />
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
