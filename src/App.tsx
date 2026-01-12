import { Route, Routes } from "react-router-dom";
import { RegisterPage } from "./pages/auth/register/Register";
import { LoginPage } from "./pages/auth/login/Login";
import { MainLayout } from "./layout/MainLayout";
import { DashboardLayout } from "./layout/DashboardLayout";
import { UserArticlesPage } from "./pages/dashboard-layout/user/articles/UserArticlesPage";
import { CreateArticlePage } from "./pages/dashboard-layout/user/articles/CreateArticlePage";
import { HomePage } from "./pages/main-layout/home/Home";
import { SpecificArticlePage } from "./pages/main-layout/article/SpecificArticlePage";
import { SearchArticlesPage } from "./pages/main-layout/article/SearchArticlesPage";
import { UpdateArticlePage } from "./pages/dashboard-layout/user/articles/UpdateArticlePage";
import { HasPreferences } from "./utils/guard/HasPreferences";
import { PreferencesPage } from "./pages/dashboard-layout/user/settings/PreferencesPage";
import { IsAuth } from "./utils/guard/IsAuth";
import { ReportsSummaryPage } from "./pages/dashboard-layout/admin/ReportsSummaryPage";
import { ArticleReportsPage } from "./pages/dashboard-layout/admin/ArticleReportsPage";
import { WriterProfilePage } from "./pages/main-layout/writer/WriterProfilePage";
import { FriendRequestPage } from "./pages/main-layout/writer/FriendRequestPage";
import { UserProfileStatsPage } from "./pages/dashboard-layout/shared/UserProfileStatsPage";
import { SettingPage } from "./pages/dashboard-layout/shared/SettingPage";
import { ChatPage } from "./pages/main-layout/chat/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<HasPreferences />}>
        {/* Main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<SpecificArticlePage />} />
          <Route path="/search" element={<SearchArticlesPage />} />
          <Route path="/writer/:id" element={<WriterProfilePage />} />
          <Route path="/friend-requests" element={<FriendRequestPage />} />
        </Route>

        {/* Dashboard layout */}
        <Route element={<IsAuth />}>
          <Route element={<MainLayout />}>
            <Route path={'/chat/:id'} element={<ChatPage />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Admin Role */}
            <Route path="admin">
              <Route
                path={"articles-reports"}
                element={<ReportsSummaryPage />}
              />
              <Route
                path={"article/:id/reports"}
                element={<ArticleReportsPage />}
              />
            </Route>

            {/* User role */}
            <Route path="user">
              <Route path={"articles"} element={<UserArticlesPage />} />
              <Route path={"create-article"} element={<CreateArticlePage />} />
              <Route
                path={"article/:id/update"}
                element={<UpdateArticlePage />}
              />
              <Route path={"preferences"} element={<PreferencesPage />} />
            </Route>

            {/* Shared pages accessible by all authenticated users */}
            <Route path="shared">
              <Route path="profile" element={<UserProfileStatsPage />} />
              <Route path="setting" element={<SettingPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
