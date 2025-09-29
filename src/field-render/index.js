import { addElementToCache, getCachedElement } from '../lib/plugin-helpers';
import pluginInfo from '../plugin-manifest.json';

export const handleFieldRender = (
  { contentType, name, value, formik },
  toast,
) => {
  if (
    !contentType?.nonCtdSchema ||
    contentType?.name !== pluginInfo.id ||
    name !== 'color_palette'
  )
    return;

  const key = `${pluginInfo.id}-upload-palette`;
  let buttonsContainer = getCachedElement(key)?.element;
  let data = getCachedElement(key)?.root || {};

  data.value = value;

  const isPallete = value && value.length > 0;

  if (!buttonsContainer) {
    buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'flotiq-color-picker-palette-container';

    buttonsContainer.innerHTML = /* html */ `
      <label class="flotiq-color-picker-palette-button flotiq-color-picker-palette-upload 
              ${isPallete ? 'flotiq-color-picker-palette--hidden' : ''}"
        >
        <input
          class="flotiq-color-picker-palette-upload-input"
          accept=".json"
          type="file"
        />
        Upload Palette
      </label>
      <div class="flotiq-color-picker-palette-file-card ${!isPallete ? 'flotiq-color-picker-palette--hidden' : ''}">
        <div class="flotiq-color-picker-palette-file-image">
          <div class="flotiq-color-picker-palette-file-extension">
            json
          </div>
        </div>
        <div class="flotiq-color-picker-palette-file-info">
          <div class="flotiq-color-picker-palette-file-name"></div>
          <div class="flotiq-color-picker-palette-file-actions">
            <button class="flotiq-color-picker-palette-file-remove" type="button">
                <span></span>
            </button>
            <button 
              class="flotiq-color-picker-palette-button flotiq-color-picker-palette-file-export" 
              type="button"
            >
              Export
            </button>
          </div>
        </div>
      </div>        
    `;

    const uploadInput = buttonsContainer.querySelector(
      '.flotiq-color-picker-palette-upload-input',
    );

    uploadInput.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);

          console.log({ file_name: file.name, palette: content });

          formik.setFieldValue('color_palette', [
            { file_name: file.name, palette: content },
          ]);
        } catch {
          toast.error(
            'Error while reading the file. Make sure it is valid JSON.',
          );
        }
      };
      reader.readAsText(file);
    };

    const exportButton = buttonsContainer.querySelector(
      '.flotiq-color-picker-palette-file-export',
    );
    exportButton.onclick = () => {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data.value?.[0]?.palette || []),
      )}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        data.value?.[0]?.file_name || 'palette.json',
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    const removeButton = buttonsContainer.querySelector(
      '.flotiq-color-picker-palette-file-remove',
    );
    removeButton.onclick = () => {
      formik.setFieldValue('color_palette', []);
    };
  }

  const card = buttonsContainer.querySelector(
    '.flotiq-color-picker-palette-file-card',
  );
  const uploadButton = buttonsContainer.querySelector(
    '.flotiq-color-picker-palette-upload',
  );

  if (isPallete) {
    uploadButton.classList.add('flotiq-color-picker-palette--hidden');
    card.classList.remove('flotiq-color-picker-palette--hidden');

    buttonsContainer.querySelector(
      '.flotiq-color-picker-palette-file-name',
    ).innerText = value[0].file_name;
  } else {
    uploadButton.classList.remove('flotiq-color-picker-palette--hidden');
    card.classList.add('flotiq-color-picker-palette--hidden');
  }

  addElementToCache(buttonsContainer, data, key);

  return buttonsContainer;
};
