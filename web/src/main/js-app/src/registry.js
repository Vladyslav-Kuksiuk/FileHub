const nameToClassCreator = new Map();
const nameToInstance = new Map();

/**
 * Registry to save and provide dependencies.
 */
export const registry = {
  register(name, componentCreator) {
    nameToClassCreator.set(name, componentCreator);
  },

  getInstance(name) {
    if (nameToInstance.has(name)) {
      return nameToInstance.get(name);
    }
    const componentClassCreator = nameToClassCreator.get(name);
    if (componentClassCreator === undefined) {
      throw new Error('Unknown component name: ' + name);
    }
    const instance = componentClassCreator();
    nameToInstance.set(name, instance);
    return instance;
  },
};

/**
 * Decorator to provide registered dependency by name.
 *
 * @param {any} _value
 * @param {object} state
 * @param {string} state.kind
 * @param {string} state.name
 * @returns {void | function(): any}
 */
export function inject(_value, {kind, name}) {
  if (kind === 'field') {
    return () => {
      return registry.getInstance(name);
    };
  }
}

/**
 * Clears all instances and creators in registry.
 */
export function clearRegistry() {
  nameToClassCreator.clear();
  nameToInstance.clear();
}

