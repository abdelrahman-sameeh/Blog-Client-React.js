
const mainPath = '/api/v1'

export const ApiEndpoints = {
  register: `${mainPath}/register`,
  login: `${mainPath}/login`,
  getLoggedInUser: `${mainPath}/auth`,
  getCategories: `${mainPath}/category`,
  listCreateArticle: (query: string="") => `${mainPath}/article?${query}`,
  listCreateTag:  `${mainPath}/tag`,

}