import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Swatches from './Swatches';
import Sketch from './Sketch';

const ColorPicker = ({
  name,
  value,
  contentType,
  form,
  swatches,
  client,
  getPluginSettings,
  setPluginSettings,
}) => {
  const ref = useRef();
  const [isBottom, setIsBottom] = useState(false);
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

  const onRef = useCallback((button) => {
    const form = document.querySelector('form')?.parentElement;
    if (!form || !button) return;

    const formRect = form.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    ref.current = button;
    setIsBottom(
      buttonRect.top - formRect.top > 300 &&
        formRect.bottom - buttonRect.bottom < 300,
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
          style={{ background: swatchesByName[value] || value || '#ffffff' }}
        />
      </button>
      <div
        className={
          'plugin-color-picker-picker ' +
          (isBottom ? 'plugin-color-picker-picker--top' : '')
        }
        ref={ref}
      >
        {swatches ? (
          <Swatches name={name} form={form} swatches={swatches} />
        ) : (
          <Sketch
            name={name}
            value={value}
            contentType={contentType}
            form={form}
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
