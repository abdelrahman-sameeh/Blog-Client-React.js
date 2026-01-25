import { Button, Modal } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { imageViewAtom } from "../../../recoil/image-view.atom";

export const ImageViewModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  const imageUrl = useRecoilValue(imageViewAtom);
  return (
    <Modal centered show={show} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={
            imageUrl.startsWith("http")
              ? imageUrl
              : `http://localhost:3000${imageUrl}`
          }
          alt="image"
          style={{
            width: "100%",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
