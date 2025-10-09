import { useRecoilState } from "recoil";
import { searchAtom } from "../../../recoil/search-atom";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import type { IArticle } from "../../../utils/interfaces/article.interface";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";
import { useDebounce } from "../../../hooks/useDebounce";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import type { IPagination } from "../../../utils/interfaces/pagination-interface";
import type { ICategory } from "../../../utils/interfaces/category-interface";

export const SearchArticlesPage = () => {
  const [search, setSearch] = useRecoilState(searchAtom);
  const [hide, setHide] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<ICategory[]>([]);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [pagination, setPagination] = useState<IPagination>({});
  // const { user } = useLoggedInUser();
  const debouncedSearch = useDebounce(search);
  const [loadings, setLoadings] = useState<Record<string, boolean>>({});

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
    let query = "";
    if (debouncedSearch) {
      query += `search=${debouncedSearch}&`;
    }

    return query;
  };

  const fetchData = async () => {
    const query = createQuery();
    setLoadings((prev) => ({ ...prev, search: true }));
    const response = await authAxios(
      false,
      ApiEndpoints.listCreateArticle(query)
    );
    if (response.status == 200) {
      setArticles(response?.data?.data?.articles || []);
      setPagination(response?.data?.pagination || {});
    }
    delete loadings[search];
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch]);

  return (
    <main className="main-content search-page">
      <div className="container">
        <Row className="mx-0">
          <Col md={9} sm={12} className="pt-4">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                <CiSearch />
              </InputGroup.Text>
              <Form.Control
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          </Col>
          <Col
            md={3}
            className={`filters ${hide ? "hide" : ""} border-start pt-4`}
          >
            filters
          </Col>
        </Row>
      </div>
    </main>
  );
};
