import { request } from "./common";

const findAll = async (): Promise<Account[]> => {
  const response = await request("GET", "/accounts", "AUTHENTICATED");

  return response.data as Account[];
};

const findOne = async (id: string): Promise<Account> => {
  const response = await request("GET", `/accounts/${id}`, "AUTHENTICATED");

  return response.data as Account;
};

const create = async (data: AccountCreate): Promise<Account> => {
  const response = await request<AccountCreate>(
    "POST",
    "/accounts",
    "AUTHENTICATED",
    data
  );

  return response.data as Account;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request("DELETE", `/accounts/${id}`, "AUTHENTICATED");

  return response as unknown as DeleteResponse;
};

const AccountService = {
  findAll,
  findOne,
  create,
  remove,
};

export default AccountService;
