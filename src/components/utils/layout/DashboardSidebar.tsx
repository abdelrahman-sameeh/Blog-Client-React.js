import { Link } from "react-router-dom";
import { useLoggedInUser } from "../../hooks/useGetLoggedInUser";
import { MdOutlineArticle } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";

const links = {
  admin: [],
  user: [
    {
      link: "articles",
      title: "your articles",
      icon: <MdOutlineArticle />,
    },
    {
      link: "create-article",
      title: "create article",
      icon: <IoCreateOutline />,
    },
  ],
};

export const DashboardSidebar = () => {
  const { user } = useLoggedInUser();
  const handleToggleSidebar = () => {
    const dashboardSidebar = document.querySelector(".dashboard-sidebar");
    dashboardSidebar?.classList.toggle("hide");
    dashboardSidebar?.classList.toggle("show");
  };

  return (
    <div className="dashboard-sidebar-content">
      {(() => {
        const userLinks = links[user?.role as keyof typeof links];
        return (
          <>
            <div className="d-flex justify-content-end mb-2">
              <FaArrowRight
                onClick={handleToggleSidebar}
                className="arrow fs-4 pointer mt-2"
              />
            </div>
            {userLinks?.map(
              (
                link: { link: string; title: string; icon: React.ReactNode },
                index
              ) => (
                <Link
                  className="link d-block text-capitalize px-2 py-1 rounded text-dark"
                  key={index}
                  to={`${user.role}/${link.link}`}
                >
                  <span
                    title={`${link.title[0].toUpperCase()}${link.title
                      .slice(1)
                      .toLowerCase()}`}
                    className="link-icon fs-4 me-2"
                  >
                    {link.icon}
                  </span>
                  <span className="link-content">{link.title}</span>
                </Link>
              )
            )}
          </>
        );
      })()}
    </div>
  );
};
