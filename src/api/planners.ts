import { request } from "./common";

const findAll = async (): Promise<Planner[]> => {
  const response = await request("GET", "/planners", "AUTHENTICATED");

  return response.data as Planner[];
};

const findOne = async (id: string): Promise<Planner> => {
  const response = await request("GET", `/planners/${id}`, "AUTHENTICATED");

  return response.data as Planner;
};

const create = async (data: PlannerCreate): Promise<Planner> => {
  const response = await request<PlannerCreate>(
    "POST",
    "/planners",
    "AUTHENTICATED",
    data
  );

  return response.data as Planner;
};

const update = async (
  id: string,
  data: PlannerUpdate
): Promise<UpdateResponse> => {
  const response = await request<PlannerCreate>(
    "PUT",
    `/planners/${id}`,
    "AUTHENTICATED",
    data
  );

  return response as unknown as UpdateResponse;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request("DELETE", `/planners/${id}`, "AUTHENTICATED");

  return response as unknown as DeleteResponse;
};

const PlannerService = { findAll, findOne, create, update, remove };

export default PlannerService;
