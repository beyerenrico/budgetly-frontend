import { request } from "./common";

const findAll = async (): Promise<Report[]> => {
  const response = await request("GET", "/reports", "AUTHENTICATED");

  return response.data as Report[];
};

const findOne = async (id: string): Promise<Report> => {
  const response = await request("GET", `/reports/${id}`, "AUTHENTICATED");

  return response.data as Report;
};

const create = async (data: ReportCreate): Promise<Report> => {
  const response = await request<ReportCreate>(
    "POST",
    "/reports",
    "AUTHENTICATED",
    data
  );

  return response.data as Report;
};

const update = async (
  id: string,
  data: ReportUpdate
): Promise<UpdateResponse> => {
  const response = await request<ReportCreate>(
    "PUT",
    `/reports/${id}`,
    "AUTHENTICATED",
    data
  );

  return response as unknown as UpdateResponse;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request("DELETE", `/reports/${id}`, "AUTHENTICATED");

  return response as unknown as DeleteResponse;
};

const ReportService = { findAll, findOne, create, update, remove };

export default ReportService;
