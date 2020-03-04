import React, { Fragment } from 'react';
import { KappLink as Link, PageTitle } from 'common';
import { connect } from '../../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { actions } from '../../redux/modules/submissions';
import { actions as CommentaryActions } from '../../redux/modules/commentaryApp';
import { actions as submissionActions } from '../../redux/modules/submission';
import { RequestCard } from '../shared/RequestCard';
import { getSubmissionPath } from '../../utils';
import { I18n } from '@kineticdata/react';
import { List } from 'immutable';

const handleKingdomChange = setCurrentKingdom => e =>
  setCurrentKingdom(e.target.value);

const handleMonthChange = setCurrentMonth => e =>
  setCurrentMonth(e.target.value);

const monthOptions = [
  { value: '', label: 'None Selected' },
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
];

const handleYearChange = setCurrentYear => e => setCurrentYear(e.target.value);

const yearOptions = [
  { value: '2020', label: '2020' },
  { value: '2021', label: '2021' },
  { value: '2022', label: '2022' },
  { value: '2023', label: '2023' },
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' },
  { value: '2028', label: '2028' },
  { value: '2029', label: '2029' },
  { value: '2030', label: '2030' },
  { value: '2031', label: '2031' },
];

const SelectableCard = props => {
  return (
    <div className="selectable-card">
      <div className="row">
        <div className="col-1">
          <input
            checked={props.submission.isChecked}
            onChange={props.handleCheckBoxSelect}
            type="checkbox"
            value={props.submission.id}
            data-list-name={props.listName}
            data-func-name={props.listFuncName}
          />
        </div>
        <div className="col-11">
          <RequestCard {...props} />
        </div>
      </div>
    </div>
  );
};

export const NewILoI = ({
  fetchNewSubmissions,
  kingdoms,
  currentKingdom,
  currentMonth,
  currentYear,
  setCurrentKingdom,
  setCurrentMonth,
  setCurrentYear,
  handleCheckBoxSelect,
  handleMoveSubILoi,
  handleListAction,
  localAvailableList,
  subIloiList,
  handleCreateIloi,
}) => {
  const noKingdom = { name: 'None Selected' };
  const allK = [...kingdoms, noKingdom];

  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container page-container--newiloi container">
        <div className="row">
          <div className="form-group col-4">
            <label htmlFor="Kingdom">
              <I18n>Kingdom</I18n>
            </label>
            <select
              id="Kingdom"
              name="Kingdom"
              className="form-control"
              onChange={handleKingdomChange(setCurrentKingdom)}
              value={currentKingdom}
            >
              {allK.map(kingdom => (
                <option value={kingdom.name} key={`${kingdom.name}`}>
                  {kingdom.name}
                </option>
              ))}
            </select>
            <small>
              <I18n>Kingdom this letter is for.</I18n>
            </small>
          </div>
          <div className="col-2">
            <I18n>letter for</I18n>
          </div>
          <div className="form-group col-4">
            <label htmlFor="Month">
              <I18n>Month</I18n>
            </label>
            <select
              id="Month"
              name="Month"
              className="form-control"
              onChange={handleMonthChange(setCurrentMonth)}
              value={currentMonth}
            >
              {monthOptions.map(month => (
                <option value={month.value} key={`${month.label}`}>
                  {month.label}
                </option>
              ))}
            </select>
            <small>
              <I18n>Month this letter is for.</I18n>
            </small>
          </div>
          <div className="form-group col-2">
            <label htmlFor="Year">
              <I18n>Year</I18n>
            </label>
            <select
              id="Year"
              name="Year"
              className="form-control"
              onChange={handleYearChange(setCurrentYear)}
              value={currentYear}
            >
              <option value="">
                <I18n>None Selected</I18n>
              </option>
              {yearOptions.map(year => (
                <option value={year.label} key={`${year.label}`}>
                  {year.value}
                </option>
              ))}
            </select>
            <small>
              <I18n>Year this letter is for.</I18n>
            </small>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-5">
            <button
              onClick={handleListAction}
              value="localAvailableList"
              data-action="add"
              data-func-name="setlocalAvailableList"
              className="btn btn-primary"
            >
              Select All
            </button>
            <button
              onClick={handleListAction}
              value="localAvailableList"
              data-action="remove"
              data-func-name="setlocalAvailableList"
              className="btn btn-primary"
            >
              Remove Selections
            </button>
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>Available Requests</h3>
              </div>
            </div>
            {localAvailableList.size > 0 ? (
              localAvailableList
                .sort((a, b) =>
                  a.values.SocietyName.toUpperCase().localeCompare(
                    b.values.SocietyName.toUpperCase(),
                  ),
                )
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
                  deleteCallback: fetchNewSubmissions,
                  handleCheckBoxSelect,
                  listName: 'localAvailableList',
                  listFuncName: 'setlocalAvailableList',
                }))
                .map(props => <SelectableCard key={props.id} {...props} />)
            ) : (
              <div className="card card--empty-state">
                <h1>There are no requests pending ILoI.</h1>
              </div>
            )}
          </div>
          <div className="col-2">
            <button
              onClick={handleMoveSubILoi}
              data-source-name="localAvailableList"
              data-source-func-name="setlocalAvailableList"
              data-dest-name="subIloiList"
              data-dest-func-name="setSubIloiList"
              className="btn btn-primary"
            >
              <i className="fa fa-chevron-right" aria-hidden="true" />
              <i className="fa fa-chevron-right" aria-hidden="true" />
            </button>
            <button
              onClick={handleMoveSubILoi}
              data-source-name="subIloiList"
              data-source-func-name="setSubIloiList"
              data-dest-name="localAvailableList"
              data-dest-func-name="setlocalAvailableList"
              className="btn btn-primary"
            >
              <i className="fa fa-chevron-left" aria-hidden="true" />
              <i className="fa fa-chevron-left" aria-hidden="true" />
            </button>
          </div>
          <div className="col-5">
            <button
              onClick={handleListAction}
              value="subIloiList"
              data-action="add"
              data-func-name="setSubIloiList"
              className="btn btn-primary"
            >
              Select All
            </button>
            <button
              onClick={handleListAction}
              value="subIloiList"
              data-action="remove"
              data-func-name="setSubIloiList"
              className="btn btn-primary"
            >
              Remove Selections
            </button>
            <div className="page-title">
              <div className="page-title__wrapper">
                <h3>ILoI /</h3>
              </div>
            </div>
            <div>
              {subIloiList.size > 0 ? (
                subIloiList
                  .sort((a, b) =>
                    a.values.SocietyName.toUpperCase().localeCompare(
                      b.values.SocietyName.toUpperCase(),
                    ),
                  )
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
                    deleteCallback: fetchNewSubmissions,
                    handleCheckBoxSelect,
                    listName: 'subIloiList',
                    listFuncName: 'setSubIloiList',
                  }))
                  .sort()
                  .map(props => <SelectableCard {...props} />)
              ) : (
                <div className="card card--empty-state">
                  <h1>There are no requests in this ILoI.</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-10" />
        <div className="col-2">
          <button
            type="button"
            className="btn btn-primary pull-right"
            onClick={handleCreateIloi}
          >
            Create Draft ILoi
          </button>
        </div>
      </div>
    </Fragment>
  );
};

/***********************************************************************************
 * The following three functions manage the selection of subIloi's and the movement
 * of subIloi's between lists.  All function are generic and driven off the data
 * attributes of the events that triggered them.
 *
 * data-list-name = The name of the list that the event relates to.
 * data-func-name = The name of the function that acts on the list
 * data-source-name = The name of the list that subIloi's will be moving from
 * data-source-func-name = The name of the function that acts on the list
 * data-dest-name = The name of the list that subIloi's will be moving to
 * data-dest-func-name = The name of the function that acts on the list
 * data-action = If checkbox's will be selected or deselected
 */
const handleCheckBoxSelect = props => event => {
  const listName = event.target.getAttribute('data-list-name');
  props[event.target.getAttribute('data-func-name')](
    props[listName].update(
      props[listName].findIndex(
        submission => submission.id == event.target.value,
      ),
      submission => ({ ...submission, isChecked: !submission.isChecked }),
    ),
  );
};
const handleMoveSubILoi = props => event => {
  const sourceName = event.currentTarget.getAttribute('data-source-name');
  // Get a list of submissions before the submission object is mutated
  const notChecked = props[sourceName].filter(
    submission => !submission.isChecked,
  );
  props[event.currentTarget.getAttribute('data-dest-func-name')](
    props[event.currentTarget.getAttribute('data-dest-name')].concat(
      props[sourceName]
        .filter(submission => submission.isChecked)
        .map(submission => ({ ...submission, isChecked: false })),
    ),
  );
  props[event.currentTarget.getAttribute('data-source-func-name')](notChecked);
};
const handleListAction = props => event => {
  props[event.target.getAttribute('data-func-name')](
    props[event.target.value].map(submission => ({
      ...submission,
      isChecked:
        event.target.getAttribute('data-action') == 'add' ? true : false,
    })),
  );
};
/*********************************************************************************/

const handleCreateIloi = props => event => {
  //console.log("create",props);
  const subIloiIds = props.subIloiList.reduce((acc, submission) => {
    acc.push(submission.id);
    return acc;
  }, []);
  props.createNewLoi({
    subIloiIds,
    currentKingdom: props.currentKingdom,
    currentMonth: props.currentMonth,
    currentYear: props.currentYear,
    callback: submissionId =>
      props.navigate(`/kapps/commentary/loi/${submissionId}`),
  });
};

const mapStateToProps = state => ({
  available: state.submissions.available,
  loi: state.submissions.loi,
  kingdoms: state.commentaryApp.kingdoms,
  thisstate: state,
  currentKingdom: state.commentaryApp.currentKingdom
    ? state.commentaryApp.currentKingdom
    : 'None Selected',
  currentMonth: state.commentaryApp.currentMonth
    ? state.commentaryApp.currentMonth
    : '',
  currentYear: state.commentaryApp.currentYear,
});

const mapDispatchToProps = {
  fetchHeraldicSubmissions: actions.fetchHeraldicSubmissions,
  fetchKingdoms: CommentaryActions.fetchKingdoms,
  setCurrentKingdom: CommentaryActions.setCurrentKingdom,
  setCurrentMonth: CommentaryActions.setCurrentMonth,
  setCurrentYear: CommentaryActions.setCurrentYear,
  createNewLoi: submissionActions.createIloi,
};

export const NewILoIContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('localAvailableList', 'setlocalAvailableList', List()),
  withState('subIloiList', 'setSubIloiList', List()),
  withHandlers({
    //createNewLoi,
    handleCreateIloi,
    handleCheckBoxSelect,
    handleMoveSubILoi,
    handleListAction,
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchHeraldicSubmissions();
      this.props.fetchKingdoms();
    },
    componentDidUpdate(prevProps) {
      // TODO: do a deep comparison to know that available array has diff elements
      if (this.props.available.length != prevProps.available.length) {
        this.props.setlocalAvailableList(
          this.props.localAvailableList.concat(
            this.props.available.map(submission => ({
              ...submission,
              isChecked: false,
            })),
          ),
        );
      }
    },
  }),
)(NewILoI);
