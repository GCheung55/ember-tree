import Ember from 'ember';
import { moduleForComponent } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import promiseArray from 'ember-awesome-macros/promise-array';

const {
  set,
  RSVP: { defer },
  A: newArray
} = Ember;

const globals = {};

let deferred;

function init() {
  moduleForComponent('tree-node', 'Integration | Component | tree node', {
    integration: true,
    beforeEach() {
      deferred = defer();
      globals.wasChildrenCalled = false;

      this.set('model', Ember.Object.extend({
        text: 'test-text',
        children: promiseArray(function() {
          globals.wasChildrenCalled = true;
          return deferred.promise;
        })
      }).create());
      this.set('loadingText', 'test-loading');

      this.on('toggleChanged', (isOpen, model) => {
        set(model, 'isOpen', isOpen);
      });
      this.on('opened', () => {});
      this.on('closed', () => {});
      this.on('selectionChanged', (isSelected, model) => {
        set(model, 'isSelected', isSelected);
      });
      this.on('selected', () => {});
      this.on('unselected', () => {});
    }
  });
}

export default init;

export { init, globals };

export function renderDefault(shouldResolve = true) {
  this.render(hbs`
    {{#tree-node
      model
      text=model.text
      loadingText=loadingText
      toggleChanged="toggleChanged"
      opened="opened"
      closed="closed"
      selectionChanged="selectionChanged"
      selected="selected"
      unselected="unselected"
      as |child|
    }}
      {{child}}
    {{/tree-node}}
  `);

  if (shouldResolve) {
    deferred.resolve(newArray(['test-child']));
  }
}
