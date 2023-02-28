import { request } from "./common";

const findAll = async (): Promise<Category[]> => {
  const response = await request("GET", "/categories", "AUTHENTICATED");

  return response.data as Category[];
};

const findOne = async (id: string): Promise<Category> => {
  const response = await request("GET", `/categories/${id}`, "AUTHENTICATED");

  return response.data as Category;
};

const create = async (data: CategoryCreate): Promise<Category> => {
  const response = await request<CategoryCreate>(
    "POST",
    "/categories",
    "AUTHENTICATED",
    data
  );

  return response.data as Category;
};

const update = async (
  id: string,
  data: CategoryUpdate
): Promise<UpdateResponse> => {
  const response = await request<CategoryCreate>(
    "PUT",
    `/categories/${id}`,
    "AUTHENTICATED",
    data
  );

  return response as unknown as UpdateResponse;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request(
    "DELETE",
    `/categories/${id}`,
    "AUTHENTICATED"
  );

  return response as unknown as DeleteResponse;
};

const CategoryService = { findAll, findOne, create, update, remove };

export default CategoryService;
