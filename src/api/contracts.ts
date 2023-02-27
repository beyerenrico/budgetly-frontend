import http from "./common";

const findAll = async (): Promise<Contract[]> => {
  return (await http.get("/contracts")).data;
};

const findAllByPlanner = async (plannerId: string): Promise<Contract[]> => {
  return (await http.get(`/contracts/planner/${plannerId}`)).data;
};

const findOne = async (id: string): Promise<Contract> => {
  return (await http.get(`/contracts/${id}`)).data;
};

const create = async (data: ContractCreate): Promise<Contract> => {
  return (await http.post("/contracts/", data)).data;
};

const update = async (
  id: string,
  data: ContractUpdate
): Promise<UpdateResponse> => {
  return await http.put(`contracts/${id}`, data);
};

const remove = async (id: string): Promise<DeleteResponse> => {
  return await http.delete(`/contracts/${id}`);
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
