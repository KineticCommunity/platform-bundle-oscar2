import { push } from 'connected-react-router';
import { compose, withHandlers, withState } from 'recompose';
import { parse } from 'query-string';
import { FramelessForm } from './FramelessForm';
import { connect } from '../../redux/store';

const valuesFromQueryParams = queryParams => {
  const params = parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

export const handleCompleted = props => response => {
  if (!response.submission.currentPage) {
    props.push(
      `/kapps/${props.kappSlug}/frameless/${props.formSlug}/${
        response.submission.id
      }/confirmation`,
    );
  }
};

export const handleCreated = props => response => {
  if (
    response.submission.coreState !== 'Submitted' ||
    response.submission.currentPage
  ) {
    props.push(`${props.location.pathname}/${response.submission.id}`);
  }
};

export const handleLoaded = props => form => {
  props.setForm({
    slug: form.slug(),
    name: form.name(),
    description: form.description(),
  });
};

export const mapStateToProps = state => ({
  values: valuesFromQueryParams(state.router.location.search),
  kappSlug: state.app.kappSlug,
  appLocation: state.app.location,
});

export const mapDispatchToProps = {
  push,
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withState('form', 'setForm', props => props.form),
  withHandlers({ handleCompleted, handleCreated, handleLoaded }),
);

export const FramelessFormContainer = enhance(FramelessForm);
