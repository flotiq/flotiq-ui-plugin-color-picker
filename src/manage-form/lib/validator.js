import i18n from '../../i18n';

const addToErrors = (errors, index, field, error) => {
  if (!errors.config) errors.config = [];
  if (!errors.config[index]) errors.config[index] = {};
  errors.config[index][field] = error;
};

export const getValidator = (fieldKeys) => {
  const onValidate = (values) => {
    const errors = {};

    values.config?.forEach(({ content_type, fields }, index) => {
      if (!content_type) {
        addToErrors(errors, index, 'content_type', i18n.t('FieldRequired'));
      }

      if (!fields?.length) {
        addToErrors(errors, index, 'fields', i18n.t('FieldRequired'));
      } else if (
        (fields || []).filter(
          (field) => (fieldKeys[content_type] || []).indexOf(field) < 0,
        ).length > 0
      ) {
        addToErrors(errors, index, 'fields', i18n.t('WrongField'));
      }
    });

    return errors;
  };

  return onValidate;
};
