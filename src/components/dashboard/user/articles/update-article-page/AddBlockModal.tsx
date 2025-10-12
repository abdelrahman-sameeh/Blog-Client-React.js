import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type {
  articleBlockTypes,
} from "../../../../../utils/interfaces/article-block-interface";
import { useRecoilState, useSetRecoilState } from "recoil";
import { articleBlocksAtom } from "../../../../../recoil/articles/article-blocks-atom";
import CodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import { articleAtom } from "../../../../../recoil/articles/article-atom";
import authAxios from "../../../../../api/auth-axios";
import { ApiEndpoints } from "../../../../../api/api-endpoints";
import { LoadingButton } from "../../../../utils/LoadingButton";
import notify from "../../../../utils/Notify";

export const AddBlockModal = ({
  context = "create-page",
  show,
  handleClose,
}: {
  context: "create-page" | "update-page";
  show: boolean;
  handleClose: () => void;
}) => {
  const [type, setType] = useState<articleBlockTypes>("text");
  const [data, setData] = useState<string | File>("");
  const [article, setArticle] = useRecoilState(articleAtom);
  const setArticleBlocks = useSetRecoilState(articleBlocksAtom);
  const [codeLang, setCodeLang] = useState("javascript");
  const [loading, setLoading] = useState(false);

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
    setData("");
    handleClose();
  };

  const handleCreateBlock = async () => {
    const formData = new FormData();
    formData.append("data", data);
    formData.append("type", type);
    if (type == "code") {
      formData.append("lang", codeLang);
    }

    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.createArticleBlock(article._id as string),
      "POST",
      formData,
      "multipart/form-data"
    );
    setLoading(false);

    if (response.status == 201) {
      setArticle((prev) => ({
        ...prev,
        blocks: [...(prev.blocks || []), response?.data?.data],
      }));
      setData("");
      notify("block created successfully");
      handleClose();
    } else {
      notify("Something went wrong, Please tyr again later", "error");
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={type === "code" ? "lg" : undefined}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add new block </Modal.Title>
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
        <LoadingButton
          loading={loading}
          variant="outline-dark"
          onClick={context == "create-page" ? handleSave : handleCreateBlock}
        >
          Save
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
