import { request } from "./common";

const findAll = async (): Promise<Contract[]> => {
  const response = await request("GET", "/contracts", "AUTHENTICATED");

  return response.data as Contract[];
};

const findOne = async (id: string): Promise<Contract> => {
  const response = await request("GET", `/contracts/${id}`, "AUTHENTICATED");

  return response.data as Contract;
};

const create = async (data: ContractCreate): Promise<Contract> => {
  const response = await request<ContractCreate>(
    "POST",
    "/contracts",
    "AUTHENTICATED",
    data
  );

  return response.data as Contract;
};

const update = async (
  id: string,
  data: ContractUpdate
): Promise<UpdateResponse> => {
  const response = await request<ContractCreate>(
    "PUT",
    `/contracts/${id}`,
    "AUTHENTICATED",
    data
  );

  return response as unknown as UpdateResponse;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request("DELETE", `/contracts/${id}`, "AUTHENTICATED");

  return response as unknown as DeleteResponse;
};

const ContractService = {
  findAll,
  findOne,
  create,
  update,
  remove,
};

export default ContractService;
