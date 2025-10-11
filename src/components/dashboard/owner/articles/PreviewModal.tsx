import { Button, Modal } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { articleAtom } from "../../../../recoil/articles/article-atom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { PiHandsClapping } from "react-icons/pi";
import { FaRegComment, FaRegSave } from "react-icons/fa";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MdOutlineCategory } from "react-icons/md";

export const PreviewModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [article, setArticle] = useRecoilState(articleAtom);

  useEffect(() => {
    if (!article.createdAt) {
      setArticle((prev) => ({ ...prev, createdAt: new Date() }));
    }
  }, [article]);

  return (
    <Modal size={"xl"} show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Preview Article</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h2 className="fw-bold text-capitalize">{article?.title}</h2>
            {article.category?.title && (
              <h5><MdOutlineCategory /> {article.category?.title}</h5>
            )}
          </div>

          {/* Owner */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Link
              to="user"
              className="text-dark text-decoration-none d-flex align-items-center gap-2 flex-wrap"
            >
              {article.user?.picture ? (
                <img
                  src={article.user?.picture}
                  alt={article.user?.firstName}
                  className="rounded-circle object-fit-cover"
                  width={45}
                  height={45}
                />
              ) : (
                <p className="border m-0 rounded-full px-2 py-2 border-dark text-uppercase">
                  {article.user?.firstName?.[0]}
                  {article.user?.lastName?.[0]}{" "}
                </p>
              )}
              {`${article.user?.firstName} ${article.user?.lastName}`}
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

          {/* Likes And Comments */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-4">
              <div className="likes text-secondary">
                <PiHandsClapping className="fs-5" title="Clap" />
                <span className="ms-2" title="Claps">
                  {article.likes?.length}
                </span>
              </div>
              <div className="comments text-secondary" title="Comments">
                <FaRegComment className="fs-5" />
                <span className="ms-2">{article.comments?.length} </span>
              </div>
            </div>
            <div className="text-secondary" title={"Save"}>
              <FaRegSave className="fs-4" />
            </div>
          </div>

          <hr />

          {/* Blocks */}
          <div>
            {article.blocks?.map((articleBlock) => {
              let mediaSrc = "";
              if (
                articleBlock.type == "image" ||
                articleBlock.type == "video"
              ) {
                mediaSrc = URL.createObjectURL(articleBlock.data);
              }
              return (
                <div key={articleBlock.order}>
                  {articleBlock.type == "text" && (
                    <p className="mt-3 mb-0">{articleBlock.data}</p>
                  )}
                  {articleBlock.type == "image" && (
                    <img
                      className="mt-3"
                      style={{ width: "100%" }}
                      src={mediaSrc}
                    />
                  )}
                  {articleBlock.type == "video" && (
                    <video
                      className="mt-3"
                      controls
                      style={{ width: "100%", borderRadius: "20px" }}
                      src={mediaSrc}
                    ></video>
                  )}

                  {articleBlock.type == "code" && (
                    <SyntaxHighlighter
                      language={articleBlock.lang}
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

          {/* Tags */}
          {article?.tags?.map((item, index) => {
            return (
              <span key={index} className="ms-2 fw-bold">
                #{item.title}
              </span>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
