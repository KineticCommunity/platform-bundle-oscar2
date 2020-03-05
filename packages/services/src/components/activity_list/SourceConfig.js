import React from 'react';
import { RequestCard } from '../shared/RequestCard';
import { IncidentCard } from './incident/IncidentCard';
import { WorkOrderCard } from './work_order/WorkOrderCard';
import * as constants from '../../constants';
import {
  I18n,
  searchSubmissions,
  SubmissionSearch,
  fetchBridgedResource,
} from '@kineticdata/react';

export const emptyStateMessage = type => {
  switch (type) {
    case 'Draft': {
      return "You have no draft requests. Draft services are forms you started but haven't submitted yet.";
    }
    case 'Open': {
      return 'You have no open requests. If you request something, it will show up here.';
    }
    case 'Closed': {
      return "Closed requests are services you've requested that have been completed or canceled.";
    }
    default: {
      return 'No requests found. Submit a service and it will show up here!';
    }
  }
};

export const getDataSource = ({ name, type }) => {
  switch (name) {
    case 'ce': {
      let search = new SubmissionSearch()
        .include('details,values,form,form.attributes,form.kapp.attributes')
        .type(constants.SUBMISSION_FORM_TYPE)
        .or()
        .eq(`values[${constants.REQUESTED_BY_FIELD}]`, bundle.identity())
        .eq(`values[${constants.REQUESTED_FOR_FIELD}]`, bundle.identity())
        .end();
      search = type
        ? search.coreState(requestType(type)).build()
        : search.build();
      return {
        fn: searchSubmissions,
        params: (prevParams, prevResult) =>
          prevParams && prevResult
            ? prevResult.nextPageToken
              ? { ...prevParams, pageToken: prevResult.nextPageToken }
              : null
            : {
                limit: 20,
                kapp: 'services',
                search,
              },
        transform: result => ({
          data: result.submissions.map(s => ({
            updatedAt: s.updatedAt,
            submission: s,
            path: `/kapps/services/requests/request/${s.id}/activity`,
          })),
          nextPageToken: result.nextPageToken,
        }),
        component: RequestCard,
      };
    }
    case 'incident': {
      let bridgedResourceName = 'Activity Incident - By Submitter';
      if (type === 'Open')
        bridgedResourceName = 'Activity Incident - By Submitter Open';
      if (type === 'Closed')
        bridgedResourceName = 'Activity Incident - By Submitter Closed';

      return {
        fn: fetchBridgedResource,
        params: (prevParams, prevResult, options) =>
          prevParams && prevResult
            ? prevResult.nextPageToken
              ? {
                  ...prevParams,
                  metadata: { pageToken: prevResult.nextPageToken },
                }
              : null
            : {
                kappSlug: 'services',
                formSlug: 'shared-resources',
                bridgedResourceName,
              },
        transform: result => ({
          data: result.records.map(s => {
            return {
              updatedAt: s['Updated At'],
              incident: s,
              status: s['Status'],
            };
          }),
          nextPageToken: result.metadata.nextPageToken,
        }),
        component: IncidentCard,
      };
    }
    case 'workOrder': {
      let bridgedResourceName = 'Activity Work Order - By Submitter';
      if (type === 'Open')
        bridgedResourceName = 'Activity Work Order - By Submitter Open';
      if (type === 'Closed')
        bridgedResourceName = 'Activity Work Order - By Submitter Closed';

      return {
        fn: fetchBridgedResource,
        params: (prevParams, prevResult, options) =>
          prevParams && prevResult
            ? prevResult.nextPageToken
              ? {
                  ...prevParams,
                  metadata: { pageToken: prevResult.nextPageToken },
                }
              : null
            : {
                kappSlug: 'services',
                formSlug: 'shared-resources',
                bridgedResourceName,
              },
        transform: result => ({
          data: result.records.map(s => {
            return {
              updatedAt: s['Updated At'],
              workOrder: s,
              status: s['Status'],
            };
          }),
          nextPageToken: result.metadata.nextPageToken,
        }),
        component: WorkOrderCard,
      };
    }
    default: {
      return 'No requests found. Submit a service and it will show up here!';
    }
  }
};

const requestType = type => {
  switch (type) {
    case 'Draft': {
      return 'Draft';
    }
    case 'Open': {
      return 'Submitted';
    }
    case 'Closed': {
      return 'Closed';
    }
    default: {
      return 'Submitted';
    }
  }
};
