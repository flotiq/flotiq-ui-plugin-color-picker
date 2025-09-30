import { useCallback, useMemo } from 'react';
import { SwatchesPicker } from 'react-color';

const Swatches = ({ name, form, swatches }) => {
  const swatchesByColor = useMemo(() => {
    const swatchesMap = {};
    swatches.forEach((group) => {
      group.forEach((color) => {
        const data =
          typeof color === 'string' ? { value: color, name: color } : color;
        swatchesMap[data.value.toLowerCase()] = data.name;
      });
    });
    return swatchesMap;
  }, [swatches]);

  const swatchesArray = useMemo(
    () =>
      swatches.map((group) =>
        group.map((color) => {
          return typeof color === 'string' ? color : color.value;
        }),
      ),
    [swatches],
  );

  const onChange = useCallback(
    (color) => {
      const colorName = swatchesByColor[color.hex] || color.hex;
      form.setFieldValue(name, colorName);
      return;
    },
    [form, name, swatchesByColor],
  );

  return <SwatchesPicker onChange={onChange} colors={swatchesArray} />;
};

export default Swatches;
