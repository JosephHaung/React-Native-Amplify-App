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



type EventsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type NewsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Events {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly images?: (string | null)[] | null;
  readonly page: Page | keyof typeof Page;
  readonly signUpMethod: SignUpMethod | keyof typeof SignUpMethod;
  readonly formLink?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Events, EventsMetaData>);
  static copyOf(source: Events, mutator: (draft: MutableModel<Events, EventsMetaData>) => MutableModel<Events, EventsMetaData> | void): Events;
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