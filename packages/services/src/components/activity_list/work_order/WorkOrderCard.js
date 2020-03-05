import React from 'react';
import { Link } from '@reach/router';
import { Icon, TimeAgo } from 'common';
import { I18n } from '@kineticdata/react';

const DisplayDateListItem = ({ workOrder }) => {
  return (
    <div className="col">
      <dt className="">
        <I18n>Submitted</I18n>
      </dt>
      <dd className="">
        <TimeAgo timestamp={workOrder['Created At']} />
      </dd>
    </div>
  );
};

const SubmissionSummary = ({ workOrder }) => (
  <p>
    <I18n>{workOrder.Summary}</I18n>
  </p>
);

const StatusPill = props => {
  let color = 'status--green';
  if (
    props.workOrder.Status === 'New' ||
    props.workOrder.Status === 'Resolved'
  ) {
    color = 'status--yellow';
  } else if (props.workOrder.Status === 'Cancelled') {
    color = 'status--red';
  } else if (
    props.workOrder.Status === 'Closed' ||
    props.workOrder.Status === 'Completed'
  ) {
    color = 'status--gray';
  }
  return (
    <span className={`status ${color}`}>
      <I18n>{props.workOrder.Status}</I18n>
    </span>
  );
};

export const WorkOrderCard = props => (
  <Link
    key={props.workOrder.Id}
    to={`/kapps/services/activity_list/work_order/${props.workOrder.Id}`}
    className="card card--request"
  >
    <h1>
      <Icon background="greenGrass" />
      <span>
        <I18n>{props.workOrder.Summary}</I18n>
      </span>
      <StatusPill workOrder={props.workOrder} />
    </h1>
    <SubmissionSummary workOrder={props.workOrder} />
    <span className="meta">
      <dl className="row">
        <div className="col">
          <dt>
            <I18n context="foo">Work Order Number</I18n>
          </dt>
          <dd>{props.workOrder.Id}</dd>
        </div>
        <DisplayDateListItem workOrder={props.workOrder} />
        {props.workOrder.Status !== 'Cancelled' &&
        props.workOrder.Status !== 'Closed' ? (
          <div className="col">
            <dt className="">
              <I18n>Updated</I18n>
            </dt>
            <dd className="">
              <TimeAgo timestamp={props.workOrder['Updated At']} />
            </dd>
          </div>
        ) : (
          <div className="col">
            <dt className="">
              <I18n>{props.workOrder.Status}</I18n>
            </dt>
            <dd className="">
              <TimeAgo timestamp={props.workOrder['Updated At']} />
            </dd>
          </div>
        )}
      </dl>
    </span>
  </Link>
);
