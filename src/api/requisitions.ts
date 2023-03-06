import { request } from "./common";

const findAll = async (): Promise<Requisition[]> => {
  const response = await request("GET", "/requisitions", "AUTHENTICATED");

  return response.data as Requisition[];
};

const findOne = async (id: string): Promise<Requisition> => {
  const response = await request("GET", `/requisitions/${id}`, "AUTHENTICATED");

  return response.data as Requisition;
};

const create = async (data: Requisition): Promise<Requisition> => {
  const response = await request<Requisition>(
    "POST",
    "/requisitions",
    "AUTHENTICATED",
    data
  );

  return response.data as Requisition;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request(
    "DELETE",
    `/requisitions/${id}`,
    "AUTHENTICATED"
  );

  return response as unknown as DeleteResponse;
};

const RequisitionService = {
  findAll,
  findOne,
  create,
  remove,
};

export default RequisitionService;
