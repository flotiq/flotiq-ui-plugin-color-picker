import { registerFn } from './plugin-helpers';
import pluginInfo from './plugin-manifest.json';
import i18n from './i18n';
import { handleFieldConfig } from './field-config';
import { handleManageForm } from './manage-form';
import { handleRemovedEvent } from './plugin-removed';
import cssString from './styles/index.css';

registerFn(
  pluginInfo,
  (handler, client, { getLanguage, getPluginSettings, toast, openModal }) => {
    if (!document.getElementById(`${pluginInfo.id}-styles`)) {
      const style = document.createElement('style');
      style.id = `${pluginInfo.id}-styles`;
      style.textContent = cssString;
      document.head.appendChild(style);
    }

    const language = getLanguage();
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }

    handler.on('flotiq.form.field::config', (data) =>
      handleFieldConfig(data, getPluginSettings),
    );

    handler.on('flotiq.plugins.manage::form-schema', (data) =>
      handleManageForm(data, client, toast),
    );

    handler.on('flotiq.plugin::removed', () =>
      handleRemovedEvent(client, getPluginSettings, openModal),
    );

    handler.on('flotiq.language::changed', ({ language }) => {
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }
    });
  },
);
