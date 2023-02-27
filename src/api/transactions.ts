import http from "./common";

const findAll = async (): Promise<Transaction[]> => {
  return (await http.get("/transactions")).data;
};

const findAllByPlanner = async (plannerId: string): Promise<Transaction[]> => {
  return (await http.get(`/transactions/planner/${plannerId}`)).data;
};

const findOne = async (id: string): Promise<Transaction> => {
  return (await http.get(`/transactions/${id}`)).data;
};

const create = async (data: TransactionCreate): Promise<Transaction> => {
  return (await http.post("/transactions/", data)).data;
};

const update = async (
  id: string,
  data: TransactionUpdate
): Promise<UpdateResponse> => {
  return await http.put(`transactions/${id}`, data);
};

const remove = async (id: string): Promise<DeleteResponse> => {
  return await http.delete(`/transactions/${id}`);
};

const TransationService = {
  findAll,
  findAllByPlanner,
  findOne,
  create,
  update,
  remove,
};

export default TransationService;
