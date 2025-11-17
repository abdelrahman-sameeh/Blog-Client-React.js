import { AuthHome } from "../../../components/main-layout/home-page/AuthHome";
import { UnAuthHome } from "../../../components/main-layout/home-page/UnAuthHome";
import { Helmet } from "../../../components/utils/Helmet";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";

export const HomePage = () => {
  const { user } = useLoggedInUser();
  return (
    <main className="main-content">
      <Helmet title={"Home"} />
      {user?._id ? <AuthHome /> : <UnAuthHome />}
    </main>
  );
};
