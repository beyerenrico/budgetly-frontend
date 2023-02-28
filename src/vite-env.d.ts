/// <reference types="vite/client" />

interface Planner {
  id: string;
  name: string;
  description: string;
  transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface PlannerCreate {
  name: string;
  description: string;
}

type PlannerUpdate = PlannerCreate;

interface Category {
  id: string;
  name: string;
  transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreate {
  id?: string;
  name: string;
}

type CategoryUpdate = CategoryCreate;

interface Contract {
  id: string;
  title: string;
  transactions?: Transaction[];
  planner: Planner | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractCreate {
  id?: string;
  title: string;
  planner: Planner | string | null;
}

type ContractUpdate = ContractCreate;

interface Transaction {
  id?: string;
  title: string;
  sender: string;
  receiver: string;
  amount: number;
  date: string;
  planner: Planner | string | null;
  category: Category | string | null;
  contract?: Contract | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreate {
  title: string;
  sender: string;
  receiver: string;
  amount: number;
  date: string;
  planner: string | null;
  category: string | null;
  contract?: string | null;
}

type TransactionUpdate = TransactionCreate;

interface UpdateResponse {
  raw: any;
  affected?: number;
  generatedMaps: Record<string, unknown>[];
}

interface DeleteResponse {
  raw: any;
  affected?: number;
}

interface SelectedPlannerStoreState {
  planner: Planner | null;
  setPlanner: (planner: Planner | null) => void;
}

interface Service<T> {
  findAll: () => Promise<T[]>;
  findOne: (id: string) => Promise<T>;
  create: (data: T) => Promise<T>;
  update: (id: string) => Promise<UpdateResponse>;
  remove: (id: string) => Promise<DeleteResponse>;
}
