import pluginInfo from '../plugin-manifest.json';
import { updatePresetColors } from '../lib/preset-colors';
import { isFieldInPluginSettings } from '../lib/settings';

export const handleFormFieldListenersAdd = (
  { contentType, name, properties, form },
  { getPluginSettings, setPluginSettings },
  client,
) => {
  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || '{}');

  if (contentType?.nonCtdSchema && contentType?.id === pluginInfo.id && name) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type === 'content_type') {
      return {
        onChange: () => {
          form.setFieldValue(`config[${index}].fields`, []);
        },
      };
    }
  }

  if (
    contentType?.nonCtdSchema ||
    !isFieldInPluginSettings(name, contentType, properties, parsedSettings)
  )
    return;

  return {
    onBlur: ({ value, fieldApi }) => {
      if (!fieldApi.state.meta.isValid) return;
      updatePresetColors(
        value,
        name,
        contentType?.name,
        getPluginSettings,
        setPluginSettings,
        client,
      );
    },
  };
};
