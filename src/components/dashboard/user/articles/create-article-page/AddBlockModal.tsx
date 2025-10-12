import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { articleBlockTypes } from "../../../../../utils/interfaces/article-block-interface";
import { useSetRecoilState } from "recoil";
import { articleBlocksAtom } from "../../../../../recoil/articles/article-blocks-atom";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";

export const AddBlockModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  const [type, setType] = useState<articleBlockTypes>("text");
  const [data, setData] = useState<string | File>("");
  const setArticleBlocks = useSetRecoilState(articleBlocksAtom);
  const [codeLang, setCodeLang] = useState("javascript");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setData(file || "");
  };

  const handleSave = () => {
    const newArticleBlock: any = {
      type,
      data,
    };

    if (type == "code") {
      newArticleBlock.lang = codeLang;
    }

    setArticleBlocks((prev) => [...prev, newArticleBlock]);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={type === "code" ? "lg" : undefined}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add new block</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select
            value={type}
            onChange={(e) => {
              setType(e.target.value as articleBlockTypes);
              setData("");
            }}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="code">Code</option>
          </Form.Select>
        </Form.Group>

        {type === "code" && (
          <Form.Group className="mb-3">
            <Form.Label>Code Language</Form.Label>
            <Form.Select
              value={codeLang}
              onChange={(e) => setCodeLang(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="php">PHP</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </Form.Select>
          </Form.Group>
        )}

        {type === "text" ? (
          <Form.Group className="mb-3">
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={data as string}
              onChange={(e) => setData(e.target.value)}
              placeholder="Enter text here..."
            />
          </Form.Group>
        ) : type === "code" ? (
          <CodeMirror
            value={data as string}
            height="250px"
            extensions={[loadLanguage(codeLang) || []]}
            theme={githubLight}
            onChange={(value) => setData(value)}
          />
        ) : (
          <Form.Group className="mb-3">
            <Form.Label>Upload {type}</Form.Label>
            <Form.Control
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
            />
          </Form.Group>
        )}
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
