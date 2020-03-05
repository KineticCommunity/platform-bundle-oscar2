import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import {
  Icon,
  TimeAgo,
  Utils as CommonUtils,
  ErrorMessage,
  LoadingMessage,
} from 'common';
import moment from 'moment';
import { PageTitle } from '../../shared/PageTitle';
import { I18n } from '@kineticdata/react';
import { ITSMWorkLogs, AddITSMWorkLog } from '../ITSMWorkLogs';

const StatusItem = ({ workOrder }) => (
  <div className="data-list-row__col">
    <dl>
      <dt>
        <I18n>Status</I18n>:
      </dt>
      <dd>
        <I18n>{workOrder.Status}</I18n>
      </dd>
    </dl>
  </div>
);

const DisplayDateItem = ({ workOrder }) => (
  <div className="data-list-row__col">
    <dl>
      <dt>
        <I18n>Created</I18n>:
      </dt>
      <dd>
        <TimeAgo timestamp={moment(workOrder['Created At'])} />
      </dd>
    </dl>
  </div>
);

export const WorkOrder = ({
  workOrder,
  error,
  listType,
  kappSlug,
  appLocation,
  loading,
  workLogs,
}) =>
  !loading && (
    <div className="page-container page-container--panels page-container--color-bar">
      <div className="page-panel page-panel--three-fifths">
        <PageTitle parts={[workOrder && `#${workOrder.Id}`, 'Requests']} />
        <div className="page-panel__header">
          <Link
            className="nav-return"
            to={`${appLocation}/requests/${listType || ''}`}
          >
            <span className="fa fa-fw fa-chevron-left" />
            <I18n>{listType || 'All'} Requests</I18n>
          </Link>
          {!error &&
            workOrder && (
              <div className="submission__meta">
                <div className="data-list-row">
                  <StatusItem workOrder={workOrder} />
                  <div className="data-list-row__col">
                    <dl>
                      <dt>
                        <I18n>Confirmation #</I18n>
                      </dt>
                      <dd>{workOrder.Id}</dd>
                    </dl>
                  </div>
                  <DisplayDateItem workOrder={workOrder} />
                  <div className="col-lg-auto btn-group-col" />
                </div>
              </div>
            )}
        </div>
        <div className="page-panel__body">
          {error && (
            <ErrorMessage
              title="Failed to load work order"
              message={error.message}
            />
          )}
          {!error && !workOrder && <LoadingMessage />}
          {!error &&
            workOrder && (
              <Fragment>
                <div className="submission-title">
                  <h1>
                    <Icon background="greenGrass" />
                    <I18n>{workOrder.Summary}</I18n>
                  </h1>
                  <p>
                    {workOrder.Notes.split('\n').map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                  </p>
                </div>
                <div className="itsm">
                  <h4>Work Log Entries</h4>
                  {!error && !workLogs && <LoadingMessage />}
                  {!error &&
                    workLogs && (
                      <Fragment>
                        <ITSMWorkLogs workLogs={workLogs} />
                        <AddITSMWorkLog
                          kappSlug={kappSlug}
                          values={{ 'work-order-id': workOrder.Id }}
                          formSlug="add-work-log"
                        />
                      </Fragment>
                    )}
                </div>
              </Fragment>
            )}
        </div>
      </div>
    </div>
  );
