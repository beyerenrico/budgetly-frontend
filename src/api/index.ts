import CategoryService from "./categories";
import ContractService from "./contracts";
import PlannerService from "./planners";
import TransationService from "./transactions";

const api = {
  categories: CategoryService,
  contracts: ContractService,
  planners: PlannerService,
  transactions: TransationService,
};

export default api;
