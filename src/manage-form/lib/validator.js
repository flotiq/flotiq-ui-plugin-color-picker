import i18n from '../../i18n';

export const getValidator = (fieldKeys) => {
  const onValidate = (values) => {
    const errors = {};

    values.config?.forEach(({ content_type, fields }, index) => {
      if (!content_type) {
        errors[`config[${index}].content_type`] = i18n.t('FieldRequired');
      }

      if (!fields?.length) {
        errors[`config[${index}].fields`] = i18n.t('FieldRequired');
      } else if (
        (fields || []).filter(
          (field) => (fieldKeys[content_type] || []).indexOf(field) < 0,
        ).length > 0
      ) {
        errors[`config[${index}].fields`] = i18n.t('WrongField');
      }
    });

    return errors;
  };

  return onValidate;
};
