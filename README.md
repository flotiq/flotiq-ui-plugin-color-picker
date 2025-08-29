<a href="https://flotiq.com/">
    <img src="https://editor.flotiq.com/fonts/fq-logo.svg" alt="Flotiq logo" title="Flotiq" align="right" height="60" />
</a>

# About Flotiq Color Picker plugin

The Flotiq Color Picker plugin transforms standard text input fields into intuitive color selection interfaces. This plugin provides a visual way to select and manage colors for your content, eliminating the need to manually enter hex color codes.

## Plugin outcome 

Transformed text field into color picker:

<img src=".docs/input-color-picker.png" alt="Input with color picker" width="400"/>

## Configuring the plugin

1. First, click "Add Item".
2. Select the Content Type.
3. Choose at least one field to transform for provided Content Type.

<img src=".docs/color-picker-settings.png" alt="Color picker configuration" width="400"/>

After saving the plugin, the selected fields in your content type definition will be automatically updated with a validation pattern (regex) to ensure proper hex color code format. To maintain color validation functionality, please keep this pattern intact and avoid manual removal.

# Development

## Quickstart:

1. `yarn`
2. `yarn start`
3. work work work
4. update your `src/plugin-manifest.json` file to contain the production URL and other plugin information
5. `yarn build`
6. paste js code from `./build/static/js/main.xxxxxxxx.js` to Flotiq console
7. navigate to affected Flotiq pages

Dev environment is configured to use:
- `prettier` - best used with automatic format on save in IDE, remember to run `yarn format` before commiting changes
- `eslint` - it is built into both `start` and `build` commands

## Deployment

<!-- TO DO -->

## Loading the plugin

### URL

1. Open Flotiq editor
2. Open Chrome Dev console
3. Execute the following script
   ```javascript
   FlotiqPlugins.loadPlugin("plugin-id", "<URL TO COMPILED JS>");
   ```
4. Navigate to the view that is modified by the plugin

### Directly

1. Open Flotiq editor
2. Open Chrome Dev console
3. Paste the content of `static/js/main.xxxxxxxx.js`
4. Navigate to the view that is modified by the plugin

### Deployment

1. Open Flotiq editor
2. Add a new plugin and paste the URL to the hosted `plugin-manifest.json` file (you can use `https://localhost:3050/plugin-manifest.json` as long as you have accepted self-signed certificate for this url)
3. Navigate to the view that is modified by the plugin

## Collaborating

If you wish to talk with us about this project, feel free to hop on our [![Discord Chat](https://img.shields.io/discord/682699728454025410.svg)](https://discord.gg/FwXcHnX).

If you found a bug, please report it in [issues](https://github.com/flotiq/flotiq-ui-plugin-templates-plain-js/issues).
