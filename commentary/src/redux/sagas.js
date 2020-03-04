import { all } from 'redux-saga/effects';
import { watchCommentaryApp } from './sagas/commentaryApp';
import { watchSubmissions } from './sagas/submissions';
import { watchSubmission, watchSubmissionPoller } from './sagas/submission';
import { watchSubmissionCounts } from './sagas/submissionCounts';

export default function*() {
  yield all([
    watchCommentaryApp(),
    watchSubmissions(),
    watchSubmission(),
    watchSubmissionPoller(),
    watchSubmissionCounts(),
  ]);
}
