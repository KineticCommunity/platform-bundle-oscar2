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

const StatusItem = ({ incident }) => (
  <div className="data-list-row__col">
    <dl>
      <dt>
        <I18n>Status</I18n>:
      </dt>
      <dd>
        <I18n>{incident.Status}</I18n>
      </dd>
    </dl>
  </div>
);

const DisplayDateItem = ({ incident }) => (
  <div className="data-list-row__col">
    <dl>
      <dt>
        <I18n>Created</I18n>:
      </dt>
      <dd>
        <TimeAgo timestamp={moment(incident['Created At'])} />
      </dd>
    </dl>
  </div>
);

export const Incident = ({
  incident,
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
        <PageTitle parts={[incident && `#${incident.Id}`, 'Requests']} />
        <div className="page-panel__header">
          <Link
            className="nav-return"
            to={`${appLocation}/requests/${listType || ''}`}
          >
            <span className="fa fa-fw fa-chevron-left" />
            <I18n>{listType || 'All'} Requests</I18n>
          </Link>
          {!error &&
            incident && (
              <div className="submission__meta">
                <div className="data-list-row">
                  <StatusItem incident={incident} />
                  <div className="data-list-row__col">
                    <dl>
                      <dt>
                        <I18n>Confirmation #</I18n>
                      </dt>
                      <dd>{incident.Id}</dd>
                    </dl>
                  </div>
                  <DisplayDateItem incident={incident} />
                  <div className="col-lg-auto btn-group-col" />
                </div>
              </div>
            )}
        </div>
        <div className="page-panel__body">
          {error && (
            <ErrorMessage
              title="Failed to load incident"
              message={error.message}
            />
          )}
          {!error && !incident && <LoadingMessage />}
          {!error &&
            incident && (
              <Fragment>
                <div className="submission-title">
                  <h1>
                    <Icon background="greenGrass" />
                    <I18n>{incident.Summary}</I18n>
                  </h1>
                  <p>
                    {incident.Notes.split('\n').map((item, i) => (
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
                          values={{ 'incident-id': incident.Id }}
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
