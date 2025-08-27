const regexp = '(#([0-9a-fA-F]{2}){2,4}$)|(^$)';

const deepAssignKeyValue = (key, value, options) =>
  key
    .split(/[[.\]]/)
    .filter((kp) => !!kp)
    .reduce((nestedOptions, keyPart, index, keysArray) => {
      if (!nestedOptions[keyPart]) {
        const isArray =
          index < keysArray.length - 1 && /^\d+$/.test(keysArray[index + 1]);

        if (!isArray) {
          nestedOptions[keyPart] = {};
        } else {
          nestedOptions[keyPart] = [];
        }
      }
      if (index >= keysArray.length - 1) {
        if (value === undefined) delete nestedOptions[keyPart];
        else nestedOptions[keyPart] = value;
      }
      return nestedOptions[keyPart];
    }, options);

export const getUpdateData = (values, contentTypesAcc, isDelete = false) => {
  return (values.config || []).map(({ content_type, fields }) => {
    const ctd = contentTypesAcc[content_type];
    const ctdClone = JSON.parse(JSON.stringify(ctd));

    (fields || []).forEach((field) => {
      const paths = field.split('.');
      const finalPath = `schemaDefinition.allOf[1].properties.${paths.join('.items.properties.')}.pattern`;
      deepAssignKeyValue(finalPath, isDelete ? undefined : regexp, ctdClone);
    });

    return { ctd, ctdClone };
  });
};
