import deepEqual from 'deep-equal';
import pluginInfo from '../plugin-manifest.json';
import { errorModal, showWarningModal } from './lib/modals';
import { getUpdateData } from '../lib/transform-ctd';

export const handleRemovedEvent = async (
  client,
  getPluginSettings,
  openModal,
) => {
  const pluginSettings = JSON.parse(getPluginSettings() || '{}');

  let showErrorModal = false;

  try {
    const contentTypeNames = (pluginSettings.config || []).map(
      ({ content_type }) => content_type,
    );

    const { body, ok } = await client.getContentTypes({
      names: contentTypeNames,
      limit: contentTypeNames.length,
    });

    if (!ok) {
      throw new Error(body);
    }

    const contentTypesAcc = (body.data || []).reduce((acc, ctd) => {
      acc[ctd.name] = ctd;
      return acc;
    }, {});

    if (pluginSettings?.color_palette?.length) {
      return;
    }

    const removePatterns = await showWarningModal(
      contentTypeNames
        .map(
          (contentType) => contentTypesAcc[contentType]?.label || contentType,
        )
        .join(', '),
      openModal,
    );

    if (!removePatterns) return;

    const ctdsToUpdate = getUpdateData(pluginSettings, contentTypesAcc, true);

    await Promise.all(
      ctdsToUpdate.map(async ({ ctd, ctdClone }) => {
        const isSame = deepEqual(ctd, ctdClone);
        if (isSame) return;

        const { body, ok } = await client[ctd.name].putContentType(ctdClone);

        if (!ok) {
          console.error(
            pluginInfo.id,
            'updating schema (after removing plugin)',
            ctd.name,
            body,
          );
          showErrorModal = true;
        }
      }),
    );
  } catch (e) {
    console.error(pluginInfo.id, 'removing error', e);
    showErrorModal = true;
  }

  if (showErrorModal) {
    await errorModal(openModal);
  }
};
