import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import pluginInfo from '../../plugin-manifest.json';
import { SketchPicker, SwatchesPicker } from 'react-color';
import { updatePresetColors } from '../../lib/preset-colors';

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

const ColorPicker = ({
  name,
  value,
  contentType,
  formik,
  uploaded_palette,
  client,
  getPluginSettings,
  setPluginSettings,
}) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);
  const [presetColors, setPresetColors] = useState(() =>
    getFieldColorsPreset(getPluginSettings(), name, contentType?.name),
  );

  useEffect(() => {
    if (uploaded_palette) return;
    client['_plugin_settings'].get(pluginInfo.id).then(({ ok, body }) => {
      if (ok && body.settings) {
        setPluginSettings(body.settings);
        setPresetColors(
          getFieldColorsPreset(body.settings, name, contentType?.name),
        );
      }
    });
  }, [client, contentType?.name, name, setPluginSettings, uploaded_palette]);

  const swatchesByColor = useMemo(() => {
    if (!uploaded_palette) return {};
    const swatches = {};
    uploaded_palette.palette.forEach((group) => {
      group.forEach((color) => {
        const data =
          typeof color === 'string' ? { value: color, name: color } : color;
        swatches[data.color] = data.name;
      });
    });
    return swatches;
  }, [uploaded_palette]);

  const swatches = useMemo(() => {
    if (!uploaded_palette) return [];
    return uploaded_palette.palette.map((group) =>
      group.map((color) => {
        return typeof color === 'string' ? color : color.value;
      }),
    );
  }, [uploaded_palette]);

  const onChange = useCallback(
    (color) => {
      if (uploaded_palette) {
        const colorName = swatchesByColor[color.hex] || color.hex;
        formik.setFieldValue(name, colorName);
        return;
      }

      let hexColor = color.hex;
      if (typeof color.rgb?.a === 'number' && color.rgb.a < 1) {
        hexColor += alphaToHex(color.rgb.a);
      }
      formik.setFieldValue(name, hexColor);
    },
    [formik, name, swatchesByColor, uploaded_palette],
  );

  const toggleOpen = useCallback(() => {
    setOpen((open) => !open);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target?.className?.includes?.('plugin-color-picker-input')) {
        setOpen(true);
      }

      if (!ref.current) return;
      const inputContainer =
        ref.current.parentElement?.parentElement?.parentElement;

      if (
        (inputContainer && !inputContainer.contains(event.target)) ||
        (!inputContainer && !ref.current.contains(event.target))
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        className={`plugin-color-picker-pick-button ${open ? 'plugin-color-picker-pick-button--opened' : ''}`}
        type="button"
        onClick={toggleOpen}
        ref={ref}
      >
        <div className="plugin-color-picker-swatch-bg"></div>
        <div
          className={`plugin-color-picker-swatch ${!value ? 'plugin-color-picker-swatch--empty' : ''}`}
          style={{ background: value || '#ffffff' }}
        />
      </button>
      <div className="plugin-color-picker-picker">
        {uploaded_palette ? (
          <SwatchesPicker onChange={onChange} colors={swatches} />
        ) : (
          <SketchPicker
            color={value}
            onChange={onChange}
            presetColors={presetColors}
            onChangeComplete={onChangeComplete}
          />
        )}
      </div>
    </>
  );
};

export default ColorPicker;
