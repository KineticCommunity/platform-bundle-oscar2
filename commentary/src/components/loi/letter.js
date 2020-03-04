import React, { Fragment } from 'react';
import { connect } from '../../redux/store';
import { compose, lifecycle, withHandlers } from 'recompose';
import { actions } from '../../redux/modules/submission';
import { actions as SubmissionsActions } from '../../redux/modules/submissions';
import { KappLink as Link, PageTitle } from 'common';
import { RequestCardLarge } from '../shared/RequestCardLarge';
import { updateSubmission } from '@kineticdata/react';
import { getSubmissionPath } from '../../utils';

export const Letter = ({
  submission,
  available,
  loi,
  fetchSubmissionRequest,
  fetchLoiSubrequests,
  subrequests,
}) => {
  // const loiRequests = submission && submission.values ? JSON.parse(submission.values['JSON of Requests']) : [];
  const loiTitle =
    submission && submission.values ? submission.values['Title'] : '';
  //console.log("loi ", submission, loiTitle);
  // if (loiRequests !== [] && typeof subrequests === "undefined"){
  //   fetchLoiSubrequests(loiRequests);
  //}
  const loiSubrequests = subrequests;
  //console.log("loi subrequests", loiSubrequests, subrequests);
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-panel page-panel--transparent page-panel--two-thirds page-panel--iloi">
        <div className="page-title">
          <div className="page-title__wrapper">
            <h3>LoI /</h3>
          </div>
        </div>
        <h2>{loiTitle}</h2>
        <div className="letter__wrapper">
          <div className="cards__wrapper cards__wrapper--requests">
            {loiSubrequests.length > 0 ? (
              loiSubrequests
                .map((submission, index) => ({
                  submission,
                  index,
                  key: submission.id,
                  path: getSubmissionPath(
                    '/kapps/services',
                    submission,
                    'review',
                    'Open',
                  ),
                }))
                .map(props => <RequestCardLarge {...props} />)
            ) : (
              <div className="card card--empty-state">
                <h1>There are no requests in this ILoI.</h1>
              </div>
            )}
          </div>
          <br />
        </div>
      </div>
    </Fragment>
  );
};

const updateLoi = ({
  loi,
  navigate,
  currentKingdom,
  currentMonth,
  currentYear,
  //  setError,
}) => async e => {
  //  e.preventDefault();
  console.log('updateLoi', loi, currentKingdom);
  const loiList = loi.map(submission => submission.id);
  //try {
  const updatedSubmission = await updateSubmission({
    kappSlug: 'commentary',
    formSlug: 'iloi',
    values: {
      'JSON of Requests': JSON.stringify(loiList),
      Kingdom: currentKingdom,
      Title:
        currentKingdom +
        ' Internal Letter for ' +
        currentMonth +
        ', ' +
        currentYear,
    },
    authAssumed: true,
    completed: false,
  });
};

const mapStateToProps = state => ({
  submission: state.submission.data,
  available: state.submissions.available,
  loi: state.submissions.loi,
  subrequests: state.submissions.subrequests,
});

const mapDispatchToProps = {
  fetchSubmissionRequest: actions.fetchSubmissionRequest,
  fetchLoiSubmissions: SubmissionsActions.fetchLoiSubmissions,
  fetchLoiSubrequests: SubmissionsActions.fetchLoiSubrequests,
};

export const LoIContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    updateLoi,
  }),
  lifecycle({
    componentWillMount() {
      //console.log("checking id.");
      //console.log(this.props);
      this.props.fetchSubmissionRequest(this.props.id);
      this.props.fetchLoiSubrequests(this.props.id);
    },
  }),
)(Letter);
