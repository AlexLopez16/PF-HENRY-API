export interface Query {
  limit?: number;
  init?: number;
  name?: string;
  tecnologies?: string;
  orderBy?: string;
  typeOfOrder?: string;
  categories?: string;
  stateProject?: string;
}

export interface InitialQuery {
  state: boolean;
  name?: {};
  requirements?: {};
  category?: {};
  stateOfProject?: {};

}

export interface InitialQuery2 {
  name?: {};
  requirements?: {};
  category?: {};
  stateOfProject?: {};

}

interface Company {
  _id: string;
  name: string;
}

export interface InitialProject {
  reviews: any[];
  name: string;
  description: string;
  participants: number;
  requirements: string[];
  state: boolean;
  students: string[];
  company: Company;
  category: string;
  stateOfProject: string;
  accepts: any[];
  uid: string;
}

export interface Error {
  msg: string;
}

export interface InitialError {
  errors: Error[];
}


export interface InitialCreateProject {
  name: string,
  description: string,
  participants: number,
  image: string,
  requirements: string[],
  category?: string,
  stateOfProject?: string[]

}