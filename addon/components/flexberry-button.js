/**
  @module ember-flexberry
*/

import Ember from 'ember';
import RequiredActionsMixin from '../mixins/required-actions';
import DomActionsMixin from '../mixins/dom-actions';
import DynamicActionsMixin from '../mixins/dynamic-actions';
import DynamicPropertiesMixin from '../mixins/dynamic-properties';

/**
  Component's CSS-classes names.
  JSON-object containing string constants with CSS-classes names related to component's .hbs markup elements.

  @property {Object} flexberryClassNames
  @property {String} flexberryClassNames.prefix Component's CSS-class names prefix ('flexberry-button').
  @property {String} flexberryClassNames.wrapper Component's wrapping <div> CSS-class name ('flexberry-button').
  @readonly
  @static

  @for FlexberryDdauCheckboxComponent
*/
const flexberryClassNamesPrefix = 'flexberry-button';
const flexberryClassNames = {
  prefix: flexberryClassNamesPrefix,
  wrapper: flexberryClassNamesPrefix
};

/**
  Flexberry button component with [Semantic UI button](http://semantic-ui.com/modules/button.html) style.

  Usage:
  templates/my-form.hbs
  ```handlebars
  {{flexberry-button
    caption="My button"
    click=(action "onMyButtonClick")
  }}
  ```

  controllers/my-form.js
  ```javascript
  actions: {
    onMyButtonClick(e) {
      // Log jQuery 'click' event object triggered after checkbox input was clicked.
      console.log('My button clicked. jQuery \'click\' event-object: ', e.originalEvent);
    }
  }
  ```

  @class FlexberryButtonComponent
  @extends <a href="http://emberjs.com/api/classes/Ember.Component.html">Ember.Component</a>
  @uses RequiredActionsMixin
  @uses DomActionsMixin
  @uses DynamicActionsMixin
  @uses DynamicPropertiesMixin
*/
let FlexberryButtonComponent = Ember.Component.extend(
  RequiredActionsMixin,
  DomActionsMixin,
  DynamicActionsMixin,
  DynamicPropertiesMixin, {

    /**
      Flag: indicates whether button has caption or not.

      @property _hasCaption
      @type Boolean
      @readOnly
      @private
    */
    _hasCaption: Ember.computed('caption', function () {
      const caption = this.get('caption');
      const isCaptionTypeIsString = Ember.typeOf(caption) === 'string';
      const isCaptionNotEmpty = Ember.$.trim(caption) !== '';
      const isCaptionSafe = Ember.String.isHTMLSafe(caption);
      const isHTMLSafeDefined = Ember.typeOf(Ember.String.isHTMLSafe) === 'function';
      const isStringOfCaptionEmpty = Ember.$.trim(Ember.get(caption, 'string')) === '';
      
      return isCaptionTypeIsString && isCaptionNotEmpty
        || isHTMLSafeDefined && isCaptionSafe && isStringOfCaptionEmpty === false
        || caption instanceof Ember.Handlebars.SafeString && isStringOfCaptionEmpty === false;
    }),

    /**
      Flag: indicates whether button has icon or not.

      @property _hasIcon
      @type Boolean
      @readOnly
      @private
    */
    _hasIcon: Ember.computed('iconClass', function () {
      let iconClass = this.get('iconClass');
      return Ember.typeOf(iconClass) === 'string' && Ember.$.trim(iconClass) !== '';
    }),

    /**
      Flag: indicates whether button has icon only (without caption).

      @property _hasIconOnly
      @type Boolean
      @readOnly
      @private
    */
    _hasIconOnly: Ember.computed('_hasIcon', '_hasCaption', function () {
      return this.get('_hasIcon') && !this.get('_hasCaption');
    }),

    /**
      Reference to component's CSS-classes names.
      Must be also a component's instance property to be available from component's .hbs template.
    */
    flexberryClassNames,

    /**
      Overridden ['tagName'](http://emberjs.com/api/classes/Ember.Component.html#property_tagName)
      to force <label> to be a component's wrapping element.

      @property tagName
      @type String
      @default 'label'
    */
    tagName: 'label',

    /**
      Component's wrapping <div> CSS-classes names.

      Any other CSS-classes can be added through component's 'class' property.
      ```handlebars
      {{flexberry-button
        class="red"
        caption="My red button"
        click=(action "onMyRedButtonClick")
      }}
      ```

      @property classNames
      @type String[]
      @default ['flexberry-button', 'ui', 'button']
    */
    classNames: [flexberryClassNames.wrapper, 'ui', 'button'],

    /**
      Components class names bindings.

      @property classNameBindings
      @type String[]
      @default ['readonly:disabled', '_hasIconOnly:icon']
    */
    classNameBindings: ['readonly:disabled', '_hasIconOnly:icon'],

    /**
      Components attributes bindings.

      @property attributeBindings
      @type String[]
      @default ['tooltip:title']
    */
    attributeBindings: ['tooltip:title'],

    /**
      Component's caption.

      @property caption
      @type String
      @default null
    */
    caption: null,

    /**
      Component's tooltip text.
      Will be added as wrapper's element 'title' attribute.

      @property tooltip
      @default null
    */
    tooltip: null,

    /**
      Component's icon CSS-class names.

      @property iconClass
      @type String
      @default null
    */
    iconClass: null,

    /**
      Flag: indicates whether component is in readonly mode.

      @property readonly
      @type Boolean
      @default false
    */
    readonly: false
  }
);

// Add component's CSS-class names as component's class static constants
// to make them available outside of the component instance.
FlexberryButtonComponent.reopenClass({
  flexberryClassNames
});

export default FlexberryButtonComponent;
