import { useCallback, useEffect, useState } from 'react';
import pluginInfo from '../../plugin-manifest.json';
import { updatePresetColors } from '../../lib/preset-colors';
import { SketchPicker } from 'react-color';

/**
 * Converts alpha (0-1) to 2-digit hex
 * Due to https://github.com/casesandberg/react-color/issues/416,
 * we need to manually convert aplha to hex
 */
const alphaToHex = (alpha) => {
  const hex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return hex;
};

const getFieldColorsPreset = (pluginSettings, fieldName, contentTypeName) => {
  const name = fieldName.replace(/\[\d+\]/g, '');
  const allPresets = JSON.parse(pluginSettings || '{}')?.presets || [];
  const fieldPreset = allPresets.find(
    ({ content_type, field_name }) =>
      content_type === contentTypeName && field_name === name,
  );
  return fieldPreset?.colors_preset || [];
};

const Sketch = ({
  name,
  value,
  contentType,
  formik,
  client,
  getPluginSettings,
  setPluginSettings,
}) => {
  const [presetColors, setPresetColors] = useState(() =>
    getFieldColorsPreset(getPluginSettings(), name, contentType?.name),
  );

  useEffect(() => {
    client['_plugin_settings'].get(pluginInfo.id).then(({ ok, body }) => {
      if (ok && body.settings) {
        setPluginSettings(body.settings);
        setPresetColors(
          getFieldColorsPreset(body.settings, name, contentType?.name),
        );
      }
    });
  }, [client, contentType?.name, name, setPluginSettings]);

  const onChange = useCallback(
    (color) => {
      let hexColor = color.hex;
      if (typeof color.rgb?.a === 'number' && color.rgb.a < 1) {
        hexColor += alphaToHex(color.rgb.a);
      }
      formik.setFieldValue(name, hexColor);
    },
    [formik, name],
  );

  const onChangeComplete = useCallback(
    (color) => {
      let hexColor = color.hex;
      if (typeof color.rgb?.a === 'number' && color.rgb.a < 1) {
        hexColor += alphaToHex(color.rgb.a);
      }
      const newColorsPreset = updatePresetColors(
        hexColor,
        name,
        contentType?.name,
        getPluginSettings,
        setPluginSettings,
        client,
      );

      setPresetColors(newColorsPreset);
    },
    [name, contentType?.name, getPluginSettings, setPluginSettings, client],
  );

  return (
    <SketchPicker
      color={value}
      onChange={onChange}
      presetColors={presetColors}
      onChangeComplete={onChangeComplete}
    />
  );
};

export default Sketch;
