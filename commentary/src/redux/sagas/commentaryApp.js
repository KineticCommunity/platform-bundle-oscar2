import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import {
  fetchForms,
  searchSubmissions,
  fetchTeams,
  SubmissionSearch,
} from '@kineticdata/react';
import { actions, types } from '../modules/commentaryApp';
import { addToastAlert } from 'common';

export function* fetchAppDataRequestSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);

  const [{ forms, error }] = yield all([
    call(fetchForms, {
      kappSlug,
      include: 'details,attributes',
    }),
  ]);

  if (error) {
    yield put(actions.fetchAppDataFailure(error));
    addToastAlert({
      title: 'Failed to load Commentary App.',
      message: error.message,
    });
  } else {
    yield put(
      actions.fetchAppDataSuccess({
        forms,
      }),
    );
  }
}

export function* fetchNewsSaga() {
  const searcher = new SubmissionSearch(true);
  searcher.index('values[Status]');
  searcher.eq('values[Status]', 'Active');

  const { submissions, nextPageToken = null, error } = yield call(
    searchSubmissions,
    {
      search: searcher.build(),
      datastore: true,
      form: 'news',
      include: 'values',
    },
  );

  if (error) {
    yield put(actions.fetchNewsFailure(error));
    addToastAlert({
      title: 'Failed to load News.',
      message: error.message,
    });
  } else {
    yield put(
      actions.fetchNewsSuccess({
        submissions,
      }),
    );
  }
}

export function* fetchKingdomsSaga() {
  const kappSlug = yield select(state => state.app.kappSlug);

  const {
    teams: { teams, error: teamsError },
  } = yield all({
    teams: call(fetchTeams, {
      include:
        'details,attributes,memberships.memberships.user,memberships.user.details',
      q: 'attributes[Group Type] = "Kingdom"',
    }),
  });

  if (teamsError) {
    yield put(actions.fetchKingdomsFailure(teamsError));
    addToastAlert({
      title: 'Failed to load Kingdoms.',
      message: teamsError.message,
    });
  } else {
    yield put(
      actions.fetchKingdomsSuccess({
        teams,
      }),
    );
  }
}

export function* watchCommentaryApp() {
  yield takeEvery(types.FETCH_APP_DATA_REQUEST, fetchAppDataRequestSaga);
  yield takeEvery(types.FETCH_NEWS, fetchNewsSaga);
  yield takeEvery(types.FETCH_KINGDOMS, fetchKingdomsSaga);
}
