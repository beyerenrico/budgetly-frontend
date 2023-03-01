import CategoryService from "./categories";
import ContractService from "./contracts";
import ReportService from "./reports";
import TransationService from "./transactions";
import AuthenticationService from "./authentication";

const api = {
  categories: CategoryService,
  contracts: ContractService,
  reports: ReportService,
  transactions: TransationService,
  authentication: AuthenticationService,
};

export default api;
