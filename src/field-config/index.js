import ReactDOM from 'react-dom/client';
import pluginInfo from '../plugin-manifest.json';
import ColorPicker from './ColorPicker/ColorPicker';
import { addElementToCache, getCachedElement } from '../plugin-helpers';
import { validFieldsCacheKey } from '../manage-form/lib/valid-fields';
import i18n from '../i18n';

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

  if (contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
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

  if (!contentType || properties?.inputType !== 'text') return;

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || '{}');

  const contentTypeSettings = parsedSettings?.config?.filter(
    ({ content_type }) => content_type === contentType.name,
  );

  if (
    !contentTypeSettings?.length ||
    !contentTypeSettings.filter(({ fields }) =>
      fields.includes(name.replace(/\[\d+\]/g, '')),
    ).length
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
  config.placeholder = i18n.t('ChooseColor');
  config.autoComplete = 'off';
};
