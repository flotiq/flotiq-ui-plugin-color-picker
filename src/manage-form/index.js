import pluginInfo from '../plugin-manifest.json';

import {
  addObjectToCache,
  getCachedElement,
  removeRoot,
} from '../plugin-helpers';
import { getValidFields, validFieldsCacheKey } from './lib/valid-fields';
import { getValidator } from './lib/validator';
import { getSchema } from './lib/schema';
import { getSubmitHandler } from './lib/submit';

export const handleManageForm = (data, client, toast) => {
  const { contentTypes, modalInstance } = data;

  const formSchemaCacheKey = `${pluginInfo.id}-form-schema`;
  let formSchema = getCachedElement(formSchemaCacheKey);

  if (!formSchema) {
    const validFields = getValidFields(contentTypes);
    addObjectToCache(validFieldsCacheKey, validFields);

    const ctds = contentTypes
      ?.filter(({ internal }) => !internal)
      .map(({ name, label }) => ({ value: name, label }));

    const onSubmit = getSubmitHandler(data, client, toast);

    formSchema = {
      options: {
        disabledBuildInValidation: true,
        onValidate: getValidator(validFields.fieldKeys),
        onSubmit,
      },
      schema: getSchema(ctds),
    };
  }

  modalInstance.promise.then(() => removeRoot(formSchemaCacheKey));

  return formSchema;
};
