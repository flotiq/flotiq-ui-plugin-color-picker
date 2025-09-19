export const isFieldInPluginSettings = (
  name,
  contentType,
  properties,
  parsedSettings,
) => {
  if (!contentType || properties?.inputType !== 'text') return false;

  const contentTypeSettings = parsedSettings?.config?.filter(
    ({ content_type }) => content_type === contentType.name,
  );

  if (!contentTypeSettings?.length) return false;

  const isInSettings =
    contentTypeSettings.filter(({ fields }) =>
      fields.includes(name.replace(/\[\d+\]/g, '')),
    ).length > 0;

  return isInSettings;
};
