import { Record, List } from 'immutable';
import { Utils } from 'common';
const { withPayload, noPayload } = Utils;
const ns = Utils.namespaceBuilder('commentary/app');

export const types = {
  FETCH_APP_DATA_REQUEST: ns('FETCH_APP_DATA_REQUEST'),
  FETCH_APP_DATA_SUCCESS: ns('FETCH_APP_DATA_SUCCESS'),
  FETCH_APP_DATA_FAILURE: ns('FETCH_APP_DATA_FAILURE'),
  FETCH_NEWS: ns('FETCH_NEWS'),
  FETCH_NEWS_SUCCESS: ns('FETCH_NEWS_SUCCESS'),
  FETCH_NEWS_FAILURE: ns('FETCH_NEWS_FAILURE'),
  FETCH_KINGDOMS: ns('FETCH_KINGDOMS'),
  FETCH_KINGDOMS_SUCCESS: ns('FETCH_KINGDOMS_SUCCESS'),
  FETCH_KINGDOMS_FAILURE: ns('FETCH_KINGDOMS_FAILURE'),
  SET_CURRENT_KINGDOM: ns('SET_CURRENT_KINGDOM'),
  SET_CURRENT_MONTH: ns('SET_CURRENT_MONTH'),
  SET_CURRENT_YEAR: ns('SET_CURRENT_YEAR'),
};

export const actions = {
  fetchAppDataRequest: withPayload(types.FETCH_APP_DATA_REQUEST),
  fetchAppDataSuccess: withPayload(types.FETCH_APP_DATA_SUCCESS),
  fetchAppDataFailure: withPayload(types.FETCH_APP_DATA_FAILURE),
  fetchNews: noPayload(types.FETCH_NEWS),
  fetchNewsSuccess: withPayload(types.FETCH_NEWS_SUCCESS),
  fetchNewsFailure: withPayload(types.FETCH_NEWS_FAILURE),
  fetchKingdoms: noPayload(types.FETCH_KINGDOMS),
  fetchKingdomsSuccess: withPayload(types.FETCH_KINGDOMS_SUCCESS),
  fetchKingdomsFailure: withPayload(types.FETCH_KINGDOMS_FAILURE),
  setCurrentKingdom: withPayload(types.SET_CURRENT_KINGDOM),
  setCurrentMonth: withPayload(types.SET_CURRENT_MONTH),
  setCurrentYear: withPayload(types.SET_CURRENT_YEAR),
};

export const State = Record({
  loading: true,
  error: null,
  forms: null,
  news: [],
  kingdoms: [],
  currentKingdom: '',
  currentMonth: '',
  //currentYear: '',
  currentYear: new Date().getFullYear(),
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_APP_DATA_REQUEST:
      return state.set('error', null);
    case types.FETCH_APP_DATA_SUCCESS:
      return state.set('forms', List(payload.forms)).set('loading', false);
    case types.FETCH_APP_DATA_FAILURE:
      return state.set('error', payload);
    case types.FETCH_NEWS:
      return state.set('error', null);
    case types.FETCH_NEWS_SUCCESS:
      return state.set('news', List(payload.submissions));
    case types.FETCH_NEWS_FAILURE:
      return state.set('error', payload);
    case types.FETCH_KINGDOMS:
      return state.set('error', null);
    case types.FETCH_KINGDOMS_SUCCESS:
      return state.set('kingdoms', payload.teams);
    case types.FETCH_KINGDOMS_FAILURE:
      return state.set('error', payload);
    case types.SET_CURRENT_KINGDOM:
      console.log('payload ', payload);
      return state.set('currentKingdom', payload);
    case types.SET_CURRENT_MONTH:
      console.log('payload ', payload);
      return state.set('currentMonth', payload);
    case types.SET_CURRENT_YEAR:
      console.log('payload ', payload);
      return state.set('currentYear', payload);
    default:
      return state;
  }
};
