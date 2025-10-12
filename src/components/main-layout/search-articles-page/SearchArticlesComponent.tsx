import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { FaHandsClapping } from "react-icons/fa6";
import { IoCreateOutline, IoFilterOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { CategoryFilterComponent } from "./CategoryFilterComponent";
import { TagsFilterComponent } from "./TagsFilterComponent";
import { useRecoilState, useSetRecoilState } from "recoil";
import { searchAtom } from "../../../recoil/search-atom";
import type { IPagination } from "../../../utils/interfaces/pagination-interface";
import type { ICategory } from "../../../utils/interfaces/category-interface";
import { categoriesAtom } from "../../../recoil/categories-atoms";
import { tagsAtom } from "../../../recoil/tags-atom";
import type { ITag } from "../../../utils/interfaces/tag-interface";
import { useDebounce } from "../../../hooks/useDebounce";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { FaRegTrashAlt } from "react-icons/fa";
import { articleAtom, articlesAtom } from "../../../recoil/articles/article-atom";
import { DeleteArticleModalComponent } from "./DeleteArticleModalComponent";
import { useModal } from "../../../hooks/useModal";

export const SearchArticlesComponent = ({
  mine = false,
}: {
  mine?: boolean;
}) => {
  const [search, setSearch] = useRecoilState(searchAtom);
  const [hide, setHide] = useState(true);
  const setCategories = useSetRecoilState(categoriesAtom);
  const setTags = useSetRecoilState(tagsAtom);
  const [articles, setArticles] = useRecoilState(articlesAtom);
  const [pagination, setPagination] = useState<IPagination>({});
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [numberOfResults, setNumberOfResults] = useState(5);
  const { user } = useLoggedInUser();
  const debouncedSearch = useDebounce(search);
  const [loadings, setLoadings] = useState<Record<string, boolean>>({});
  const setArticle = useSetRecoilState(articleAtom);

  const deleteArticleModal = useModal();

  // fetch all categories and tags
  useEffect(() => {
    authAxios(false, ApiEndpoints.getFilters).then((response) => {
      if (response.status == 200) {
        setCategories(response?.data?.categories || []);
        setTags(response?.data?.tags || []);
      }
    });
  }, []);

  const createQuery = () => {
    let query = `limit=${numberOfResults}&`;
    if (debouncedSearch) {
      query += `search=${debouncedSearch}&`;
    }
    if (selectedCategories.length > 0) {
      for (const cat of selectedCategories) {
        query += `categories[]=${cat._id}&`;
      }
    }
    if (selectedTags.length > 0) {
      for (const tag of selectedTags) {
        query += `tags[]=${tag._id}&`;
      }
    }
    if (pagination.page) {
      query += `page=${pagination.page}&`;
    }

    query = query.slice(0, -1);
    return query;
  };

  const fetchData = async () => {
    const query = createQuery();
    const endpoint = mine
      ? ApiEndpoints.listMineArticle(query)
      : ApiEndpoints.listCreateArticle(query);
    const isAuth = mine ? true : false;
    setLoadings((prev) => ({ ...prev, search: true }));

    const response = await authAxios(isAuth, endpoint);
    if (response.status == 200) {
      setArticles(response?.data?.data?.articles || []);
      setPagination(response?.data?.pagination || {});
    }
    setLoadings((prev) => {
      delete prev["search"];
      return { ...prev };
    });
  };

  useEffect(() => {
    fetchData();
  }, [
    debouncedSearch,
    selectedCategories,
    selectedTags,
    pagination.page,
    numberOfResults,
  ]);

  return (
    <>
      <Row className="mx-0">
        <Col lg={9} md={8} sm={12} className="pt-4">
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <CiSearch />
            </InputGroup.Text>
            <Form.Control
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="shadow-none search-input"
              placeholder="Search article"
              type="search"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />

            <Button
              className="d-none"
              onClick={() => {
                setHide((prev) => !prev);
              }}
              variant="outline-secondary filter"
              style={{
                border: "var(--bs-border-width) solid var(--bs-border-color)",
              }}
            >
              <IoFilterOutline />
            </Button>
          </InputGroup>

          <div className="articles-list">
            {loadings["search"] ? (
              <div className="text-center my-5">
                <div className="spinner-border text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : articles.length == 0 ? (
              <div className="text-center my-5">
                <h5 className="text-secondary">No articles found</h5>
              </div>
            ) : (
              articles.map((article) => {
                return (
                  <Card
                    key={article._id}
                    className="mb-4 shadow-sm border-0 rounded-4 overflow-hidden"
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center mb-3 gap-2">
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
                              {article?.user?.firstName
                                ?.charAt(0)
                                .toUpperCase()}
                              {article?.user?.lastName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h6 className="mb-0">
                              {article?.user?.firstName}{" "}
                              {article?.user?.lastName}
                            </h6>
                            <small className="text-muted">
                              @{article?.user?.username}
                            </small>
                          </div>
                        </div>

                        {/* controls  */}
                        {user?._id == article?.user?._id ? (
                          <div className="d-flex gap-1">
                            <Link
                              to={`/dashboard/user/article/${article._id}/update`}
                            >
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
                                deleteArticleModal.open()
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

                      <h4 className="fw-bold mb-2 text-truncate-2">
                        {article.title}
                      </h4>

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
              })
            )}

            {/* create pagination here  */}
            {pagination?.pages && pagination.pages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    {/* زر Previous */}
                    <li
                      className={`page-item ${
                        pagination.page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          if (pagination.page && pagination.page > 1) {
                            const newPage = pagination.page - 1;
                            setPagination((prev) => ({
                              ...prev,
                              page: newPage,
                            }));
                          }
                        }}
                      >
                        Previous
                      </button>
                    </li>

                    {/* أرقام الصفحات */}
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((num) => (
                      <li
                        key={num}
                        className={`page-item ${
                          pagination.page === num ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => {
                            if (num !== pagination.page) {
                              setPagination((prev) => ({
                                ...prev,
                                page: num,
                              }));
                            }
                          }}
                        >
                          {num}
                        </button>
                      </li>
                    ))}

                    {/* زر Next */}
                    <li
                      className={`page-item ${
                        pagination.page === pagination.pages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          if (
                            pagination.page &&
                            pagination.page < (pagination.pages || 1)
                          ) {
                            const newPage = pagination.page + 1;
                            setPagination((prev) => ({
                              ...prev,
                              page: newPage,
                            }));
                          }
                        }}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </Col>

        {/* Filters */}
        <Col
          lg={3}
          md={4}
          className={`filters ${hide ? "hide" : ""} border-start pt-4`}
        >
          <h5 className="mb-3">Filters</h5>

          <CategoryFilterComponent
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          <TagsFilterComponent
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          <Form>
            <h5 className="mt-3">Number of results per page</h5>
            {[1, 5, 10, 15, 20].map((num) => (
              <Form.Check
                key={num}
                type="switch"
                name="numberOfResults"
                id={`results-${num}`}
                label={`${num} per page`}
                checked={numberOfResults === num}
                onChange={() => setNumberOfResults(num)}
              />
            ))}
          </Form>
        </Col>
      </Row>

      <DeleteArticleModalComponent isOpen={deleteArticleModal.isOpen} handleClose={deleteArticleModal.close} />
    </>
  );
};
