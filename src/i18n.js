import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
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
      FieldRequired: 'Field is required',
      Fields: 'Fields',
      SettingsUpdateError: 'Something occured when updating plugin settings',
      UpdateError: 'Something occured when updating plugin',
      WrongField: "One of the fields doesn't exist",
    },
  },
  pl: {
    translation: {
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
      Fields: 'Pola',
      FieldRequired: 'Pole jest wymagane',
      SettingsUpdateError:
        'Wystąpił błąd podczas aktualizacji ustawień wtyczki',
      UpdateError: 'Wystąpił błąd podczas aktualizacji wtyczki',
      WrongField: 'Jedno z pól nie istnieje',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  supportedLngs: ['en', 'pl'],
  fallbackLng: 'en',
});

export default i18n;
