import { Map } from 'immutable';
import { all, takeEvery, call, put, select } from 'redux-saga/effects';
import { actions, types } from '../modules/settingsQueue';
import { addSuccess, addError } from 'common';
import {
  fetchKapp,
  fetchForms,
  fetchForm,
  fetchTeams,
  fetchUsers,
  fetchSpace,
  updateKapp,
  searchSubmissions,
  SubmissionSearch,
} from '@kineticdata/react';

const QUEUE_SETTING_INCLUDES = 'formTypes,attributesMap,forms,forms.details';
const TEAMS_SETTING_INCLUDES = 'teams';
const SPACE_SETTING_INCLUDES = 'kapps,kapps.forms,attributesMap';
const FORM_INCLUDES = 'details,fields,attributesMap,categorizations,kapp';

export function* fetchQueueSettingsSaga() {
  const [{ serverError, kapp }, manageableForms] = yield all([
    call(fetchKapp, {
      include: QUEUE_SETTING_INCLUDES,
      kappSlug: 'queue',
    }),
    call(fetchForms, {
      kappSlug: 'queue',
      manage: 'true',
    }),
  ]);

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    const manageableFormsSlugs = (manageableForms.forms || []).map(
      form => form.slug,
    );
    yield put(
      actions.setQueueSettings({
        ...kapp,
        forms: (kapp.forms || []).map(form => ({
          ...form,
          canManage: manageableFormsSlugs.includes(form.slug),
        })),
      }),
    );
  }
}

export function* fetchTeamsSaga({ payload }) {
  const { serverError, teams } = yield call(fetchTeams, {
    include: TEAMS_SETTING_INCLUDES,
    teams: payload,
  });

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setQueueSettingsTeams(teams));
  }
}

export function* fetchUsersSaga() {
  const { serverError, users } = yield call(fetchUsers, {
    include: 'details',
  });

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setQueueSettingsUsers(users));
  }
}

export function* fetchSpaceSaga({ payload }) {
  const { serverError, space } = yield call(fetchSpace, {
    include: SPACE_SETTING_INCLUDES,
    space: payload,
  });

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setQueueSettingsSpace(space));
  }
}

export function* updateQueueSettingsSaga({ payload }) {
  const attributes = Map(payload)
    .filter(value => value)
    .map(value => (value.constructor === Array ? value : [value]))
    .toJS();

  const { serverError } = yield call(updateKapp, {
    include: QUEUE_SETTING_INCLUDES,
    kapp: {
      attributesMap: attributes,
    },
    kappSlug: 'queue',
  });

  if (serverError) {
    yield put(addError('Failed to update settings.', 'Update Settings'));
    yield put(actions.updateServicesSettingsError(serverError));
  } else {
    yield put(addSuccess('Updated settings successfully.', 'Update Settings'));
    const appActions = yield select(state => state.app.actions);
    yield put(appActions.refreshApp());
  }
}

export function* fetchNotificationsSaga() {
  const search = new SubmissionSearch(true)
    .index('values[Name]')
    .includes(['details', 'values'])
    .build();

  const { serverError, submissions } = yield call(searchSubmissions, {
    search,
    form: 'notification-data',
    datastore: true,
  });

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setNotifications(submissions));
  }
}

export function* fetchFormSaga(action) {
  const { serverError, form } = yield call(fetchForm, {
    kappSlug: action.payload.kappSlug,
    formSlug: action.payload.formSlug,
    include: FORM_INCLUDES,
  });

  if (serverError) {
    yield put(actions.updateQueueSettingsError(serverError));
  } else {
    yield put(actions.setForm(form));
  }
}

export function* watchSettingsQueue() {
  yield takeEvery(types.FETCH_QUEUE_SETTINGS, fetchQueueSettingsSaga);
  yield takeEvery(types.FETCH_QUEUE_SETTINGS_TEAMS, fetchTeamsSaga);
  yield takeEvery(types.FETCH_QUEUE_SETTINGS_USERS, fetchUsersSaga);
  yield takeEvery(types.FETCH_QUEUE_SETTINGS_SPACE, fetchSpaceSaga);
  yield takeEvery(types.UPDATE_QUEUE_SETTINGS, updateQueueSettingsSaga);
  yield takeEvery(types.FETCH_NOTIFICATIONS, fetchNotificationsSaga);
  yield takeEvery(types.FETCH_FORM, fetchFormSaga);
}
