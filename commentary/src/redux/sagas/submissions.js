import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  fetchSubmission,
  searchSubmissions,
  SubmissionSearch,
} from '@kineticdata/react';

import * as constants from '../../constants';
import { actions, types } from '../modules/submissions';

export function* fetchSubmissionsRequestSaga({ payload }) {
  const kappSlug = yield select(state => state.app.kappSlug);
  const username = yield select(state => state.app.profile.username);
  const pageToken = yield select(state => state.submissions.pageToken);
  const coreState = yield select(state => state.submissions.coreState);
  const limit = yield select(state => state.submissions.limit);
  const searchBuilder = new SubmissionSearch()
    .type(constants.SUBMISSION_FORM_TYPE)
    .limit(limit)
    .includes([
      'details',
      'values',
      'form',
      'form.attributes',
      'form.kapp',
      'form.kapp.attributes',
      'form.kapp.space.attributes',
    ]);

  //Add some of the optional parameters to the search
  if (coreState && coreState === 'Draft') {
    searchBuilder
      .or()
      .eq('createdBy', username)
      .eq(`values[${constants.REQUESTED_BY_FIELD}]`, username)
      .end();
  } else {
    searchBuilder
      .or()
      .eq(`values[${constants.REQUESTED_FOR_FIELD}]`, username)
      .eq(`values[${constants.REQUESTED_BY_FIELD}]`, username)
      .eq('submittedBy', username)
      .eq('createdBy', username)
      .end();
  }
  if (coreState) searchBuilder.coreState(coreState);
  if (pageToken) searchBuilder.pageToken(pageToken);
  const search = searchBuilder.build();

  const { submissions, nextPageToken, error } = yield call(searchSubmissions, {
    search,
    kapp: kappSlug,
  });

  if (error) {
    yield put(actions.fetchSubmissionsFailure(error));
  } else {
    if (coreState) {
      yield put(
        actions.fetchSubmissionsSuccess({ submissions, nextPageToken }),
      );
    } else {
      // This is needed because we need to filter out Draft Submissions that were Requested For Someone Else but Requested By or Created By me
      const filterDraftNotCreatorOrRequestedBy = submissions.filter(
        s =>
          ['Submitted', 'Closed'].includes(s.coreState) ||
          (s.coreState === 'Draft' &&
            (s.createdBy === username ||
              s.values[`${constants.REQUESTED_BY_FIELD}`] === username)),
      );
      yield put(
        actions.fetchSubmissionsSuccess({
          submissions: filterDraftNotCreatorOrRequestedBy,
          nextPageToken,
        }),
      );
    }
  }
}

export function* fetchHeraldicSubmissionsSaga() {
  const searchBuilder = new SubmissionSearch()
    .type('Service')
    .limit(1000)
    .includes([
      'details',
      'values',
      'form',
      'form.attributes',
      'form.kapp',
      'form.kapp.attributes',
      'form.kapp.space.attributes',
    ]);

  searchBuilder.in('values[Status]', ['In Progress']);
  searchBuilder.coreState('Submitted');
  // Currently it's unlikly > 1000 records will be retrieved
  // if (pageToken) searchBuilder.pageToken(pageToken);
  const search = searchBuilder.build();

  const { submissions, nextPageToken, error } = yield call(searchSubmissions, {
    search,
    kapp: 'services',
  });

  if (error) {
    yield put(actions.fetchHeraldicSubmissionsFailure(error));
  } else {
    //console.log(submissions);
    yield put(
      actions.fetchHeraldicSubmissionsSuccess({ submissions, nextPageToken }),
    );
  }
}

export function* fetchLoiSubmissions() {
  const searchBuilder = new SubmissionSearch()
    .type('Letter')
    .limit(1000)
    .includes([
      'details',
      'values',
      'form',
      'form.attributes',
      'form.kapp',
      'form.kapp.attributes',
      'form.kapp.space.attributes',
    ]);

  //searchBuilder.in('values[Status]', ['In Progress']);
  searchBuilder.coreState('Draft');
  // Currently it's unlikly > 1000 records will be retrieved
  // if (pageToken) searchBuilder.pageToken(pageToken);
  const search = searchBuilder.build();

  const { submissions, nextPageToken, error } = yield call(searchSubmissions, {
    search,
    kapp: 'commentary',
  });

  if (error) {
    yield put(actions.fetchLoiSubmissionsFailure(error));
  } else {
    //  console.log("search results ", submissions);
    yield put(
      actions.fetchLoiSubmissionsSuccess({ submissions, nextPageToken }),
    );
  }
}

export function* fetchLoiSubrequests(action) {
  const include =
    'details,values,form,form.fields.details,form.kapp,form.attributes,form.kapp.attributes';
  // const subrequestIds = action.payload;
  //  console.log("loi id ", action.payload);

  const { submission, error } = yield call(fetchSubmission, {
    id: action.payload,
    include,
  });

  if (error) {
    yield put(actions.fetchSubmissionFailure(error));
  } else {
    const loiRequests =
      submission && submission.values
        ? JSON.parse(submission.values['JSON of Requests'])
        : [];
    //console.log(loiRequests);
    let handles = [];
    loiRequests.map((id, index) => handles.push(id.toUpperCase().substr(30)));

    const searchBuilder = new SubmissionSearch()
      .type('Service')
      .limit(1000)
      .includes([
        'details',
        'values',
        'form',
        'form.attributes',
        'form.kapp',
        'form.kapp.attributes',
        'form.kapp.space.attributes',
      ]);

    searchBuilder.in('handle', handles);
    // Currently it's unlikly > 1000 records will be retrieved
    // if (pageToken) searchBuilder.pageToken(pageToken);
    const search = searchBuilder.build();

    const { submissions, error } = yield call(searchSubmissions, {
      search,
      kapp: 'services',
    });

    //console.log("subrequest array to return ", submissions);

    if (error) {
      yield put(actions.fetchLoiSubrequestsFailure(error));
    } else {
      yield put(actions.fetchLoiSubrequestsSuccess(submissions));
    }
  }
}

export function* watchSubmissions() {
  yield takeEvery(
    [
      types.FETCH_SUBMISSIONS_REQUEST,
      types.FETCH_SUBMISSIONS_NEXT,
      types.FETCH_SUBMISSIONS_PREVIOUS,
      types.FETCH_SUBMISSIONS_CURRENT,
    ],
    fetchSubmissionsRequestSaga,
  );
  yield takeEvery(
    types.FETCH_HERALDIC_SUBMISSIONS,
    fetchHeraldicSubmissionsSaga,
  );
  yield takeEvery(types.FETCH_LOI_SUBMISSIONS, fetchLoiSubmissions);
  yield takeEvery(types.FETCH_LOI_SUBREQUESTS, fetchLoiSubrequests);
}
