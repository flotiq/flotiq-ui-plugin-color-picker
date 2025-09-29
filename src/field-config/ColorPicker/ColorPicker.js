import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Swatches from './Swatches';
import Sketch from './Sketch';

const ColorPicker = ({
  name,
  value,
  contentType,
  formik,
  swatches,
  client,
  getPluginSettings,
  setPluginSettings,
}) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  const swatchesByName = useMemo(() => {
    if (!swatches) return {};
    const swatchesMap = {};
    swatches.forEach((group) => {
      group.forEach((color) => {
        const data =
          typeof color === 'string' ? { value: color, name: color } : color;
        swatchesMap[data.name] = data.value;
      });
    });
    return swatchesMap;
  }, [swatches]);

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
          style={{ background: swatchesByName[value] || value || '#ffffff' }}
        />
      </button>
      <div className="plugin-color-picker-picker">
        {swatches ? (
          <Swatches
            name={name}
            formik={formik}
            swatches={swatches}
          />
        ) : (
          <Sketch
            name={name}
            value={value}
            contentType={contentType}
            formik={formik}
            client={client}
            getPluginSettings={getPluginSettings}
            setPluginSettings={setPluginSettings}
          />
        )}
      </div>
    </>
  );
};

export default ColorPicker;
