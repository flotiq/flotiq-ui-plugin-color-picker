import pluginManifest from '../plugin-manifest.json';

export const updatePresetColors = (
  newColor,
  name,
  contentTypeName,
  getPluginSettings,
  setPluginSettings,
  apiClient,
) => {
  const pluginSettings = getPluginSettings();

  const newSettings = JSON.parse(pluginSettings || '{}');

  if (!newSettings.presets) {
    newSettings.presets = [];
  }

  const fieldPresetIndex = newSettings.presets.findIndex(
    ({ content_type, field_name }) =>
      content_type === contentTypeName && field_name === name,
  );

  const newColorsPreset =
    newSettings.presets[fieldPresetIndex]?.colors_preset || [];

  if (newColorsPreset.includes(newColor)) {
    return newColorsPreset;
  }

  const isMax = newColorsPreset.length >= 16;
  if (isMax) {
    newColorsPreset.pop();
  }
  newColorsPreset.unshift(newColor);

  const newPreset = {
    field_name: name,
    content_type: contentTypeName,
    colors_preset: newColorsPreset,
  };

  if (fieldPresetIndex < 0) {
    newSettings.presets.push(newPreset);
  } else {
    newSettings.presets[fieldPresetIndex] = newPreset;
  }

  setPluginSettings(JSON.stringify(newSettings));

  apiClient['_plugin_settings'].patch(pluginManifest.id, {
    settings: JSON.stringify(newSettings),
  });

  return newColorsPreset;
};
