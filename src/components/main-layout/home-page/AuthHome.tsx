import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { articlesAtom } from "../../../recoil/articles/article-atom";
import authAxios from "../../../api/auth-axios";
import { ApiEndpoints } from "../../../api/api-endpoints";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { ArticleCardComponent } from "../search-articles-page/ArticleCardComponent";
import { DeleteArticleModalComponent } from "../search-articles-page/DeleteArticleModalComponent";
import { useModal } from "../../../hooks/useModal";
import InfiniteScroll from "react-infinite-scroll-component";


export const AuthHome = () => {
  const radios = [
    { name: "For you", value: "forYou" },
    { name: "Featured", value: "featured" },
  ];
  type RadioValue = (typeof radios)[number]["value"];
  const [radioValue, setRadioValue] = useState<RadioValue>("forYou");

  const [articles, setArticles] = useRecoilState(articlesAtom);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const deleteArticleModal = useModal();

  const fetchArticles = async () => {
    let responseData: any = [];
    if (radioValue === "forYou") {
      const response = await authAxios(
        true,
        ApiEndpoints.getHomePageArticles(`?limit=3&page=${page}`)
      );
      responseData = response?.data?.data?.articles || [];
    } else {
      // Featured articles
      responseData = [];
    }

    setArticles((prev) => [...prev, ...responseData]);
    if (responseData.length === 0) setHasMore(false);
  };

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }, [radioValue]);

  useEffect(() => {
    fetchArticles();
  }, [page, radioValue]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="custom-container">
      <ButtonGroup style={{ marginBottom: "-20px" }}>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant="outline-dark"
            name="radio"
            className={`border-0 rounded-0 bg-transparent fw-bold ms-2  ${
              radioValue === radio.value
                ? "text-dark border-bottom border-dark"
                : "text-secondary"
            }`}
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <hr style={{ border: "1px solid #cfcfcf" }} />

      <InfiniteScroll
        dataLength={articles.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p className="text-center my-3">Loading...</p>}
        endMessage={<p className="text-center my-3">No more articles</p>}
      >
        {articles.map((article) => (
          <ArticleCardComponent
            key={article._id}
            article={article}
            deleteArticleModal={deleteArticleModal}
          />
        ))}
      </InfiniteScroll>

      <DeleteArticleModalComponent
        isOpen={deleteArticleModal.isOpen}
        handleClose={deleteArticleModal.close}
      />
    </div>
  );
};
