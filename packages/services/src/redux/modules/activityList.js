import { Record } from 'immutable';
import { Utils } from 'common';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('services/activityList');

export const types = {
  FETCH_ITSM_RECORD: ns('FETCH_ITSM_RECORD'),
  FETCH_ITSM_WORK_LOGS: ns('FETCH_ITSM_WORK_LOGS'),
  FETCH_ITSM_WORK_LOGS_SUCCESS: ns('FETCH_ITSM_WORK_LOGS_SUCCESS'),
  FETCH_ACTIVITY_SUCCESS: ns('FETCH_ACTIVITY_SUCCESS'),
  FETCH_ACTIVITY_FAILURE: ns('FETCH_ACTIVITY_FAILURE'),
  CLEAR_ACTIVITY: ns('CLEAR_ACTIVITY'),
};

export const actions = {
  fetchITSMRecord: withPayload(types.FETCH_ITSM_RECORD),
  fetchITSMWorkLogs: withPayload(types.FETCH_ITSM_WORK_LOGS),
  fetchITSMWorkLogsSuccess: withPayload(types.FETCH_ITSM_WORK_LOGS_SUCCESS),
  fetchSuccess: withPayload(types.FETCH_ACTIVITY_SUCCESS),
  fetchError: withPayload(types.FETCH_ACTIVITY_FAILURE),
  clearActivity: withPayload(types.CLEAR_ACTIVITY),
};

export const State = Record({
  error: null,
  data: null,
  loading: null,
  workLogs: [],
});

const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_ITSM_RECORD:
      return state
        .set('data', null)
        .set('error', null)
        .set('loading', true);
    case types.FETCH_ITSM_WORK_LOGS:
      return state
        .set('data', null)
        .set('error', null)
        .set('loading', true);
    case types.FETCH_ACTIVITY_SUCCESS:
      return state.set('data', payload).set('loading', false);
    case types.FETCH_ACTIVITY_FAILURE:
      return state.set('error', payload);
    case types.FETCH_ITSM_WORK_LOGS_SUCCESS:
      return state.set('workLogs', payload).set('loading', false);
    case types.CLEAR_ACTIVITY:
      return State();
    default:
      return state;
  }
};

export default reducer;
