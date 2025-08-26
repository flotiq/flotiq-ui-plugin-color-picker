import pluginInfo from '../../plugin-manifest.json';

export const getValidFields = (contentTypes) => {
  const fields = {};
  const fieldKeys = {};

  contentTypes
    ?.filter(({ internal }) => !internal)
    .map(({ name, label }) => ({ value: name, label }));

  (contentTypes || []).forEach(({ name, metaDefinition }) => {
    fields[name] = [];
    fieldKeys[name] = [];

    Object.entries(metaDefinition?.propertiesConfig || {}).forEach(
      ([key, value]) => {
        const inputType = value?.inputType;
        const fieldConfig = value;

        if (inputType === 'text') {
          fields[name].push({ value: key, label: fieldConfig.label });
          fieldKeys[name].push(key);
        }
      },
    );
  });

  return { fields, fieldKeys };
};

export const validFieldsCacheKey = `${pluginInfo.id}-form-valid-fields`;
