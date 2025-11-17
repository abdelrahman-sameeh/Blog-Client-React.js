import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
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
import { articlesAtom } from "../../../recoil/articles/article-atom";
import { DeleteArticleModalComponent } from "./DeleteArticleModalComponent";
import { useModal } from "../../../hooks/useModal";
import { PaginationComp } from "../../utils/PaginationComp";
import { ArticleCardComponent } from "./ArticleCardComponent";

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
  const debouncedSearch = useDebounce(search);
  const [loadings, setLoadings] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

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
    if (page) {
      query += `page=${page}&`;
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
    page,
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
                setPage(1);
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
              articles?.map((article) => {
                return (
                  <ArticleCardComponent
                    key={article._id}
                    article={article}
                    deleteArticleModal={deleteArticleModal}
                  />
                );
              })
            )}

            {/* create pagination here  */}
            {pagination?.pages && pagination.pages > 1 ? (
              <PaginationComp
                page={pagination.page}
                pages={pagination.pages}
                setPage={setPage}
              />
            ) : (
              <></>
            )}
          </div>
        </Col>

        {/* Filters */}
        <Col
          lg={3}
          md={4}
          className={`filters ${hide ? "hide" : ""} border-start pt-4`}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Filters</h5>
            <Button
              onClick={() => {
                setHide(true);
              }}
              variant="outline-danger"
              className="border-circle p-2 py-0 d-block d-md-none"
            >
              x
            </Button>
          </div>

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
                onChange={() => {
                  setPage(1);
                  setNumberOfResults(num);
                }}
              />
            ))}
          </Form>
        </Col>
      </Row>

      <DeleteArticleModalComponent
        isOpen={deleteArticleModal.isOpen}
        handleClose={deleteArticleModal.close}
      />
    </>
  );
};
