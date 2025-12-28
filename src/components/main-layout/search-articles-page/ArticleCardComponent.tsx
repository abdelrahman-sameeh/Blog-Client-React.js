import { Badge, Button, Card } from "react-bootstrap";
import type { IArticle } from "../../../utils/interfaces/article.interface";
import { Link } from "react-router-dom";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { IoCreateOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { articleAtom } from "../../../recoil/articles/article-atom";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";

export const ArticleCardComponent = ({
  article,
  deleteArticleModal,
}: {
  article: IArticle;
  deleteArticleModal?: any;
}) => {
  const { user } = useLoggedInUser();
  const setArticle = useSetRecoilState(articleAtom);

  return (
    <Card
      key={article._id}
      className="mb-4 shadow-sm border-0 rounded-4 overflow-hidden"
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center mb-3 gap-2">
            <Link
              className={"text-decoration-none text-dark"}
              to={`/writer/${article?.user?._id}`}
            >
              {article?.user?.picture ? (
                <img
                  src={article?.user?.picture}
                  alt={article?.user?.username}
                  className="rounded-circle object-fit-cover"
                  width={45}
                  height={45}
                />
              ) : (
                <div className="user-picture-placeholder border p-2 rounded-circle">
                  {article?.user?.firstName?.charAt(0)?.toUpperCase()}
                  {article?.user?.lastName?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </Link>
            <div>
              <Link
                className={"text-decoration-none text-dark"}
                to={`/writer/${article?.user?._id}`}
              >
                <h6 className="mb-0">
                  {article?.user?.firstName} {article?.user?.lastName}
                </h6>
              </Link>
              <small className="text-muted">@{article?.user?.username}</small>
            </div>
          </div>

          {/* controls  */}
          {user?._id == article?.user?._id ? (
            <div className="d-flex gap-1">
              <Link to={`/dashboard/user/article/${article._id}/update`}>
                <Button
                  variant="outline-dark"
                  title="Update"
                  className="p-1 d-flex justify-content-center align-items-center"
                >
                  <IoCreateOutline className="fs-5" />
                </Button>
              </Link>

              <Button
                title={"Delete"}
                onClick={() => {
                  setArticle(article);
                  deleteArticleModal?.open();
                }}
                variant="outline-danger"
                className="p-1 d-flex justify-content-center align-items-center"
              >
                <FaRegTrashAlt />{" "}
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <div>
            <h4 className="fw-bold mb-2 text-truncate-2">{article.title}</h4>
            <span className="text-secondary mb-2 text-truncate-2">
              {article?.blocksData?.text}
            </span>
            <Badge bg="secondary" className="mb-2">
              {article?.category?.title}
            </Badge>
            <div className="mb-3">
              {article?.tags?.map((tag) => (
                <Badge
                  key={tag._id}
                  bg="light"
                  text="dark"
                  className="me-2 border"
                >
                  #{tag.title}
                </Badge>
              ))}
            </div>
          </div>

          <div style={{ flexShrink: 0, width: "100px", height: "100px" }}>
            {article?.blocksData?.image ? (
              <img
                src={article?.blocksData?.image}
                className="img-fluid rounded"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaHandsClapping className="me-1 fs-5" />
            <span>{article?.likes?.length}</span>
          </div>
          <Link
            to={`/article/${article._id}`}
            className="btn btn-outline-primary btn-sm rounded-pill"
          >
            Read more →
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
