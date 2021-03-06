import React, { Fragment } from 'react';
import { connect } from '../redux/store';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { Modal, ModalBody } from 'reactstrap';
import { Utils, openModalForm, StateListWrapper } from 'common';
import { PageTitle } from './shared/PageTitle';
import { Link } from '@reach/router';
import { actions } from '../redux/modules/appointments';
import { actions as walkInActions } from '../redux/modules/walkIns';
import {
  enableLocationServices,
  mapTechBarsForDistance,
  sortTechBarsByDistance,
} from '../redux/modules/techBarApp';
import {
  SESSION_ITEM_USER_LOCATION,
  SESSION_ITEM_CURRENT_TECH_BAR,
  DATE_FORMAT,
  TIME_FORMAT,
} from '../constants';
import moment from 'moment';
import { I18n, Moment } from '@kineticdata/react';

import heroImage from '../assets/images/tech-bar-hero.jpg';

export const HomeComponent = ({
  kapp,
  techBars,
  upcomingAppointments,
  error,
  modalOpen,
  setModalOpen,
  currentTechBar,
  selectCurrentTechBar,
  useLocationServices,
  userLocation,
  getUserLocation,
  openDropdown,
  toggleDropdown,
  hasTechBarDisplayRole,
  waitingUsers,
}) => {
  const selectedTechBar = currentTechBar || techBars.get(0);
  return (
    <Fragment>
      <PageTitle parts={[]} />
      <div className="page-container">
        <div className="page-panel">
          <div className="page-panel__header">
            <div
              className="hero--tech-bar"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="container">
                <div className="hero-welcome">
                  <div className="title">
                    <I18n>Welcome to</I18n>{' '}
                    <I18n>
                      {selectedTechBar
                        ? selectedTechBar.values['Name']
                        : kapp
                          ? kapp.name
                          : 'Tech Bar'}
                    </I18n>
                  </div>
                  <div className="subtitle">
                    {selectedTechBar ? (
                      <I18n>{selectedTechBar.values['Description']}</I18n>
                    ) : (
                      <I18n>
                        We deliver in-person service that gets people back on
                        track.
                      </I18n>
                    )}
                  </div>
                </div>
                <div className="hero-card">
                  <div className="card card--tech-bar-loc">
                    <div className="card-body">
                      <span className="icon fa fa-map-marker" />
                      <div className="content">
                        <span className="title">
                          <I18n>{selectedTechBar.values['Name']}</I18n>
                          {techBars.size > 1 && (
                            <button
                              className="btn btn-inverse btn-sm"
                              onClick={() => setModalOpen(true)}
                            >
                              <I18n>Change</I18n>
                            </button>
                          )}
                        </span>
                        {selectedTechBar.values['Location'] && (
                          <div className="subtitle">
                            <I18n>{selectedTechBar.values['Location']}</I18n>
                          </div>
                        )}
                        <div className="details">
                          {selectedTechBar.values['Details'] && (
                            <p>
                              <I18n>{selectedTechBar.values['Details']}</I18n>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`appointment/${selectedTechBar.values['Id']}`}
                      className="btn btn-primary card-button"
                    >
                      <I18n>Schedule Now</I18n> →
                    </Link>
                    <div
                      className={`waiting-users-message ${
                        waitingUsers === 0 ? '' : ''
                      }`}
                    >
                      <I18n>Currently awaiting assistance</I18n>: {waitingUsers}{' '}
                      <I18n
                        render={translate =>
                          waitingUsers === 1
                            ? translate('person')
                            : translate('people')
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-panel__body container">
            <section className="mt-4">
              <div className="info-tile__wrapper">
                <Link
                  to={`appointment/${selectedTechBar.values['Id']}`}
                  className="info-tile"
                >
                  <div className="icon">
                    <span className="fa fa-calendar-o fa-fw" />
                  </div>
                  <div className="title">
                    <span className="fa fa-calendar-o fa-fw" />
                    <I18n>Schedule</I18n>
                  </div>
                  <p className="description">
                    <I18n>Schedule an appointment.</I18n>
                  </p>
                </Link>
                <Link to="past" className="info-tile">
                  <div className="icon">
                    <span className="fa fa-clock-o fa-fw" />
                  </div>
                  <div className="title">
                    <span className="fa fa-clock-o fa-fw" />
                    <I18n>History</I18n>
                  </div>
                  <p className="description">
                    <I18n>View all of your past appointments.</I18n>
                  </p>
                </Link>
                <I18n
                  render={translate => (
                    <div
                      className="info-tile actionable"
                      onClick={() =>
                        openModalForm({
                          formSlug: 'general-feedback',
                          kappSlug: kapp.slug,
                          values: {
                            'Scheduler Id': selectedTechBar.values['Id'],
                          },
                          title: `${translate(
                            selectedTechBar.values['Name'],
                          )} ${translate('Feedback')}`,
                          confirmationMessage: translate(
                            'Thank you for your feedback.',
                          ),
                        })
                      }
                    >
                      <div className="icon">
                        <span className="fa fa-comment-o fa-fw" />
                      </div>
                      <div className="title">
                        <span className="fa fa-comment-o fa-fw" />
                        <I18n>Feedback</I18n>
                      </div>
                      <p className="description">
                        <I18n>Questions, comments, or concerns.</I18n>
                      </p>
                    </div>
                  )}
                />
              </div>
            </section>
            <section className="mt-4">
              <h2 className="section__title">
                <I18n>Upcoming Appointments</I18n>
              </h2>
              <StateListWrapper
                data={upcomingAppointments}
                error={error}
                emptyTitle="You have no upcoming appointments."
                emptyMessage="As you schedule appointments, they'll appear here."
              >
                {data => (
                  <div className="cards__wrapper mb-3">
                    {data.map(appt => {
                      const techBar = techBars.find(
                        t => t.values['Id'] === appt.values['Scheduler Id'],
                      );
                      const date = moment.utc(
                        appt.values['Event Date'],
                        DATE_FORMAT,
                      );
                      const start = moment.utc(
                        appt.values['Event Time'],
                        TIME_FORMAT,
                      );
                      const end = start
                        .clone()
                        .add(appt.values['Event Duration'], 'minute');
                      return (
                        <Link
                          to={`appointment/${appt.values['Scheduler Id']}/${
                            appt.id
                          }`}
                          className="card card--appt"
                          key={appt.id}
                        >
                          <i
                            className="fa fa-calendar fa-fw card-icon"
                            style={{ background: 'rgb(255, 74, 94)' }}
                          />
                          <div className="card-body">
                            <span className="card-title">
                              <Moment
                                timestamp={date}
                                format={Moment.formats.dateWithDay}
                              />
                            </span>
                            <p className="card-subtitle">
                              <Moment
                                timestamp={start}
                                format={Moment.formats.time}
                              />
                              {` - `}
                              <Moment
                                timestamp={end}
                                format={Moment.formats.time}
                              />
                            </p>
                            {techBar && (
                              <p className="card-meta">
                                <strong>
                                  <I18n>{techBar.values['Name']}</I18n>
                                </strong>
                              </p>
                            )}
                            <span
                              className={`badge ${
                                appt.coreState === 'Closed'
                                  ? 'badge-dark'
                                  : 'badge-success'
                              }`}
                            >
                              <I18n>{appt.values['Status']}</I18n>
                            </span>
                            <p className="card-text">
                              {appt.values['Summary']}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </StateListWrapper>
            </section>
          </div>
        </div>
      </div>
      {modalOpen && (
        <Modal
          isOpen={!!modalOpen}
          toggle={() => setModalOpen(false)}
          size="sm"
          className="tech-bar-modal"
        >
          <div className="modal-header">
            <h4 className="modal-title">
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setModalOpen(false)}
              >
                <I18n>Cancel</I18n>
              </button>
              <span>
                <I18n>Location</I18n>
              </span>
              <Link to="tech-bars" className="btn btn-sm btn-link">
                <I18n>View All</I18n>
              </Link>
            </h4>
          </div>
          {useLocationServices &&
            !userLocation && (
              <div className="modal-header">
                <div className="px-3 py-1 text-center">
                  <button className="btn btn-link" onClick={getUserLocation}>
                    <span className="fa fa-fw fa-map-marker" />{' '}
                    <I18n>use my current location</I18n>
                  </button>
                </div>
              </div>
            )}
          <ModalBody>
            <ul>
              {techBars.map(techBar => (
                <li
                  key={techBar.id}
                  onClick={() => selectCurrentTechBar(techBar.id)}
                >
                  <span className="title">
                    <I18n>{techBar.values['Name']}</I18n>
                  </span>
                  {techBar.values['Location'] && (
                    <div className="subtitle">
                      <I18n>{techBar.values['Location']}</I18n>
                    </div>
                  )}
                  {userLocation && (
                    <div className="subtitle">
                      <I18n
                        render={translate =>
                          techBar.distance
                            ? `(${techBar.distance.toFixed(1)} ${translate(
                                'miles',
                              )})`
                            : `(${translate('Distance Unknown')})`
                        }
                      />
                    </div>
                  )}
                  <div className="details">
                    {techBar.values['Description'] && (
                      <p>
                        <I18n>{techBar.values['Description']}</I18n>
                      </p>
                    )}
                    {techBar.values['Details'] && (
                      <p>
                        <I18n>{techBar.values['Details']}</I18n>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </ModalBody>
        </Modal>
      )}
    </Fragment>
  );
};

export const mapStateToProps = (state, props) => {
  const techBars = state.techBarApp.schedulers.filter(
    s => s.values['Status'] === 'Active',
  );
  const useLocationServices = enableLocationServices(techBars);
  return {
    kappSlug: state.app.kappSlug,
    kapp: state.app.kapp,
    profile: state.app.profile,
    techBars:
      useLocationServices && props.userLocation
        ? techBars
            .map(mapTechBarsForDistance(props.userLocation))
            .sort(sortTechBarsByDistance)
        : techBars,
    error: state.appointments.error,
    upcomingAppointments: state.appointments.upcoming,
    waitingUsers:
      (state.appointments.overview ? state.appointments.overview.size : 0) +
      (state.walkIns.overview ? state.walkIns.overview.size : 0),
    useLocationServices,
  };
};

export const mapDispatchToProps = {
  fetchUpcomingAppointmentsRequest: actions.fetchUpcomingAppointmentsRequest,
  fetchAppointmentsOverviewRequest: actions.fetchAppointmentsOverviewRequest,
  fetchWalkInsOverviewRequest: walkInActions.fetchWalkInsOverviewRequest,
};

const selectCurrentTechBar = ({
  techBars,
  setCurrentTechBar,
  setModalOpen,
}) => id => {
  setModalOpen(false);
  sessionStorage.setItem(SESSION_ITEM_CURRENT_TECH_BAR, id);
  setCurrentTechBar(techBars.find(t => t.id === id));
};

const getUserLocation = ({ setUserLocation }) => () => {
  navigator.geolocation.getCurrentPosition(position => {
    if (position && position.coords) {
      const userLocObj = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setUserLocation(userLocObj);
      sessionStorage.setItem(
        SESSION_ITEM_USER_LOCATION,
        JSON.stringify(userLocObj),
      );
    }
  });
};

const toggleDropdown = ({
  setOpenDropdown,
  openDropdown,
}) => dropdownSlug => () =>
  setOpenDropdown(dropdownSlug === openDropdown ? false : dropdownSlug);

const hasTechBarDisplayRole = ({ profile }) => techBarName =>
  Utils.isMemberOf(profile, `Role::Tech Bar Display::${techBarName}`);

export const Home = compose(
  withState('userLocation', 'setUserLocation', () => {
    try {
      const locObj = JSON.parse(
        sessionStorage.getItem(SESSION_ITEM_USER_LOCATION),
      );
      if (locObj && locObj.latitude != null && locObj.longitude != null) {
        return locObj;
      }
    } catch (e) {}
    return null;
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('currentTechBar', 'setCurrentTechBar', ({ techBars }) => {
    const techBarId = sessionStorage.getItem(SESSION_ITEM_CURRENT_TECH_BAR);
    return techBarId ? techBars.find(t => t.id === techBarId) : null;
  }),
  withState('modalOpen', 'setModalOpen', false),
  withState('openDropdown', 'setOpenDropdown', false),
  withHandlers({
    selectCurrentTechBar,
    getUserLocation,
    toggleDropdown,
    hasTechBarDisplayRole,
  }),
  lifecycle({
    componentDidMount() {
      // If not loading, fetch upcoming appointments
      this.props.fetchUpcomingAppointmentsRequest();
      // Ask for user location if enabled and not already saved
      if (this.props.useLocationServices && this.props.userLocation === null) {
        this.props.getUserLocation();
      }
      // Fetch count of checked in customers at the current techbar
      if (this.props.techBars.size > 0) {
        const selectedTechBar =
          this.props.currentTechBar || this.props.techBars.get(0);
        this.props.fetchAppointmentsOverviewRequest({
          id: selectedTechBar.values['Id'],
        });
        this.props.fetchWalkInsOverviewRequest({
          id: selectedTechBar.values['Id'],
        });
      }
    },
    componentDidUpdate(prevProps) {
      if (
        this.props.techBars.size > 0 &&
        this.props.currentTechBar !== prevProps.currentTechBar
      ) {
        const selectedTechBar =
          this.props.currentTechBar || this.props.techBars.get(0);
        this.props.fetchAppointmentsOverviewRequest({
          id: selectedTechBar.values['Id'],
        });
        this.props.fetchWalkInsOverviewRequest({
          id: selectedTechBar.values['Id'],
        });
      }
    },
  }),
)(HomeComponent);
