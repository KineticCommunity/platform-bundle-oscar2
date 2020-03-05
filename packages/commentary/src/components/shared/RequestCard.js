import React from 'react';
import { TimeAgo } from 'common';
import { Link } from 'react-router-dom';
import { RequestType } from './RequestType';
import { RequestImgs } from './RequestImgs';
import * as constants from '../../constants';

const DisplayDateListItem = ({ submission }) => {
  const isDraft = submission.coreState === constants.CORE_STATE_DRAFT;
  return (
    <div className="col-4">
      <dt className="">{isDraft ? 'Created' : 'Submitted'}</dt>
      <dd className="">
        <TimeAgo
          timestamp={isDraft ? submission.createdAt : submission.submittedAt}
        />
      </dd>
    </div>
  );
};

const ClosedDateListItem = ({ submission }) =>
  submission.coreState === constants.CORE_STATE_CLOSED && (
    <div className="col-4">
      <dt className="">Closed</dt>
      <dd className="">
        <TimeAgo timestamp={submission.closedAt} />
      </dd>
    </div>
  );

export const RequestCard = props => (
  <div className="card card--request">
    <div className="row">
      <div className="col-6">
        <Link to={props.path}>
          <h1>{props.submission.values.SocietyName}</h1>
        </Link>
      </div>
      <div className="col-5">
        <RequestType submission={props.submission} />
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        <RequestImgs submission={props.submission} />
      </div>
    </div>
    <div className="row">
      <div className="col-7">
        {props.submission.values.LoIBlazon || props.submission.values.Blazon ? (
          <dt>Blazon</dt>
        ) : (
          <dt />
        )}
        {props.submission.values.LoIBlazon ? (
          <dd>{props.submission.values.LoIBlazon}</dd>
        ) : (
          <dd>{props.submission.values.Blazon}</dd>
        )}
      </div>
      <div className="col-5">
      {props.submission.values.Blazon ?
        <Link
          to={
            '/kapps/services/forms/update-blazon?values[Parent%20ID]=' +
            props.submission.id
          }
          className="btn btn-secondary"
        >
          Update Blazon
        </Link>
        : ''}
      </div>
    </div>
    <span className="meta">
      <div className="row">
        <div className="col-4">
          <dt>Confirmation</dt>
          <dd>{props.submission.handle}</dd>
        </div>
        <DisplayDateListItem submission={props.submission} />

        <ClosedDateListItem submission={props.submission} />
      </div>
      <div className="row">
        <div className="col-6">
          <Link to={props.path} className="btn btn-primary" target="_blank">
            View Submission
          </Link>
        </div>
        <div className="col-6">
          <Link to={props.path} className="btn btn-primary" target="_blank">
            Add Comments
          </Link>
        </div>
      </div>
    </span>
  </div>
);
