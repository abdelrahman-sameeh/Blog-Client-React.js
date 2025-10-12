import { useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Modal } from "react-bootstrap";
import { articleAtom } from "../../../../../recoil/articles/article-atom";
import authAxios from "../../../../../api/auth-axios";
import notify from "../../../../utils/Notify";
import { LoadingButton } from "../../../../utils/LoadingButton";
import { articleBlockAtom } from "../../../../../recoil/articles/article-blocks-atom";
import { ApiEndpoints } from "../../../../../api/api-endpoints";

interface IDeleteArticleBlockModal {
  isOpen: boolean;
  handleClose: () => void;
}

export const DeleteArticleBlockModal = ({
  isOpen,
  handleClose,
}: IDeleteArticleBlockModal) => {
  const [loading, setLoading] = useState(false);
  const [articleBlock, setArticleBlock] = useRecoilState(articleBlockAtom);
  const [article, setArticle] = useRecoilState(articleAtom);

  const handleDelete = async () => {
    setLoading(true);

    const response = await authAxios(
      true,
      ApiEndpoints.deleteArticleBlock(
        article._id as string,
        articleBlock._id as string
      ),
      "DELETE"
    );

    setLoading(false);

    if (response.status == 204) {
      notify("block deleted successfully");
      setArticle((prev) => ({
        ...prev,
        blocks: prev.blocks?.filter((b) => b._id != articleBlock._id),
      }));
      setArticleBlock({});
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
        Are you sure you want to <strong>permanently delete</strong> this block?{" "}
        <br />
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
