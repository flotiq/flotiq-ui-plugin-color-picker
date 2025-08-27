import pluginInfo from '../../plugin-manifest.json';

export const validInputTypes = ['text', 'simpleList'];

const findValidFields = (
  properties,
  fields,
  fieldKeys,
  parentKey = '',
  parentLabel = '',
) => {
  Object.entries(properties || {}).forEach(([key, value]) => {
    const inputType = value?.inputType;
    const fieldConfig = value;
    const fieldKey = parentKey ? `${parentKey}.${key}` : key;
    const fieldLabel = parentLabel
      ? `${parentLabel} > ${fieldConfig.label || fieldKey}`
      : fieldConfig.label;

    if (inputType === 'object') {
      findValidFields(
        fieldConfig.items.propertiesConfig,
        fields,
        fieldKeys,
        fieldKey,
        fieldLabel,
      );
    }
    if (validInputTypes.includes(inputType)) {
      fields.push({ value: fieldKey, label: fieldLabel });
      fieldKeys.push(fieldKey);
    }
  });
};

export const getValidFields = (contentTypes) => {
  const fields = {};
  const fieldKeys = {};

  contentTypes
    ?.filter(({ internal }) => !internal)
    .map(({ name, label }) => ({ value: name, label }));

  (contentTypes || []).forEach(({ name, metaDefinition }) => {
    fields[name] = [];
    fieldKeys[name] = [];

    findValidFields(
      metaDefinition?.propertiesConfig,
      fields[name],
      fieldKeys[name],
    );
  });

  return { fields, fieldKeys };
};

export const validFieldsCacheKey = `${pluginInfo.id}-form-valid-fields`;
