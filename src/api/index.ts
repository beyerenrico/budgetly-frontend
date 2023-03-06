import AccountService from "./accounts";
import AuthenticationService from "./authentication";
import BalanceService from "./balances";
import CategoryService from "./categories";
import ContractService from "./contracts";
import NordigenService from "./nordigen";
import ReportService from "./reports";
import RequisitionService from "./requisitions";
import TransationService from "./transactions";

const api = {
  accounts: AccountService,
  authentication: AuthenticationService,
  balances: BalanceService,
  categories: CategoryService,
  contracts: ContractService,
  nordigen: NordigenService,
  reports: ReportService,
  requisitions: RequisitionService,
  transactions: TransationService,
};

export default api;
