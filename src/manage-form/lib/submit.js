import i18n from '../../i18n';
import { getUpdateData } from '../../lib/transform-ctd';
import pluginInfo from '../../plugin-manifest.json';
import deepEqual from 'deep-equal';

export const getSubmitHandler =
  ({ contentTypes, reload, modalInstance }, client, toast) =>
  async (values) => {
    let close = true;

    const contentTypesAcc = (contentTypes || []).reduce((acc, ctd) => {
      if (ctd.internal) return acc;
      acc[ctd.name] = ctd;
      return acc;
    }, {});

    const ctdsToUpdate = getUpdateData(values, contentTypesAcc);

    try {
      await Promise.all(
        [...ctdsToUpdate].map(async ({ ctd, ctdClone }) => {
          const isSame = deepEqual(ctd, ctdClone);
          if (isSame) return;

          const { body, ok } = await client[ctd.name].putContentType(ctdClone);

          if (!ok) {
            console.error(pluginInfo.id, 'updating schema', ctd.name, body);
            toast.error(i18n.t('ContentTypeUpdateError', { name: ctd.name }), {
              duration: 5000,
            });
            close = false;
          }
        }),
      );

      const { body, ok } = await client['_plugin_settings'].patch(
        pluginInfo.id,
        {
          settings: JSON.stringify(values),
        },
      );
      if (!ok) {
        console.error(pluginInfo.id, 'updating plugin settings', body);
        toast.error(i18n.t('SettingsUpdateError'), { duration: 5000 });
        return [values, body];
      }

      if (close) modalInstance.resolve();
      reload();
      return [body, {}];
    } catch (e) {
      console.error(pluginInfo.id, 'updating catch', e);
      toast.error(i18n.t('UpdateError'), { duration: 5000 });
    }
  };
