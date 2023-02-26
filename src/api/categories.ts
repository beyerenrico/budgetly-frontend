import http from "./common";

const findAll = async (): Promise<Category[]> => {
  return (await http.get("/categories")).data;
};

const findOne = async (id: string): Promise<Category> => {
  return (await http.get(`/categories/${id}`)).data;
};

const create = async (data: CategoryCreate): Promise<Category> => {
  return (await http.post("/categories/", data)).data;
};

const update = async (
  id: string,
  data: CategoryUpdate
): Promise<UpdateResponse> => {
  return await http.put(`/categories/${id}`, data);
};

const remove = async (id: string): Promise<DeleteResponse> => {
  return await http.delete(`/categories/${id}`);
};

const CategoryService = { findAll, findOne, create, update, remove };

export default CategoryService;
