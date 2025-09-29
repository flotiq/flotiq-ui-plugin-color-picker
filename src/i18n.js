import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      ChooseColor: 'Choose a color',
      Config: 'Config',
      ContentType: 'Content Type',
      ContentTypeUpdateError:
        'Something occured when updating content type definition',
      DeleteRegexp: {
        Content:
          'Do you want to also remove the hex color regex from the fields ' +
          'for the Content Types: <strong>{{types}}</strong>? ' +
          'If you do not agree, you can do this manually later by editing the Content Type Definitions.',
        Keep: 'Keep regex',
        Remove: 'Remove regex',
        Title: 'Do you want to remove hex color regex?',
      },
      ExportPalette: 'Export',
      FieldRequired: 'Field is required',
      Fields: 'Fields',
      InvalidPalette:
        'Invalid palette format. Make sure the JSON structure is correct.',
      SettingsUpdateError: 'Something occured when updating plugin settings',
      UpdateError: 'Something occured when updating plugin',
      UploadPalette: 'Upload Palette',
      WrongField: "One of the fields doesn't exist",
      WrongJSON: 'Error while reading the file. Make sure it is valid JSON.',
    },
  },
  pl: {
    translation: {
      ChooseColor: 'Wybierz kolor',
      Config: 'Konfiguracja',
      ContentType: 'Definicja typu',
      ContentTypeUpdateError:
        'Wystąpił błąd podczas aktualizacji definicji typu',
      DeleteRegexp: {
        Content:
          'Czy chcesz również usunąć wyrażenie regularne koloru z pól ' +
          'dla typów treści: <strong>{{types}}</strong>? ' +
          'Jeśli się nie zgadzasz, możesz to zrobić ręcznie później, edytując definicje typów treści.',
        Keep: 'Zachowaj wyrażenie regularne',
        Remove: 'Usuń wyrażenie regularne',
        Title: 'Czy chcesz usunąć wyrażenie regularne koloru?',
      },
      ExportPalette: 'Eksportuj',
      Fields: 'Pola',
      FieldRequired: 'Pole jest wymagane',
      InvalidPalette:
        'Nieprawidłowy format palety. Upewnij się, że struktura JSON jest poprawna.',
      SettingsUpdateError:
        'Wystąpił błąd podczas aktualizacji ustawień wtyczki',
      UpdateError: 'Wystąpił błąd podczas aktualizacji wtyczki',
      UploadPalette: 'Wgraj paletę',
      WrongField: 'Jedno z pól nie istnieje',
      WrongJSON:
        'Błąd podczas odczytu pliku. Upewnij się, że to prawidłowy JSON.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  supportedLngs: ['en', 'pl'],
  fallbackLng: 'en',
});

export default i18n;
