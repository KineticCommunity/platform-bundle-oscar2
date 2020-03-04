import React from 'react';
//import { getFormType, getStatusClass } from '../../../../services/src/utils';
import { getStatusClass } from '../../utils';

export const LetterType = props => (
  <span className={`status ${getStatusClass(props.submission)}`}>
    {props.submission.form.name}
  </span>
);
