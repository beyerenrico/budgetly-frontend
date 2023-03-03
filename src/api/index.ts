import AuthenticationService from "./authentication";
import AccountService from "./accounts";
import CategoryService from "./categories";
import ContractService from "./contracts";
import NordigenService from "./nordigen";
import ReportService from "./reports";
import TransationService from "./transactions";

const api = {
  accounts: AccountService,
  categories: CategoryService,
  contracts: ContractService,
  reports: ReportService,
  transactions: TransationService,
  authentication: AuthenticationService,
  nordigen: NordigenService,
};

export default api;
