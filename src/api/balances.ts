import { request } from "./common";

const findAll = async (): Promise<Balance[]> => {
  const response = await request("GET", "/balances", "AUTHENTICATED");

  return response.data as Balance[];
};

const findAllByAccount = async (
  accountId: Account["id"]
): Promise<Balance[]> => {
  const response = await request(
    "GET",
    `/balances/account/${accountId}`,
    "AUTHENTICATED"
  );

  return response.data as Balance[];
};

const findOne = async (id: string): Promise<Balance> => {
  const response = await request("GET", `/balances/${id}`, "AUTHENTICATED");

  return response.data as Balance;
};

const create = async (data: BalanceCreate): Promise<Balance> => {
  const response = await request<BalanceCreate>(
    "POST",
    "/balances",
    "AUTHENTICATED",
    data
  );

  return response.data as Balance;
};

const update = async (
  id: string,
  data: BalanceUpdate
): Promise<UpdateResponse> => {
  const response = await request<BalanceCreate>(
    "PUT",
    `/balances/${id}`,
    "AUTHENTICATED",
    data
  );

  return response as unknown as UpdateResponse;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request("DELETE", `/balances/${id}`, "AUTHENTICATED");

  return response as unknown as DeleteResponse;
};

const removeAllByAccount = async (accountId: Account["id"]): Promise<void> => {
  const response = await request(
    "DELETE",
    `/balances/account/${accountId}`,
    "AUTHENTICATED"
  );

  return response as unknown as void;
};

const BalanceService = {
  findAll,
  findAllByAccount,
  findOne,
  create,
  update,
  remove,
  removeAllByAccount,
};

export default BalanceService;
