import { Link } from "react-router-dom";
import { SearchArticlesComponent } from "../../../../components/main-layout/search-articles-page/SearchArticlesComponent";

export const UserArticlesPage = () => {
  return (
    <div className="search-page">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
        <h3 className="text-capitalize">your articles</h3>

        <Link
          to="/dashboard/user/create-article"
          className="btn btn-outline-dark text-capitalize"
        >
          create new article
        </Link>
      </div>

      {/* User Articles */}
      <SearchArticlesComponent mine={true} />
    </div>
  );
};
