import { useCallback, useEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ name, value, formik }) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  const onChange = useCallback(
    (color) => {
      formik.setFieldValue(name, color.hex);
      formik.validateForm('change');
    },
    [formik, name],
  );

  const toggleOpen = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.className.includes('plugin-color-picker-input')) {
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
        <div style={{ backgroundColor: value || '#ffffff' }} />
      </button>
      <div className="plugin-color-picker-picker">
        <ChromePicker color={value} onChangeComplete={onChange} />
      </div>
    </>
  );
};

export default ColorPicker;
