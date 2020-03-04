import { connect } from '../../redux/store';
import { compose, lifecycle, withHandlers } from 'recompose';
import { letter } from './letter';
import { actions } from '../../redux/modules/submissions';

const handleDrag = ({ updateLoi, submissions, loi }) => ({
  source,
  destination,
}) => {
  let newAvailable = submissions;
  let newLoi = loi;

  console.log(source, destination);

  // dropped outside the list
  if (!destination) {
    return;
  }

  //if dropped in the same listType
  if (source.droppableId === destination.droppableId) {
    if (source.index !== destination.index) {
      if (source.droppableId === 'requests') {
        const submission = submissions.get(source.index);
        const update = submissions.delete(source.index);
        newAvailable = update.insert(destination.index, submission);
      } else {
        const submission = loi.get(source.index);
        const update = loi.delete(source.index);
        newLoi = update.insert(destination.index, submission);
      }
    } else {
      //no move
      return;
    }
  } else {
    if (source.droppableId === 'requests') {
      const submission = submissions.get(source.index);
      newAvailable = submissions.delete(source.index);
      newLoi = loi.insert(destination.index, submission);
    } else {
      const submission = loi.get(source.index);
      newLoi = loi.delete(source.index);
      newAvailable = submissions.insert(destination.index, submission);
    }
  }

  updateLoi({ newLoi: newLoi, newAvailable: newAvailable });
};

const mapStateToProps = state => ({
  submission: state.submission.data,
  submissions: state.submissions.available,
  loi: state.submissions.loi,
});

const mapDispatchToProps = {
  fetchNewSubmissions: actions.fetchNewSubmissions,
  fetchLoiSubmission: actions.fetchLoiSubmission,
  fetchLoiSubmissions: actions.fetchLoiSubmissions,
  updateLoi: actions.updateLoi,
};

export const LoIContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    handleDrag,
  }),
  lifecycle({
    componentWillMount() {
      //console.log("checking id.");
      console.log(this.props);
      this.props.fetchLoiSubmission(this.props.match.params.id);
    },
  }),
)(letter);
