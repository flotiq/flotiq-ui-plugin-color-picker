import ReactDOM from 'react-dom/client';
import ColorPicker from './ColorPicker/ColorPicker';
import { addElementToCache, getCachedElement } from '../plugin-helpers';
import { validFieldsCacheKey } from '../manage-form/lib/valid-fields';

const updateApp = (root, data) => {
  root.render(<ColorPicker {...data} />);
};

const initApp = (div, data) => {
  const root = ReactDOM.createRoot(div);
  updateApp(root, data);
  return root;
};

export const handleFieldConfig = (data, getPluginSettings) => {
  if (!data) return;

  const { contentType, config, properties, name, formUniqueKey, formik } = data;

  if (
    !contentType ||
    contentType.nonCtdSchema ||
    properties?.inputType !== 'text'
  ) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type === 'fields') {
      const { fields } = getCachedElement(validFieldsCacheKey);
      const ctd = formik.values.config[index].content_type;
      config.options = fields?.[ctd] || [];
    }

    return;
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || '{}');

  const contentTypeSettings = parsedSettings?.config?.filter(
    ({ content_type }) => content_type === contentType.name,
  );

  if (
    !contentTypeSettings?.length ||
    !contentTypeSettings.filter(({ fields }) => fields.includes(name)).length
  )
    return;

  const key = `${contentType.name}-${formUniqueKey}-${name}`;
  let cachedApp = getCachedElement(key);

  if (!cachedApp) {
    const div = document.createElement('div');
    addElementToCache(div, initApp(div, data), key);
  } else {
    updateApp(cachedApp.root, data);
  }

  config.additionalElements = [getCachedElement(key).element];
  config.additionalInputClasses = 'plugin-color-picker-input';
};
