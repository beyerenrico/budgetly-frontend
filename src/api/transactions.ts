import { request } from "./common";

const findAll = async (): Promise<Transaction[]> => {
  const response = await request("GET", "/transactions", "AUTHENTICATED");

  return response.data as Transaction[];
};

const findAllByPlanner = async (plannerId: string): Promise<Transaction[]> => {
  const response = await request(
    "GET",
    `/transactions/planner/${plannerId}`,
    "AUTHENTICATED"
  );

  return response.data as Transaction[];
};

const findOne = async (id: string): Promise<Transaction> => {
  const response = await request("GET", `/transactions/${id}`, "AUTHENTICATED");

  return response.data as Transaction;
};

const create = async (data: TransactionCreate): Promise<Transaction> => {
  const response = await request<TransactionCreate>(
    "POST",
    "/transactions",
    "AUTHENTICATED",
    data
  );

  return response.data as Transaction;
};

const update = async (
  id: string,
  data: TransactionUpdate
): Promise<UpdateResponse> => {
  const response = await request<TransactionCreate>(
    "PUT",
    `/transactions/${id}`,
    "AUTHENTICATED",
    data
  );

  return response as unknown as UpdateResponse;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request(
    "DELETE",
    `/transactions/${id}`,
    "AUTHENTICATED"
  );

  return response as unknown as DeleteResponse;
};

const TransactionService = {
  findAll,
  findAllByPlanner,
  findOne,
  create,
  update,
  remove,
};

export default TransactionService;
