import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Page {
  REHAB = "REHAB",
  HEARING_ASSESSMENT = "HEARING_ASSESSMENT",
  HEARING_CARE = "HEARING_CARE",
  HEARING_TRY = "HEARING_TRY",
  JOB_PROMOTION = "JOB_PROMOTION"
}

export enum SignUpMethod {
  GOOGLE_FORM = "GOOGLE_FORM",
  CALENDAR = "CALENDAR",
  APP_FORM = "APP_FORM"
}



type ItemsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type NewsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Items {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly images?: (string | null)[] | null;
  readonly page: Page | keyof typeof Page;
  readonly signUpMethod: SignUpMethod | keyof typeof SignUpMethod;
  readonly formLink?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Items, ItemsMetaData>);
  static copyOf(source: Items, mutator: (draft: MutableModel<Items, ItemsMetaData>) => MutableModel<Items, ItemsMetaData> | void): Items;
}

export declare class News {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<News, NewsMetaData>);
  static copyOf(source: News, mutator: (draft: MutableModel<News, NewsMetaData>) => MutableModel<News, NewsMetaData> | void): News;
}