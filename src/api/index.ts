import AuthenticationService from "./authentication";
import CardService from "./cards";
import CategoryService from "./categories";
import ContractService from "./contracts";
import NordigenService from "./nordigen";
import ReportService from "./reports";
import TransationService from "./transactions";

const api = {
  cards: CardService,
  categories: CategoryService,
  contracts: ContractService,
  reports: ReportService,
  transactions: TransationService,
  authentication: AuthenticationService,
  nordigen: NordigenService,
};

export default api;
