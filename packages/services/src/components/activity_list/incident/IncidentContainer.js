import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { connect } from '../../../redux/store';
import { Incident } from './Incident';
import { actions } from '../../../redux/modules/activityList';

export const mapStateToProps = (state, props) => ({
  incident: state.activityList.data,
  error: state.activityList.error,
  loading: state.activityList.loading,
  listType: props.type,
  mode: props.mode,
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
  workLogs: state.activityList.workLogs,
});

export const mapDispatchToProps = {
  clearActivity: actions.clearActivity,
  fetchITSMRecord: actions.fetchITSMRecord,
  fetchITSMWorkLogs: actions.fetchITSMWorkLogs,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchITSMRecord({
        type: 'incident',
        id: this.props.id,
      });
      this.props.fetchITSMWorkLogs({
        type: 'incidentWorkLogs',
        id: this.props.id,
      });
    },
    componentWillUnmount() {
      this.props.clearActivity();
    },
  }),
);

export const IncidentContainer = enhance(Incident);
