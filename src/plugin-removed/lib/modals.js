import i18n from '../../i18n';
import { addElementToCache, getCachedElement } from '../../lib/plugin-helpers';
import pluginInfo from '../../plugin-manifest.json';

const warningModalId = 'plugin-color-picker-warning-modal';
const headingClass = 'plugin-color-picker-clean-ctd-warning__heading';
const paragraphClass = 'plugin-color-picker-clean-ctd-warning__content';

const getContent = (headerText, contentText) => {
  const modalContentCacheKey = `${pluginInfo.id}-clean-ctd-warning`;
  let modalContent = getCachedElement(modalContentCacheKey)?.element;

  if (!modalContent) {
    modalContent = document.createElement('div');
    modalContent.className = 'plugin-color-picker-clean-ctd-warning';

    modalContent.innerHTML = /* html */ `
        <h3 class="${headingClass}"></h3>
        <p class="${paragraphClass}"></p>
        `;

    addElementToCache(modalContent, null, modalContentCacheKey);
  }

  const heading = modalContent.querySelector(`.${headingClass}`);
  heading.textContent = headerText;

  const content = modalContent.querySelector(`.${paragraphClass}`);
  content.innerHTML = contentText;

  return modalContent;
};

export const showWarningModal = (types, openModal) =>
  openModal({
    id: warningModalId,
    size: 'lg',
    content: getContent(
      i18n.t('DeleteRegexp.Title'),
      i18n.t('DeleteRegexp.Content', {
        types,
      }),
    ),
    hideClose: true,
    buttons: [
      {
        key: 'clean',
        label: i18n.t('DeleteRegexp.Remove'),
        color: 'red',
        result: true,
      },
      {
        key: 'keep',
        label: i18n.t('DeleteRegexp.Keep'),
        color: 'blueBordered',
        result: false,
      },
    ],
  });

export const errorModal = async (openModal) =>
  openModal({
    id: warningModalId,
    content: getContent(i18n.t('Warning'), i18n.t('DeleteRegexp.Error')),
    buttons: [
      {
        key: 'ok',
        label: 'Ok',
        color: 'blue',
      },
    ],
  });
