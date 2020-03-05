import React from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle } from 'recompose';
import { TimeAgo } from 'common';
import { Link } from 'react-router-dom';
import { RequestType } from './RequestType';
import { RequestImgs } from './RequestImgs';
import * as constants from '../../constants';
import { actions as countsActions } from '../../redux/modules/submissionCounts';

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

export const RequestCardLargeComponent = props => (
  <div className="card card--request">
    <div className="row">
      <div className="col-5">
        <Link to={props.path}>
          <h1>{props.submission.values.SocietyName}</h1>
        </Link>
      </div>
      <div className="col-4">
        <RequestType submission={props.submission} />
      </div>
      <div className="col-1">
        <dd className="comment-count">{props.commentCount} Existing<br/>Comments</dd>
      </div>
      <div className="col-2">
        <Link to={props.path} className="btn btn-primary">
          Add Comments
        </Link>
      </div>
    </div>
    <div className="row">
      <div className="col-4">
        <RequestImgs submission={props.submission} />
      </div>
      <div className="col-6">
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
      <div className="col-2">
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
        <div className="col-3">
          <dt>Confirmation</dt>
          <dd>{props.submission.handle}</dd>
        </div>
        <div className="col-3">
          <DisplayDateListItem submission={props.submission} />
        </div>
        <div className="col-3">
          <ClosedDateListItem submission={props.submission} />
        </div>
        <div className="col-1" />
        <div className="col-2">
          <Link to={props.path} className="btn btn-primary">
            View Submission
          </Link>
        </div>
      </div>
    </span>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  commentCount: state.submissionCounts.commentCount[ownProps.submission.id],
});

const mapDispatchToProps = {
  fetchCommentsCountsRequest: countsActions.fetchCommentsCountsRequest,
};

export const RequestCardLarge = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchCommentsCountsRequest(this.props.submission.id);
    },
  }),
)(RequestCardLargeComponent);
