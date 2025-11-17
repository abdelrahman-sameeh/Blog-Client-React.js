
const mainPath = '/api/v1'

export const ApiEndpoints = {
  register: `${mainPath}/register`,
  login: `${mainPath}/login`,
  getLoggedInUser: `${mainPath}/auth`,
  getCategories: `${mainPath}/category`,
  listCreateArticle: (query: string = "") => `${mainPath}/article?${query}`,
  listMineArticle: (query: string = "") => `${mainPath}/mine/article?${query}`,
  getHomePageArticles:(query: string = "") => `${mainPath}/articles/home${query}`,
  listCreateTag: `${mainPath}/tag`,
  getDeleteArticle: (id: string) => `${mainPath}/article/${id}`,
  likeArticle: (articleId: string) => `${mainPath}/article/${articleId}/like`,
  dislikeArticle: (articleId: string) => `${mainPath}/article/${articleId}/dislike`,
  saveArticle: `${mainPath}/articles/save`,
  unsaveArticle: `${mainPath}/articles/unsave`,
  getReviewReplies: (commentId: string) => `${mainPath}/review/${commentId}/reply`,
  likeReply: (reviewId: string) => `${mainPath}/review/${reviewId}/like`,
  dislikeReply: (reviewId: string) => `${mainPath}/review/${reviewId}/dislike`,
  createComment: `${mainPath}/review`,
  createReply: `${mainPath}/reply`,
  deleteReview: (reviewId: string) => `${mainPath}/review/${reviewId}`,
  getFilters: `${mainPath}/filters`,
  updateArticle: (id: string) => `${mainPath}/article/${id}`,
  deleteArticleBlock: (articleId: string, articleBlockId: string) => `${mainPath}/article/${articleId}/block/${articleBlockId}`,
  createArticleBlock: (articleId: string) => `${mainPath}/article/${articleId}/block`,
  preferences: `${mainPath}/preferences`,
  getReportsSummary: (query: string = '') => `${mainPath}/reports/summary${query}`,
  getReportReasons: `${mainPath}/reasons`,
  createReport: (articleId: string) => `${mainPath}/article/${articleId}/report`,
  getArticleReport: (articleId: string) => `${mainPath}/article/${articleId}/reports`,
  changeReportStatus: (reportId: string) => `${mainPath}/report/${reportId}`
}