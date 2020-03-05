import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchBridgedResource } from '@kineticdata/react';
import { actions, types } from '../modules/activityList';

const getBridgedResource = type => {
  switch (type) {
    case 'incident':
      return {
        bridgedResourceName: 'Activity Incident - By Incident Id',
        idName: 'incident-id',
      };
    case 'workOrder':
      return {
        bridgedResourceName: 'Activity Work Order - By Work Order Id',
        idName: 'work-order-id',
      };
    case 'incidentWorkLogs':
      return {
        bridgedResourceName: 'Activity Incident Work Logs - By Incident Id',
        idName: 'incident-id',
      };
    case 'workOrderWorkLogs':
      return {
        bridgedResourceName: 'Activity Work Order Work Logs - By Work Order Id',
        idName: 'work-order-id',
      };
    default:
      return 'Activity Incident - By Incident Id';
  }
};

export function* fetchITSMRecordSaga(action) {
  const bridgedResourceName = getBridgedResource(action.payload.type)
    .bridgedResourceName;
  const idName = getBridgedResource(action.payload.type).idName;
  const { record, error } = yield call(fetchBridgedResource, {
    bridgedResourceName: bridgedResourceName,
    formSlug: 'shared-resources',
    kappSlug: 'services',
    values: { [idName]: action.payload.id },
  });

  if (error) {
    yield put(actions.fetchError(error));
  } else {
    yield put(actions.fetchSuccess(record));
  }
}

export function* fetchITSMWorkLogsSaga(action) {
  const bridgedResourceName = getBridgedResource(action.payload.type)
    .bridgedResourceName;
  const idName = getBridgedResource(action.payload.type).idName;
  console.log('b', bridgedResourceName, 'id', idName);
  const { records, error } = yield call(fetchBridgedResource, {
    bridgedResourceName: bridgedResourceName,
    formSlug: 'shared-resources',
    kappSlug: 'services',
    values: { [idName]: action.payload.id },
  });

  if (error) {
    yield put(actions.fetchError(error));
  } else {
    yield put(actions.fetchITSMWorkLogsSuccess(records));
  }
}

export function* watchActivityList() {
  yield takeEvery(types.FETCH_ITSM_RECORD, fetchITSMRecordSaga);
  yield takeEvery(types.FETCH_ITSM_WORK_LOGS, fetchITSMWorkLogsSaga);
}
