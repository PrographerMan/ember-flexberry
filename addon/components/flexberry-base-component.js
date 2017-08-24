/**
  @module ember-flexberry
 */

import Ember from 'ember';

import DynamicProperties from '../mixins/dynamic-properties';

const { getOwner } = Ember;

/**
 * Base component for Flexberry Ember UI Components.
 *
 * @class FlexberryBaseComponent
 * @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
 */
export default Ember.Component.extend(
  DynamicProperties, {
  /**
    Flag: indicates whether component is readonly.

    @property readonly
    @type Boolean
    @default false
   */
  readonly: false,

  /**
    Readonly HTML attribute following to the `readonly` query param. According to the W3C standard, returns 'readonly' if `readonly` is `true` and `undefined` otherwise.

    @property readonlyAttr
    @type String|undefined
    @readOnly
   */
  readonlyAttr: Ember.computed('readonly', function() {
    return this.get('readonly') ? 'readonly' : undefined;
  }),

  /**
    Flag: indicates whether component is required.

    @property required
    @type Boolean
    @default false
   */
  required: false,

  /**
    Unique name of the component.
    TODO: use guidFor from 'ember-metal/utils'

    @property componentName
    @type String
   */
  componentName: undefined,

  /**
    Component dynamic properties ({ componentPropertyName: value }).
    Used when component renders dynamically with ember {{component}} helper:
    {{component 'my-component' value=value dynamicProperties=myConponentProperties}}.
    In the end of component initialization its properties values will be replaced with values from this object.

    @property dynamicProperties
    @type Object
    @default null
   */
  dynamicProperties: null,

  /**
    Model to which current component's value is related.

    @property relatedModel
    @type DS.Model
    @default null
   */
  relatedModel: null,

  /**
    Path to component's settings in application configuration (JSON from ./config/environment.js).

    @property appConfigSettingsPath
    @type String
    @default 'APP.components.flexberryBaseComponent'
   */
  appConfigSettingsPath: 'APP.components.flexberryBaseComponent',

  /**
    Application configuration (JSON from ./config/environment.js).

    @property appConfig
    @type Object
    @default null
   */
  appConfig: null,

  /**
    Component settings object from application configuration (part of JSON from ./config/environment.js).
    Part of appConfig related to appConfigSettingsPath.

    @property appConfigSettings
    @type Object
    @default null
   */
  appConfigSettings: null,

  /**
    Current controller.

    @property currentController
    @type Ember.Controller
    @default null
   */
  currentController: null,

  /**
    Initializes component properties.
   */
  init() {
    this._super(...arguments);

    // Get and remember current controller.
    let currentController = this.getTargetObjectByCondition((targetObject) => {
      return targetObject instanceof Ember.Controller;
    });
    this.set('currentController', currentController);

    // Set related model.
    let relatedModel = this.get('relatedModel');
    if (Ember.isNone(relatedModel) && !Ember.isNone(currentController)) {
      relatedModel = currentController.get('model');
      this.set('relatedModel', relatedModel);
    }

    // Import application config\environment.
    let appConfig = getOwner(this)._lookupFactory('config:environment');
    if (!Ember.isNone(appConfig)) {
      this.set('appConfig', appConfig);
    }

    let appConfigSettingsPath = this.get('appConfigSettingsPath');
    if (Ember.typeOf(appConfigSettingsPath) === 'string') {
      let appConfigSettings = Ember.get(appConfig, appConfigSettingsPath);
      if (!Ember.isNone(appConfigSettings)) {
        this.set('appConfigSettings', appConfigSettings);
      }
    }
  },

  /**
    Initializes component's property with recpect to following priority:
    1 - template-defined parameters,
    2 - applicaion configuration-defined parameters (JSON from ./config/environment by path defined in 'appConfigSettingsPath' property),
    3 - component-defined defaults.
    Note! It is important to be declared as undefined for those component properties, which will be initialized through 'initProperty' call.

    ```javascript
    // ./config/environment.js.
    module.exports = function(environment) {
      var ENV = {
        APP: {
          components: {
            myComponent: {
              myComponentProperty: 'myComponentProperty config-defined default value',
            }
          }
        }
      };
      return ENV;
    };
    ```

    ```javascript
    // /components/my-component.js
    import FlexberryBaseComponent from 'ember-flexberry/flexberry-base-component';

    export default FlexberryBaseComponent.extend({
      appConfigSettingsPath: 'APP.components.myComponent',

      myComponentProperty: undefined,

      init() {
        this._super.apply(this, arguments);
        this.initProperty({ propertyName: 'myComponentProperty', defaultValue: 'myComponentProperty default value' });
      }
    });
    ```

    @method initProperty
    @param {Object} options Method options.
    @param {String} options.propertyName Component's property name.
    @param {*} options.defaultValue Component's property default value (from component defined default's).
   */
  initProperty(options) {
    options = options || {};
    if (Ember.typeOf(options.propertyName) !== 'string') {
      return;
    }

    // If property value is already defined in template,
    // then we should break property initialization.
    let componentDefinedPropertyValue = this.get(options.propertyName);
    if (Ember.typeOf(componentDefinedPropertyValue) !== 'undefined') {
      return;
    }

    // Property value is not defined in template,
    // then we should set configuration-defined value or default.
    let configDefinedPropertyValue;
    let appConfigSettings = this.get('appConfigSettings');
    if (!Ember.isNone(appConfigSettings)) {
      configDefinedPropertyValue = Ember.get(appConfigSettings, options.propertyName);
    }

    if (Ember.typeOf(configDefinedPropertyValue) !== 'undefined') {
      this.set(options.propertyName, configDefinedPropertyValue);
    } else {
      this.set(options.propertyName, options.defaultValue);
    }
  },

  /**
    Returns that 'targetObject' (from 'targetObject's hierarchy) which satisfies a given condition.

    ```javascript
    let controller = this.getTargetObjectByCondition((targetObject) => {
      return targetObject instanceof Ember.Controller;
    });
    ```

    @method getTargetObjectByCondition.
    @param {Function} condition Callback-function, which will be called for each 'targetObject' in 'targetObject's hierarchy, until callback return true for one of them.
    @return {null|Ember.Component|Ember.Controller} Target object which satisfies a given condition or null.
   */
  getTargetObjectByCondition(condition) {
    if (Ember.typeOf(condition) !== 'function') {
      return null;
    }

    // Component's 'targetObject' is parent component or a controller (in the end of components hierarchy).
    // Search until 'targetObject' is none or condition is true.
    let targetObject = this.get('_targetObject');
    while (!(Ember.isNone(targetObject) || condition(targetObject))) {
      targetObject = targetObject.get('_targetObject');
    }

    return targetObject;
  },
});
