
const mainPath = '/api/v1'

export const ApiEndpoints = {
  register: `${mainPath}/register`,
  login: `${mainPath}/login`,
  getLoggedInUser: `${mainPath}/auth`,
  getCategories: `${mainPath}/category`,
  listCreateArticle: (query: string="") => `${mainPath}/article?${query}`,
  listCreateTag:  `${mainPath}/tag`,
  getDeleteArticle:  (id: string)=>`${mainPath}/article/${id}`,
  likeArticle: (articleId: string) => `${mainPath}/article/${articleId}/like`,
  dislikeArticle: (articleId: string) => `${mainPath}/article/${articleId}/dislike`,
  saveArticle: `${mainPath}/articles/save`,
  unsaveArticle: `${mainPath}/articles/unsave`,
  
}