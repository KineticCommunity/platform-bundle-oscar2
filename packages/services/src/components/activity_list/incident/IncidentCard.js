import React from 'react';
import { Link } from '@reach/router';
import { Icon, TimeAgo } from 'common';
import { I18n } from '@kineticdata/react';

const DisplayDateListItem = ({ incident }) => {
  return (
    <div className="col">
      <dt className="">
        <I18n>Submitted</I18n>
      </dt>
      <dd className="">
        <TimeAgo timestamp={incident['Created At']} />
      </dd>
    </div>
  );
};

const SubmissionSummary = ({ incident }) => (
  <p>
    <I18n>{incident.summary}</I18n>
  </p>
);

const StatusPill = props => {
  let color = 'status--green';
  if (props.incident.Status === 'New' || props.incident.Status === 'Resolved') {
    color = 'status--yellow';
  } else if (props.incident.Status === 'Cancelled') {
    color = 'status--red';
  } else if (
    props.incident.Status === 'Closed' ||
    props.incident.Status === 'Completed'
  ) {
    color = 'status--gray';
  }
  return (
    <span className={`status ${color}`}>
      <I18n>{props.incident.Status}</I18n>
    </span>
  );
};

export const IncidentCard = props => (
  <Link
    key={props.incident.Id}
    to={`/kapps/services/activity_list/incident/${props.incident.Id}`}
    className="card card--request"
  >
    <h1>
      <Icon background="greenGrass" />
      <span>
        <I18n>{props.incident.Summary}</I18n>
      </span>
      <StatusPill incident={props.incident} />
    </h1>
    <SubmissionSummary incident={props.incident} />
    <span className="meta">
      <dl className="row">
        <div className="col">
          <dt>
            <I18n context="foo">Incident Number</I18n>
          </dt>
          <dd>{props.incident.Id}</dd>
        </div>
        <DisplayDateListItem incident={props.incident} />
        {props.incident.Status !== 'Cancelled' &&
        props.incident.Status !== 'Closed' ? (
          <div className="col">
            <dt className="">
              <I18n>Updated</I18n>
            </dt>
            <dd className="">
              <TimeAgo timestamp={props.incident['Updated At']} />
            </dd>
          </div>
        ) : (
          <div className="col">
            <dt className="">
              <I18n>{props.incident.Status}</I18n>
            </dt>
            <dd className="">
              <TimeAgo timestamp={props.incident['Updated At']} />
            </dd>
          </div>
        )}
      </dl>
    </span>
  </Link>
);
