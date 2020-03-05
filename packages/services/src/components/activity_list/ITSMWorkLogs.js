import React, { Fragment } from 'react';
import { CoreForm } from '@kineticdata/react';
import { I18n } from '@kineticdata/react';
import { TimeAgo } from 'common';
import moment from '../../../../../node_modules/moment/moment';

export const ITSMWorkLogs = props => {
  return props.workLogs && props.workLogs.length > 0 ? (
    props.workLogs.map((record, idx) => (
      <div key={`${moment().valueOf()}${idx}`} className="itsm-work-log">
        <h6>{record.Summary}</h6>
        <div className="data-list-row">
          <dl>
            <dt>Type:</dt>
            <dd>{record.Type}</dd>
          </dl>
          <dl>
            <dt>Created:</dt>
            <dd>
              <TimeAgo timestamp={record['Created At']} />
            </dd>
          </dl>
        </div>
        <div className="data-list-row">
          <dl>
            <dt>Notes:</dt>
            <dd>
              {record.Notes.split('\n').map((item, i) => (
                <div key={i}>{item}</div>
              ))}
            </dd>
          </dl>
        </div>
      </div>
    ))
  ) : (
    <div className="itsm-work-log">
      <I18n>No Work Logs Found</I18n>
    </div>
  );
};

export const AddITSMWorkLog = props => (
  <CoreForm kapp={props.kappSlug} values={props.values} form={props.formSlug} />
);
