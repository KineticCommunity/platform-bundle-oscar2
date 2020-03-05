import React, { Fragment } from 'react';
import { CoreForm } from '@kineticdata/react';
import { ErrorNotFound, ErrorUnauthorized, ErrorUnexpected } from 'common';
import { PageTitle } from '../shared/PageTitle';

import { I18n } from '@kineticdata/react';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('common/globals');

export const FramelessForm = ({
  form,
  submissionId,
  handleCreated,
  handleCompleted,
  handleLoaded,
  values,
  kappSlug,
  formSlug,
  mode,
}) => (
  <Fragment>
    <PageTitle parts={[form ? form.name : '']} />
    <div className="page-container page-container--color-bar">
      <div className="page-panel">
        {mode && mode === 'confirmation' ? (
          <div>
            <p>
              Thank you for submitting your request. You may close this tab or
              browser.
            </p>
          </div>
        ) : (
          <Fragment>
            <div className="page-title">
              <div className="page-title__wrapper">
                {form && (
                  <h1>
                    <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                      {form.name}
                    </I18n>
                  </h1>
                )}
              </div>
            </div>
            <div className="form-description">
              {form && (
                <p>
                  <I18n context={`kapps.${kappSlug}.forms.${form.slug}`}>
                    {form.description}
                  </I18n>
                </p>
              )}
            </div>
            <div className="embedded-core-form--wrapper">
              {submissionId ? (
                <I18n submissionId={submissionId}>
                  <CoreForm
                    submission={submissionId}
                    globals={globals}
                    loaded={handleLoaded}
                    completed={handleCompleted}
                  />
                </I18n>
              ) : (
                <I18n context={`kapps.${kappSlug}.forms.${formSlug}`}>
                  <CoreForm
                    kapp={kappSlug}
                    form={formSlug}
                    globals={globals}
                    loaded={handleLoaded}
                    created={handleCreated}
                    completed={handleCompleted}
                    values={values}
                    notFoundComponent={ErrorNotFound}
                    unauthorizedComponent={ErrorUnauthorized}
                    unexpectedErrorComponent={ErrorUnexpected}
                  />
                </I18n>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  </Fragment>
);
