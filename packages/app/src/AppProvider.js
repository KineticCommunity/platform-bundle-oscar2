import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import {
  CommonProvider,
  ErrorNotFound,
  ErrorUnexpected,
  Loading,
  ModalFormContainer,
  ToastsContainer,
} from 'common';
import { I18n } from '@kineticdata/react';

import { Home } from './components/Home';
import { Form } from './components/Form';
import { Profile } from './components/Profile';
import { EditProfile } from './components/EditProfile';
import { TeamsNavigation } from './components/Teams';
import { About } from './components/About';
import { Alerts } from './components/alerts/Alerts';
import { Alert } from './components/alerts/Alert';

const AppComponent = props => {
  if (props.errors.size > 0) {
    return <ErrorUnexpected />;
  } else if (props.loading) {
    return <Loading text="App is loading ..." />;
  } else {
    return props.render({
      main: (
        <I18n>
          <main className={`package-layout package-layout--app`}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/kapps/:kappSlug" component={Home} />
              <Route
                exact
                path="/kapps/:kappSlug/forms/:formSlug"
                component={Form}
              />
              <Route
                exact
                path="/kapps/:kappSlug/forms/:formSlug/submissions/:id"
                component={Form}
              />
              <Route exact path="/profile/edit" component={EditProfile} />
              <Route exact path="/profile/:username?" component={Profile} />
              <Route path="/teams" component={TeamsNavigation} />
              <Route exact path="/about" component={About} />
              <Route exact path="/alerts/:id" component={Alert} />
              <Route exact path="/alerts" component={Alerts} />
              <Route component={ErrorNotFound} />
            </Switch>
          </main>
        </I18n>
      ),
    });
  }
};

const mapStateToProps = (state, props) => ({
  loading: state.app.loading,
  errors: state.app.errors,
  kapp: state.app.kapp,
  pathname: state.router.location.pathname,
});

export const App = connect(mapStateToProps)(AppComponent);

export class AppProvider extends Component {
  render() {
    return (
      <CommonProvider>
        <ToastsContainer duration={5000} />
        <ModalFormContainer />
        <App
          render={this.props.render}
          path={`${this.props.appState.location}/*`}
        />
      </CommonProvider>
    );
  }

  // Used for matching pathname to display this App
  // Not used if package is set as Bundle Package of a Kapp
  static location = '/';
}
