import { updatePresetColors } from '../lib/preset-colors';
import { isFieldInPluginSettings } from '../lib/settings';

export const handleFormFieldListenersAdd = (
  { contentType, name, properties },
  { getPluginSettings, setPluginSettings },
  client,
) => {
  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || '{}');

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
