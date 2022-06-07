import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type EventsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type NewsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Events {
  readonly id: string;
  readonly name: string;
  readonly description?: (string | null)[] | null;
  readonly imageKey?: string | null;
  readonly page: string;
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