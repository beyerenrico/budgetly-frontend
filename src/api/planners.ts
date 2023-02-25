import http from "./common";

const findAll = async (): Promise<Planner[]> => {
  return (await http.get("/planners")).data;
};

const findOne = async (id: string): Promise<Planner> => {
  return (await http.get(`/planners/${id}`)).data;
};

const create = async (data: PlannerCreate): Promise<Planner> => {
  return (await http.post("/planners/", data)).data;
};

const update = async (
  id: string,
  data: PlannerUpdate
): Promise<UpdateResponse> => {
  return await http.put(`/planners/${id}`, data);
};

const remove = async (id: string): Promise<DeleteResponse> => {
  return await http.delete(`/planners/${id}`);
};

const PlannerService = { findAll, findOne, create, update, remove };

export default PlannerService;
