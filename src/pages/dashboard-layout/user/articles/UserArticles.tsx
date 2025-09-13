import { Link } from "react-router-dom";

export const UserArticles = () => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-start">
        <h4 className="fw-bold text-capitalize">your articles</h4>
        <Link
          to="/dashboard/user/create-article"
          className="btn btn-outline-dark text-capitalize"
        >
          create new article
        </Link>
      </div>

      {/* User Article */}
    </>
  );
};
