import CategoryService from "./categories";
import ContractService from "./contracts";
import PlannerService from "./planners";
import TransationService from "./transactions";
import AuthenticationService from "./authentication";

const api = {
  categories: CategoryService,
  contracts: ContractService,
  planners: PlannerService,
  transactions: TransationService,
  authentication: AuthenticationService,
};

export default api;
