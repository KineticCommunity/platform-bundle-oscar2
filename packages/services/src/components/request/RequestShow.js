import React, { Fragment } from 'react';
import { Link } from '@reach/router';
import {
  Icon,
  TimeAgo,
  Utils as CommonUtils,
  ErrorMessage,
  LoadingMessage,
} from 'common';
import { bundle } from '@kineticdata/react';
import { RequestShowConfirmationContainer } from './RequestShowConfirmation';
import { RequestDiscussion } from './RequestDiscussion';
import { RequestActivityList } from './RequestActivityList';
import { CancelButtonContainer } from './CancelButton';
import { CommentButtonContainer } from './CommentButton';
import { CommentSubmission } from './CommentDisplay';
import { CloneButtonContainer } from './CloneButton';
import { FeedbackButtonContainer } from './FeedbackButton';
import { ViewDiscussionButtonContainer } from './ViewDiscussionButton';
import { SendMessageModal } from './SendMessageModal';
import * as constants from '../../constants';
import {
  getDueDate,
  getDurationInDays,
  getStatus,
  getSubmissionPath,
} from '../../utils';
import { ReviewRequest } from './ReviewRequest';
import { PageTitle } from '../shared/PageTitle';
import { CoreForm } from '@kineticdata/react';
import { I18n } from '@kineticdata/react';
import { isActiveClass } from '../../utils';

const globals = import('common/globals');

const getIcon = form =>
  CommonUtils.getAttributeValue(
    form,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_FORM_ICON,
  );

const ProfileLink = ({ submitter }) => (
  <Link to={`/profile/${encodeURIComponent(submitter)}`}>
    {submitter === bundle.identity() ? <I18n>you</I18n> : submitter}
  </Link>
);

const StatusItem = ({ submission }) => (
  <div className="data-list-row__col">
    <dl>
      <dt>
        <I18n>Status</I18n>:
      </dt>
      <dd>
        <I18n>{getStatus(submission)}</I18n>
      </dd>
    </dl>
  </div>
);

const DisplayDateItem = ({ submission }) =>
  !submission.submittedAt ? (
    <div className="data-list-row__col">
      <dl>
        <dt>
          <I18n>Created</I18n>:
        </dt>
        <dd>
          <TimeAgo timestamp={submission.createdAt} />
        </dd>
        <dd>
          <em>
            <I18n>by</I18n>
          </em>
          {` `}
          <ProfileLink submitter={submission.createdBy} />
        </dd>
      </dl>
    </div>
  ) : (
    <div className="data-list-row__col">
      <dl>
        <dt>
          <I18n>Submitted</I18n>:
        </dt>
        <dd className="text-truncate">
          <TimeAgo timestamp={submission.submittedAt} />
          <br />
          <small>
            <I18n>by</I18n>
            {` `}
            <ProfileLink submitter={submission.submittedBy} />
          </small>
        </dd>
      </dl>
    </div>
  );

const ServiceOwnerItem = ({ submission }) => {
  const serviceOwner = CommonUtils.getConfig({
    submission,
    name: constants.ATTRIBUTE_SERVICE_OWNING_TEAM,
  });
  return (
    !!serviceOwner && (
      <div className="data-list-row__col">
        <dl>
          <dt>
            <I18n>Service Owning Team</I18n>:
          </dt>
          <dd>
            {serviceOwner} <I18n>Team</I18n>
          </dd>
        </dl>
      </div>
    )
  );
};

const EstCompletionItem = ({ submission }) => {
  const dueDate = getDueDate(submission, constants.ATTRIBUTE_SERVICE_DAYS_DUE);
  return (
    submission.coreState === constants.CORE_STATE_SUBMITTED &&
    !!dueDate && (
      <div className="data-list-row__col">
        <dl>
          <dt>
            <I18n>Est. Completion</I18n>:
          </dt>
          <dd>
            <TimeAgo timestamp={dueDate} />
          </dd>
        </dl>
      </div>
    )
  );
};

const CompletedInItem = ({ submission }) => {
  const duration =
    submission.coreState === constants.CORE_STATE_CLOSED &&
    getDurationInDays(submission.createdAt, submission.closedAt);
  return (
    (duration || duration === 0) && (
      <div className="data-list-row__col">
        <dl>
          <dt>
            <I18n>Completed in</I18n>:
          </dt>
          <dd>
            {duration} {duration === 1 ? <I18n>day</I18n> : <I18n>days</I18n>}
          </dd>
        </dl>
      </div>
    )
  );
};

export const RequestShow = ({
  submission,
  error,
  listType,
  mode,
  discussion,
  sendMessageModalOpen,
  viewDiscussionModal,
  openDiscussion,
  closeDiscussion,
  kappSlug,
  appLocation,
  comments,
  spaceAdmin,
  editor,
  startingValues,
  handleCreated,
  handleError,
  formKey,
}) => (
  <div className="page-container page-container--color-bar">
    <div className="page-panel__body">
      {error && (
        <ErrorMessage
          title="Failed to load submission"
          message={error.message}
        />
      )}
      {!error && !submission && <LoadingMessage />}
      {!error &&
        submission && (
          <Fragment>
            <div className="submission-title">
              <h1>
                <Icon
                  image={getIcon(submission.form)}
                  background="greenGrass"
                />
                <I18n
                  context={`kapps.${kappSlug}.forms.${submission.form.slug}`}
                >
                  {submission.label}
                </I18n>
              </h1>
              {submission.form.name !== submission.label && (
                <p>{submission.form.name}</p>
              )}
            </div>

            {mode === 'confirmation' && (
              <div className="card card--submission-confirmation">
                <RequestShowConfirmationContainer submission={submission} />
              </div>
            )}

            <div className="submission-tabs">
              <ul className="nav nav-tabs">
                <li role="presentation">
                  <Link
                    to={getSubmissionPath(
                      appLocation,
                      submission,
                      null,
                      listType,
                    )}
                    getProps={isActiveClass()}
                  >
                    <I18n>Timeline</I18n>
                  </Link>
                </li>

                <li role="presentation">
                  <Link
                    to={`${getSubmissionPath(
                      appLocation,
                      submission,
                      'review',
                      listType,
                    )}`}
                    getProps={isActiveClass()}
                  >
                    <I18n>Review Request</I18n>
                  </Link>
                </li>
              </ul>
              <div className="submission-tabs__content">
                {mode === 'review' ? (
                  <ReviewRequest kappSlug={kappSlug} submission={submission} />
                ) : (
                  <RequestActivityList submission={submission} />
                )}
              </div>
            </div>
            <div id="commentSection" className="request-comments">
              <h2>Comments</h2>
              {comments.length > 0 ? (
                <table className="comments-table">
                  <thead>
                    <tr>
                      <th width="25%">Commenter</th>
                      <th width="75%">Comment</th>
                      <th width="15%">Attachment(s)</th>
                      <th width="10%">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(comment => (
                      <tr key={comment.id}>
                        <td>{comment.values['Commenter']}</td>
                        <td><div
                          dangerouslySetInnerHTML={{
                            __html:comment.values['Comment']
                          }}></div></td>
                        <td>
                          {comment.values['Attachment'] &&
                          comment.values['Attachment'].length
                            ? comment.values['Attachment'].map(attachment => (
                                <div key={attachment.name}>
                                  <a href={attachment.link}>
                                    {attachment.name}
                                  </a>
                                  <br />
                                </div>
                              ))
                            : ''}
                        </td>
                        {(spaceAdmin || editor === comment.submittedBy) && (
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link
                                className="btn btn-primary"
                                to={`/settings/datastore/comments/${
                                  comment.id
                                }`}
                              >
                                <span className="fa fa-fw fa-pencil" />
                              </Link>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                'Be the first to enter a comment'
              )}
              <CoreForm
                key={formKey}
                form="comments"
                datastore
                onCreated={handleCreated}
                onSubmitted={handleCreated}
                error={handleError}
                globals={globals}
                values={startingValues}
              />
            </div>
          </Fragment>
        )}
    </div>
    <div className="page-panel page-panel--three-fifths">
      <PageTitle parts={[submission && `#${submission.handle}`, 'Requests']} />
      {sendMessageModalOpen && <SendMessageModal submission={submission} />}
      <div className="page-panel__header">
        <Link
          className="nav-return"
          to={`${appLocation}/requests/${listType || ''}`}
        >
          <span className="fa fa-fw fa-chevron-left" />
          <I18n>{listType || 'All'} Requests</I18n>
        </Link>
        {!error &&
          submission && (
            <div className="submission__meta">
              <div className="data-list-row">
                <StatusItem submission={submission} />
                <div className="data-list-row__col">
                  <dl>
                    <dt>
                      <I18n>Confirmation #</I18n>
                    </dt>
                    <dd>{submission.handle}</dd>
                  </dl>
                </div>
                <DisplayDateItem submission={submission} />
                <ServiceOwnerItem submission={submission} />
                <EstCompletionItem submission={submission} />
                <CompletedInItem submission={submission} />
                <div className="col-lg-auto btn-group-col">
                  <CancelButtonContainer submission={submission} />
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  </div>
);
