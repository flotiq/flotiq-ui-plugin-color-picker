import { useCallback, useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
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
  form,
  client,
  getPluginSettings,
  setPluginSettings,
}) => {
  const ref = useRef();
  const [isBottom, setIsBottom] = useState(false);
  const [open, setOpen] = useState(false);
  const [presetColors, setPresetColors] = useState(() =>
    getFieldColorsPreset(getPluginSettings(), name, contentType?.name),
  );

  const onChange = useCallback(
    (color) => {
      let hexColor = color.hex;
      if (typeof color.rgb?.a === 'number' && color.rgb.a < 1) {
        hexColor += alphaToHex(color.rgb.a);
      }
      form.setFieldValue(name, hexColor);
    },
    [form, name],
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

  const onRef = useCallback((button) => {
    const form = document.querySelector('form');
    if (!form || !button) return;

    const formRect = form.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    ref.current = button;
    setIsBottom(
      buttonRect.top - formRect.top > 270 &&
        formRect.bottom - buttonRect.bottom < 270,
    );
  }, []);

  return (
    <>
      <button
        className={`plugin-color-picker-pick-button ${open ? 'plugin-color-picker-pick-button--opened' : ''}`}
        type="button"
        onClick={toggleOpen}
        ref={onRef}
      >
        <div className="plugin-color-picker-swatch-bg"></div>
        <div
          className={`plugin-color-picker-swatch ${!value ? 'plugin-color-picker-swatch--empty' : ''}`}
          style={{ background: value || '#ffffff' }}
        />
      </button>
      <div
        className={
          'plugin-color-picker-picker ' +
          (isBottom ? 'plugin-color-picker-picker--top' : '')
        }
        ref={ref}
      >
        <SketchPicker
          color={value}
          onChange={onChange}
          presetColors={presetColors}
          onChangeComplete={onChangeComplete}
        />
      </div>
    </>
  );
};

export default ColorPicker;
