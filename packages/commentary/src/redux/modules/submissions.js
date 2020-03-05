import { List, Record } from 'immutable';
import { Utils } from 'common';
import * as constants from '../../constants';
const { noPayload, withPayload } = Utils;
const ns = Utils.namespaceBuilder('commentary/submissions');

export const types = {
  FETCH_SUBMISSIONS_REQUEST: ns('FETCH_SUBMISSIONS_REQUEST'),
  FETCH_SUBMISSIONS_NEXT: ns('FETCH_SUBMISSIONS_NEXT'),
  FETCH_SUBMISSIONS_PREVIOUS: ns('FETCH_SUBMISSIONS_PREVIOUS'),
  FETCH_SUBMISSIONS_CURRENT: ns('FETCH_SUBMISSIONS_CURRENT'),
  FETCH_SUBMISSIONS_SUCCESS: ns('FETCH_SUBMISSIONS_SUCCESS'),
  FETCH_SUBMISSIONS_FAILURE: ns('FETCH_SUBMISSIONS_FAILURE'),
  FETCH_HERALDIC_SUBMISSIONS: ns('FETCH_HERALDIC_SUBMISSIONS'),
  FETCH_HERALDIC_SUBMISSIONS_SUCCESS: ns('FETCH_HERALDIC_SUBMISSIONS_SUCCESS'),
  FETCH_HERALDIC_SUBMISSIONS_FAILURE: ns('FETCH_HERALDIC_SUBMISSIONS_FAILURE'),
  UPDATE_LOI: ns('UPDATE_LOI'),
  FETCH_LOI_SUBMISSIONS: ns('FETCH_LOI_SUBMISSIONS'),
  FETCH_LOI_SUBMISSIONS_SUCCESS: ns('FETCH_LOI_SUBMISSIONS_SUCCESS'),
  FETCH_LOI_SUBMISSIONS_FAILURE: ns('FETCH_LOI_SUBMISSIONS_FAILURE'),
  SET_LOI_SUBMISSIONS: ns('SET_LOI_SUBMISSIONS'),
  FETCH_LOI_SUBREQUESTS: ns('FETCH_LOI_SUBREQUESTS'),
  FETCH_LOI_SUBREQUESTS_SUCCESS: ns('FETCH_LOI_SUBREQUESTS_SUCCESS'),
  FETCH_LOI_SUBREQUESTS_FAILURE: ns('FETCH_LOI_SUBREQUESTS_FAILURE'),
};

export const actions = {
  fetchSubmissionsRequest: withPayload(types.FETCH_SUBMISSIONS_REQUEST),
  fetchSubmissionsNext: noPayload(types.FETCH_SUBMISSIONS_NEXT),
  fetchSubmissionsPrevious: noPayload(types.FETCH_SUBMISSIONS_PREVIOUS),
  fetchSubmissionsCurrent: noPayload(types.FETCH_SUBMISSIONS_CURRENT),
  fetchHeraldicSubmissions: noPayload(types.FETCH_HERALDIC_SUBMISSIONS),
  fetchHeraldicSubmissionsSuccess: withPayload(
    types.FETCH_HERALDIC_SUBMISSIONS_SUCCESS,
  ),
  fetchHeraldicSubmissionsFailure: withPayload(
    types.FETCH_HERALDIC_SUBMISSIONS_FAILURE,
  ),

  fetchSubmissions: coreState => ({
    type: types.FETCH_SUBMISSIONS,
    payload: { coreState },
  }),
  fetchNextPage: coreState => ({
    type: types.FETCH_NEXT_PAGE,
    payload: { coreState },
  }),
  fetchPreviousPage: coreState => ({
    type: types.FETCH_PREVIOUS_PAGE,
    payload: { coreState },
  }),
  fetchCurrentPage: coreState => ({
    type: types.FETCH_CURRENT_PAGE,
    payload: { coreState },
  }),
  setSubmissions: (submissions, nextPageToken) => ({
    type: types.SET_SUBMISSIONS,
    payload: { submissions, nextPageToken },
  }),
  updateLoi: newLists => ({
    type: types.UPDATE_LOI,
    payload: { newLists },
  }),
  fetchLoiSubrequests: submissions => ({
    type: types.FETCH_LOI_SUBREQUESTS,
    payload: submissions,
  }),
  fetchLoiSubrequestsSuccess: withPayload(types.FETCH_LOI_SUBREQUESTS_SUCCESS),
  fetchLoiSubrequestsFailure: withPayload(types.FETCH_LOI_SUBREQUESTS_FAILURE),
  fetchLoiSubmissions: submissions => ({
    type: types.FETCH_LOI_SUBMISSIONS,
    payload: submissions,
  }),
  fetchLoiSubmissionsSuccess: withPayload(types.FETCH_LOI_SUBMISSIONS_SUCCESS),
  fetchLoiSubmissionsFailure: withPayload(types.FETCH_LOI_SUBMISSIONS_FAILURE),
  setLoiSubmissions: (submissions, nextPageToken) => ({
    type: types.SET_LOI_SUBMISSIONS,
    payload: { submissions, nextPageToken },
  }),
};

export const State = Record({
  error: null,
  data: null,
  coreState: null,
  limit: constants.PAGE_SIZE,
  paging: false,
  pageToken: null,
  nextPageToken: null,
  previousPageTokens: List(),
  available: [],
  loi: [],
  subrequests: [],
  submission: null,
});

const reducer = (state = State(), { type, payload = {} }) => {
  switch (type) {
    case types.FETCH_SUBMISSIONS_REQUEST:
      return state
        .set('data', null)
        .set('error', null)
        .set('coreState', payload.coreState)
        .set('limit', payload.limit || constants.PAGE_SIZE)
        .set('pageToken', null)
        .set('nextPageToken', null)
        .set('previousPageTokens', List());
    case types.FETCH_SUBMISSIONS_NEXT:
      return state
        .update('previousPageTokens', t => t.push(state.pageToken))
        .set('pageToken', state.nextPageToken)
        .set('nextPageToken', null)
        .set('paging', true);
    case types.FETCH_SUBMISSIONS_PREVIOUS:
      return state
        .set('nextPageToken', null)
        .set('pageToken', state.previousPageTokens.last())
        .update('previousPageTokens', t => t.pop())
        .set('paging', true);
    case types.FETCH_SUBMISSIONS_CURRENT:
      return state.set('paging', true);
    case types.FETCH_SUBMISSIONS_SUCCESS:
      return state
        .set('data', List(payload.submissions))
        .set('nextPageToken', payload.nextPageToken)
        .set('paging', false);
    case types.FETCH_SUBMISSIONS_FAILURE:
      return state.set('error', payload).set('paging', false);
    case types.SET_LOI_SUBMISSION:
      return state
        .set('loading', false)
        .set('error', [])
        .set('submission', payload);
    case types.FETCH_LOI_SUBMISSIONS:
      //console.log("fetching Lois ")
      return state
        .set('data', null)
        .set('error', null)
        .set('coreState', payload.coreState)
        .set('limit', payload.limit || constants.PAGE_SIZE)
        .set('pageToken', null)
        .set('nextPageToken', null)
        .set('previousPageTokens', List())
        .set('loading', false)
        .set('available', [])
        .set('loi', [])
        .set('subrequests', []);
    case types.FETCH_LOI_SUBMISSIONS_SUCCESS:
      //console.log("reducer ", payload)
      return state
        .set('loi', payload.submissions)
        .set('nextPageToken', payload.nextPageToken)
        .set('paging', false);
    case types.FETCH_LOI_SUBMISSIONS_FAILURE:
      //console.log("error fetching Lois ")
      return state.set('error', payload).set('paging', false);
    case types.SET_LOI_SUBMISSIONS:
      return state
        .set('data', payload.submissions)
        .set('nextPageToken', payload.nextPageToken)
        .set('loading', false)
        .set('loi', payload.submissions);
    case types.UPDATE_LOI:
      return state
        .set('available', payload.newLists.newAvailable)
        .set('loi', payload.newLists.newLoi);
    case types.FETCH_HERALDIC_SUBMISSIONS:
      return state
        .set('data', null)
        .set('error', null)
        .set('coreState', payload.coreState)
        .set('limit', payload.limit || constants.PAGE_SIZE)
        .set('pageToken', null)
        .set('nextPageToken', null)
        .set('previousPageTokens', List());
    case types.FETCH_HERALDIC_SUBMISSIONS_SUCCESS:
      //console.log("reducer ", payload)
      return state
        .set('available', payload.submissions)
        .set('nextPageToken', payload.nextPageToken)
        .set('paging', false);
    case types.FETCH_HERALDIC_SUBMISSIONS_FAILURE:
      return state.set('error', payload).set('paging', false);
    case types.FETCH_LOI_SUBREQUESTS:
      //console.log("fetching Lois ")
      return state
        .set('data', null)
        .set('error', null)
        .set('coreState', payload.coreState)
        .set('limit', payload.limit || constants.PAGE_SIZE)
        .set('pageToken', null)
        .set('nextPageToken', null)
        .set('previousPageTokens', List())
        .set('loading', false)
        .set('available', [])
        .set('loi', [])
        .set('subrequests', []);
    case types.FETCH_LOI_SUBREQUESTS_SUCCESS:
      //console.log("reducer ", payload)
      return state.set('subrequests', payload).set('paging', false);
    case types.FETCH_LOI_SUBREQUESTS_FAILURE:
      //console.log("error fetching Lois ")
      return state.set('error', payload).set('paging', false);
    default:
      return state;
  }
};

export default reducer;
