import { reducer as app } from './modules/app';
import { reducer as commentaryApp } from './modules/commentaryApp';
import submissionsReducer from './modules/submissions';
import submissionReducer from './modules/submission';
import submissionCountsReducer from './modules/submissionCounts';

export default {
  app,
  commentaryApp,
  submissions: submissionsReducer,
  submission: submissionReducer,
  submissionCounts: submissionCountsReducer,
};
