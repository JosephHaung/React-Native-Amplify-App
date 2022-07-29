// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Page = {
  "REHAB": "REHAB",
  "HEARING_ASSESSMENT": "HEARING_ASSESSMENT",
  "HEARING_CARE": "HEARING_CARE",
  "HEARING_TRY": "HEARING_TRY",
  "JOB_PROMOTION": "JOB_PROMOTION"
};

const SignUpMethod = {
  "GOOGLE_FORM": "GOOGLE_FORM",
  "CALENDAR": "CALENDAR",
  "APP_FORM": "APP_FORM"
};

const { Items, News } = initSchema(schema);

export {
  Items,
  News,
  Page,
  SignUpMethod
};