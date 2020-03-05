import React from 'react';
import { TimeAgo } from 'common';
import { Link } from 'react-router-dom';
import { LetterType } from './LetterType';
import * as constants from '../../constants';

const DisplayDateListItem = ({ submission }) => {
  const isDraft = submission.coreState === constants.CORE_STATE_DRAFT;
  return (
    <div className="col">
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
    <div className="col">
      <dt className="">Closed</dt>
      <dd className="">
        <TimeAgo timestamp={submission.closedAt} />
      </dd>
    </div>
  );

export const LetterCard = props => (
  <Link to={props.path} className="card card--request">
    <h1 className="row">
      <div className="col-6">
        <span>{props.submission.values.Title}</span>
      </div>
      <div className="col-4">
        <LetterType submission={props.submission} />
      </div>
      <div className="col-2" />
    </h1>
    <span className="meta">
      <dl className="row">
        <div className="col">
          <dt>Expiration</dt>
          <dd>{props.submission.values.Expiration}</dd>
        </div>
        <DisplayDateListItem submission={props.submission} />

        <ClosedDateListItem submission={props.submission} />
      </dl>
    </span>
  </Link>
);
