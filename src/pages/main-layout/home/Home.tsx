import { Helmet } from "../../../components/utils/Helmet";
import { useLoggedInUser } from "../../../hooks/useGetLoggedInUser";

export const HomePage = () => {
  const { user } = useLoggedInUser(true);
  
  return (
    <main className="main-content">
      <Helmet title={"Home"} />

    </main>
  );
};
