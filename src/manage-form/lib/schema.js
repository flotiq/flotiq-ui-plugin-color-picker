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
          presets: {
            type: 'array',
            items: {
              properties: {
                field_name: {
                  type: 'string',
                },
                content_type: {
                  type: 'string',
                },
                colors_preset: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
              required: [],
              type: 'object',
            },
          },
        },
      },
    ],
    required: [],
    additionalProperties: false,
  },
  metaDefinition: {
    order: ['config', 'presets'],
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
      presets: {
        label: 'presets',
        helpText: '',
        unique: false,
        inputType: 'object',
        items: {
          propertiesConfig: {
            field_name: {
              label: 'Field name',
              helpText: '',
              unique: false,
              inputType: 'text',
            },
            content_type: {
              label: 'Content type name',
              helpText: '',
              unique: false,
              inputType: 'text',
            },
            colors_preset: {
              label: 'Colors preset',
              helpText: '',
              unique: false,
              inputType: 'simpleList',
            },
          },
          order: ['field_name', 'content_type', 'colors_preset'],
        },
        hidden: true,
      },
    },
  },
});
