/**
  @module ember-flexberry
*/

import Ember from 'ember';

/**
  Configures a <a href="https://github.com/jamesarosen/ember-i18n">i18n service</a> for current application instance.
  Sets browser's current locale to <a href="https://github.com/jamesarosen/ember-i18n/wiki/Doc:-Setting-the-Locale">i18n.locale</a> property.

  @for ApplicationInstanceInitializer
  @method i18n.initialize
  @param {<a href="http://emberjs.com/api/classes/Ember.ApplicationInstance.html">Ember.ApplicationInstance</a>} applicationInstance Ember application instance.
*/
export function initialize(applicationInstance) {
  let i18n = applicationInstance.lookup('service:i18n');
  if (Ember.isNone(i18n)) {
    return;
  }

  let ENV = applicationInstance._lookupFactory('config:environment');
  let defaultLocale = (ENV.i18n || {}).defaultLocale;
  let currentLocale = defaultLocale;

  // If no default locale is set...
  if (Ember.isBlank(defaultLocale)) {
    // ...then trying to get locale from browser settings.
    // See https://alicoding.com/detect-browser-language-preference-in-firefox-and-chrome-using-javascript
    currentLocale = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    let indexOfDash = currentLocale.indexOf('-');
    if (!Ember.isBlank(currentLocale) && indexOfDash > -1) {
      currentLocale = currentLocale.substr(0, indexOfDash);
    }
  }

  // Check if current locale is supported.
  let locales = applicationInstance.lookup('controller:application').get('locales');
  if (!locales || Ember.typeOf(locales) !== 'array' || locales.indexOf(currentLocale) === -1 || Ember.isBlank(currentLocale)) {
    Ember.warn('Default locale from `environment.js` or current browser language is not supported. Use "en" as default locale.');
    currentLocale = 'en';
  }

  let i18nLocale = i18n.get('locale');
  if (currentLocale !== i18nLocale) {
    i18n.set('locale', currentLocale);
  }
}

export default {
  name: 'i18n',
  initialize
};
