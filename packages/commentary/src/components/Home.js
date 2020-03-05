import React, { Fragment } from 'react';
import { I18n } from '@kineticdata/react';
import { compose, lifecycle } from 'recompose';
import { connect } from '../redux/store';
import { actions } from '../redux/modules/commentaryApp';
import { actions as SubmissionActions } from '../redux/modules/submissions';
import { PageTitle } from './shared/PageTitle';
import { Link } from 'react-router-dom';
import { LetterCard } from './shared/LetterCard';
import { getSubmissionPath } from '../utils';

export const HomeComponent = ({
  kapp,
  profile,
  news,
  canEdit,
  lois,
  currentState,
}) => (
  <Fragment>
    <PageTitle parts={[]} />
    <div className="page-container container">
      <h1>
        <I18n>{kapp.name}</I18n>
      </h1>
      <section className="mt-4">
        <h2 className="section__title">
          <span>
            <I18n>Welcome</I18n>{' '}
            <strong>{profile.displayName || profile.username}</strong>{' '}
          </span>
        </h2>
      </section>
      <div className="row">
        <div className="col-8">
          <section className="row">
            <div className="col-8">
              <h2>
                <I18n>Current News</I18n>
              </h2>
            </div>
            <div className="col-1" />
            <div className="col-3">
              {canEdit && (
                <Link
                  to="/settings/datastore/news/new"
                  className="btn btn-secondary"
                >
                  Create New News Item
                </Link>
              )}
            </div>
          </section>
          <table className="news-table">
            <thead>
              <tr>
                <th width="25%">Summary</th>
                <th width="55%">Details</th>
                <th width="15%">Audience</th>
                {canEdit && <th width="10%">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {news.map(article => (
                <tr key={article.id}>
                  <td>{article.values['Summary']}</td>
                  <td>{article.values['Text']}</td>
                  <td>
                    {article.values['Audience'] === 'All'
                      ? 'All'
                      : article.values['Kingdoms'].join(', ')}
                  </td>
                  {canEdit && (
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link
                          className="btn btn-primary"
                          to={`/settings/datastore/news/${article.id}`}
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
        </div>
        <div className="col-4">
          {lois.length > 0 ? (
            lois
              .map((submission, index) => ({
                submission,
                index,
                key: submission.id,
                path: '/kapps/commentary/loi/' + submission.id,
                deleteCallback: '',
              }))
              .map(props => <LetterCard {...props} />)
          ) : (
            <div className="card card--empty-state">
              <h1>There are no open LoI.</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  </Fragment>
);

export const mapStateToProps = (state, props) => {
  return {
    kapp: state.app.kapp,
    profile: state.app.profile,
    news: state.commentaryApp.news,
    canEdit: state.app.profile.spaceAdmin ? true : false,
    lois: state.submissions.loi,
    currentState: state,
  };
};

export const mapDispatchToProps = {
  fetchNews: actions.fetchNews,
  fetchLois: SubmissionActions.fetchLoiSubmissions,
};

export const Home = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  lifecycle({
    componentDidMount() {
      this.props.fetchNews();
      this.props.fetchLois();
    },
  }),
)(HomeComponent);
