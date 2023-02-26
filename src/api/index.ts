import CategoryService from "./categories";
import PlannerService from "./planners";
import TransationService from "./transactions";

const api = {
  categories: CategoryService,
  planners: PlannerService,
  transactions: TransationService,
};

export default api;
