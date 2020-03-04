import React from 'react';
//import { getFormType, getStatusClass } from '../../../../services/src/utils';
import { getFormType, getStatusClass } from '../../utils';

export const RequestType = props => (
  <span className={`status ${getStatusClass(props.submission)}`}>
    {props.submission.values.ItemIs} {getFormType(props.submission)}
  </span>
);
