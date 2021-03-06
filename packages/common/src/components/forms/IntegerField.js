import React from 'react';
import { I18n } from '@kineticdata/react';
import { hasErrors } from './utils';
import { FieldWrapper } from './FieldWrapper';

export const IntegerField = props => (
  <FieldWrapper {...props}>
    <I18n
      render={translate => (
        <input
          className={`form-control${hasErrors(props) ? ' is-invalid' : ''}`}
          type="number"
          step="1"
          id={props.id}
          name={props.name}
          value={props.value}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          placeholder={translate(props.placeholder)}
          disabled={!props.enabled}
        />
      )}
    />
  </FieldWrapper>
);
