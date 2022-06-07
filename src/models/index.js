// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Events, News } = initSchema(schema);

export {
  Events,
  News
};