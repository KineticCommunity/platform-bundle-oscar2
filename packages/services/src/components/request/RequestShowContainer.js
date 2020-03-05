import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { selectDiscussionsEnabled } from 'common/src/redux/modules/common';
import { actions } from '../../redux/modules/submission';
import { actions as SubmissionsActions } from '../../redux/modules/submissions';
import { connect } from '../../redux/store';
import { addSuccess, addError } from 'common';

import { RequestShow } from './RequestShow';

export const openDiscussion = props => () => props.setViewDiscussionModal(true);

export const closeDiscussion = props => () =>
  props.setViewDiscussionModal(false);

export const getRandomKey = () =>
  Math.floor(Math.random() * (100000 - 100 + 1)) + 100;

export const handleError = props => response => {
  addError(response.error, 'Error');
};

export const handleCreated = props => (response, actions) => {
  //console.log(response, actions);
  props.fetchComments(props.submissionId);
  addSuccess(
    `Successfully created submission (${response.submission.handle})`,
    'Submission Created!',
  );
  props.setFormKey(getRandomKey());
};

export const mapStateToProps = (state, props) => ({
  submission: state.submission.data,
  error: state.submission.error,
  listType: props.type,
  mode: props.mode,
  discussion: state.submission.discussion,
  sendMessageModalOpen: state.submission.isSendMessageModalOpen,
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
  discussionsEnabled: selectDiscussionsEnabled(state),
  comments: state.submissions.comments,
  spaceAdmin: state.app.profile.spaceAdmin ? true : false,
  editor: state.app.profile.username,
  startingValues: state.submission.data
    ? {
        'Originating ID': state.submission.data.id,
        'Parent ID': state.submission.data.id,
      }
    : { 'Originating ID': '', 'Parent ID': '' },
});

export const mapDispatchToProps = {
  clearSubmission: actions.clearSubmissionRequest,
  fetchSubmission: actions.fetchSubmissionRequest,
  startPoller: actions.startSubmissionPoller,
  stopPoller: actions.stopSubmissionPoller,
  fetchDiscussion: actions.fetchDiscussionRequest,
  fetchComments: SubmissionsActions.fetchComments,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('viewDiscussionModal', 'setViewDiscussionModal', false),
  withState('formKey', 'setFormKey', getRandomKey),
  lifecycle({
    componentWillMount() {
      this.props.fetchSubmission(this.props.submissionId);
      this.props.fetchDiscussion(this.props.submissionId);
      this.props.startPoller(this.props.submissionId);
      this.props.fetchComments(this.props.submissionId);
    },
    componentWillUnmount() {
      this.props.clearSubmission();
      this.props.stopPoller();
    },
  }),
  withHandlers({
    openDiscussion,
    closeDiscussion,
    handleCreated,
    handleError,
  }),
);

export const RequestShowContainer = enhance(RequestShow);
