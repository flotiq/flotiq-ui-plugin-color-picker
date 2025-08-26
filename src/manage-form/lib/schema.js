import i18n from '../../i18n';
import pluginInfo from '../../plugin-manifest.json';

export const getSchema = (contentTypes) => ({
  id: pluginInfo.id,
  name: pluginInfo.id,
  label: pluginInfo.name,
  draftPublic: false,
  internal: false,
  schemaDefinition: {
    type: 'object',
    allOf: [
      {
        $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
      },
      {
        type: 'object',
        properties: {
          config: {
            type: 'array',
            items: {
              type: 'object',
              required: ['fields', 'content_type'],
              properties: {
                fields: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  minLength: 1,
                },
                content_type: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    ],
    required: [],
    additionalProperties: false,
  },
  metaDefinition: {
    order: ['config'],
    propertiesConfig: {
      config: {
        items: {
          order: ['content_type', 'fields'],
          propertiesConfig: {
            fields: {
              label: i18n.t('Fields'),
              unique: false,
              helpText: '',
              multiple: true,
              inputType: 'select',
              optionsWithLabels: [],
              useOptionsWithLabels: true,
            },
            content_type: {
              label: i18n.t('ContentType'),
              unique: false,
              helpText: '',
              inputType: 'select',
              optionsWithLabels: contentTypes,
              useOptionsWithLabels: true,
            },
          },
        },
        label: i18n.t('Config'),
        unique: false,
        helpText: '',
        inputType: 'object',
      },
    },
  },
});
