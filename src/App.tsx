import { Route, Routes } from "react-router-dom";
import { RegisterPage } from "./pages/auth/register/Register";
import { LoginPage } from "./pages/auth/login/Login";
import { MainLayout } from "./layout/MainLayout";
import { DashboardLayout } from "./layout/DashboardLayout";
import { IsAuth } from "./hooks/IsAuth";
import { UserArticlesPage } from "./pages/dashboard-layout/user/articles/UserArticlesPage";
import { CreateArticlePage } from "./pages/dashboard-layout/user/articles/CreateArticlePage";
import { HomePage } from "./pages/main-layout/home/Home";
import { SpecificArticlePage } from "./pages/main-layout/article/SpecificArticlePage";
import { SearchArticlesPage } from "./pages/main-layout/article/SearchArticlesPage";
import { UpdateArticlePage } from "./pages/dashboard-layout/user/articles/UpdateArticlePage";
import { HasPreferences } from "./utils/guard/HasPreferences";
import { PreferencesPage } from "./pages/dashboard-layout/user/settings/PreferencesPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<IsAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path={"user/preferences"} element={<PreferencesPage />} />
        </Route>
      </Route>

      <Route element={<HasPreferences />}>
        {/* Main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<SpecificArticlePage />} />
          <Route path="/search" element={<SearchArticlesPage />} />
        </Route>

        {/* Dashboard layout */}
        <Route element={<IsAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Admin Role */}
            <Route path="admin"></Route>

            {/* User role */}
            <Route path="user">
              <Route path={"articles"} element={<UserArticlesPage />} />
              <Route path={"create-article"} element={<CreateArticlePage />} />
              <Route
                path={"article/:id/update"}
                element={<UpdateArticlePage />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
