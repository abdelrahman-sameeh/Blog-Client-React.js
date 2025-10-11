import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useSetRecoilState } from "recoil";
import { tagsAtom } from "../../../../recoil/tags-atom";
import notify from "../../../utils/Notify";

export const AddTagModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  const setTags = useSetRecoilState(tagsAtom);
  const [data, setData] = useState("");

  const handleSave = () => {
    if (!data) {
      notify("Tag is required", "warning");
      return;
    }
    const newData = data.toLowerCase().trim().replace(/\s+/g, "-");
    setTags((prev: any) => [...prev, { label: newData, value: newData }]);
    setData("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add new tag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Tag</Form.Label>
          <Form.Control
            value={data as string}
            onChange={(e) => setData(e.target.value)}
            placeholder="Tag name"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClose}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
