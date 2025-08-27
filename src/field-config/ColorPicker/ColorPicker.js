import { useCallback, useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

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

const ColorPicker = ({ name, value, formik }) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  const onChange = useCallback(
    (color) => {
      let hexColor = color.hex;
      if (typeof color.rgb?.a === 'number' && color.rgb.a < 1) {
        hexColor += alphaToHex(color.rgb.a);
      }
      formik.setFieldValue(name, hexColor);
      formik.validateForm('change');
    },
    [formik, name],
  );

  const toggleOpen = useCallback(() => {
    setOpen((open) => !open);
  }, []);

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
        <ChromePicker color={value} onChange={onChange} />
      </div>
    </>
  );
};

export default ColorPicker;
