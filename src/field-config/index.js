import ReactDOM from 'react-dom/client';
import pluginInfo from '../plugin-manifest.json';
import ColorPicker from './ColorPicker/ColorPicker';
import { addElementToCache, getCachedElement } from '../lib/plugin-helpers';
import { validFieldsCacheKey } from '../manage-form/lib/valid-fields';
import i18n from '../i18n';
import { isFieldInPluginSettings } from '../lib/settings';

const updateApp = (root, data) => {
  root.render(<ColorPicker {...data} />);
};

const initApp = (div, data) => {
  const root = ReactDOM.createRoot(div);
  updateApp(root, data);
  return root;
};

let cachedRequest = null;

export const handleFieldConfig = (
  data,
  { getPluginSettings, setPluginSettings },
  client,
) => {
  if (!data) return;

  const { contentType, config, properties, name, formUniqueKey, form } = data;

  if (contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type === 'fields') {
      const { fields } = getCachedElement(validFieldsCacheKey);
      const ctd = form.getValue(`config[${index}].content_type`);
      config.options = fields?.[ctd] || [];
    }

    return;
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || '{}');

  if (!isFieldInPluginSettings(name, contentType, properties, parsedSettings))
    return;

  const key = `${contentType.name}-${formUniqueKey}-${name}`;
  let cachedApp = getCachedElement(key);

  const appData = {
    ...data,
    swatches: parsedSettings.color_palette?.[0]?.swatches,
    getPluginSettings,
    setPluginSettings,
    client,
  };

  if (!cachedApp) {
    const div = document.createElement('div');
    addElementToCache(
      div,
      initApp(div, appData),
      key,
      () => (cachedRequest = null),
    );

    if (!cachedRequest && !appData.swatches) {
      cachedRequest = client['_plugin_settings']
        .get(pluginInfo.id)
        .then(({ ok, body }) => {
          if (ok && body.settings) {
            setPluginSettings(body.settings);
          }
        });
    }
  } else {
    updateApp(cachedApp.root, appData);
  }

  config.additionalElements = [getCachedElement(key).element];
  config.additionalInputClasses = 'plugin-color-picker-input';
  config.placeholder = i18n.t('ChooseColor');
  config.autoComplete = 'off';
};
