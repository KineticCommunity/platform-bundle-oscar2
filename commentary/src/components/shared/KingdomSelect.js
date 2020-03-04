import React from 'react';
import {
  Menu,
  Token,
  Typeahead,
  Highlighter,
  MenuItem,
} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import memoize from 'memoize-one';
import { actions } from '../../redux/modules/commentaryApp';
import { fetchTeams } from '@kineticdata/react';
import { Cache } from '../../cache';
import { I18n } from '@kineticdata/react';

export const KingdomMenuItem = props => {
  const disabledReason = props.disabledFn && props.disabledFn(props.option);
  return (
    <MenuItem
      option={props.option}
      position={props.position}
      disabled={!!disabledReason}
    >
      <div className="kingdom-menu-item">
        <div>
          <Highlighter search={props.text}>{props.option.label}</Highlighter>
          <div>
            <small>Kingdom</small>
          </div>
        </div>
        {disabledReason && <small>{disabledReason}</small>}
      </div>
    </MenuItem>
  );
};

const renderMenu = memoize(disabledFn => (results, props) => (
  <Menu {...props}>
    {results.map((option, i) => {
      return (
        <KingdomMenuItem
          key={i}
          option={option}
          position={i}
          text={props.text}
          disabledFn={disabledFn}
        />
      );
    })}
  </Menu>
));

const renderToken = (option, props, index) => (
  <Token key={index} onRemove={props.onRemove} className="kingdom">
    {option.label}
  </Token>
);

const kingdomCache = new Cache(() =>
  fetchTeams({
    include: 'details',
    q: 'attributes[Group Type] = "Kingdom"',
  }).then(response =>
    response.teams.map(kingdom => ({
      label: kingdom.name,
      kingdom,
    })),
  ),
);

const anyMatch = (array, source) => {
  if (typeof array === 'undefined') {
    return false;
  } else {
    return !!array.find(entry => entry === source);
  }
};

const getSelected = (value, valueMapper, options) =>
  options.filter(option =>
    anyMatch(value, valueMapper ? valueMapper(option) : option),
  );

export class KingdomSelect extends React.Component {
  state = { options: null };

  static getDerivedStateFromProps(props) {
    return { renderMenu: renderMenu(props.disabledFn) };
  }

  componentDidMount() {
    kingdomCache.get().then(kingdoms => {
      const options = [...kingdoms].sort((a, b) =>
        a.label.localeCompare(b.label),
      );
      this.setState({ options });
    });
  }

  handleChange = value => {
    this.props.onChange({
      target: {
        id: this.props.id,
        value: this.props.valueMapper
          ? value.map(this.props.valueMapper)
          : value,
      },
    });
  };

  render() {
    console.log('props for kingdomSelect', this.props, this.state);
    return (
      this.state.options && (
        <div className="form-group">
          <label>
            <I18n>{this.props.label}</I18n>
          </label>

          <I18n
            render={translate => (
              <Typeahead
                id={`${this.props.id}-team-typeahead`}
                className={this.props.className}
                multiple={this.props.multiple}
                options={this.state.options}
                renderMenu={this.state.renderMenu}
                renderToken={renderToken}
                selected={getSelected(
                  this.props.value,
                  this.props.valueMapper,
                  this.state.options,
                )}
                onChange={this.handleChange}
                placeholder={translate(
                  this.props.placeholder || 'Select a Kingdom',
                )}
              />
            )}
          />
          <small className="form-text text-muted">
            <I18n>{this.props.description}</I18n>
          </small>
        </div>
      )
    );
  }
}
