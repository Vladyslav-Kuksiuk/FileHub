const nameToClassCreator = new Map();
const nameToInstance = new Map();

export const registry = {
  register(name, componentCreator) {
    nameToClassCreator.set(name, componentCreator);
  },

  getInstance(name) {
    name = name.replace('#', '');
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
 *
 * @param _value
 * @param root0
 * @param {string} root0.kind
 * @param {string} root0.name
 */
export function inject(_value, {kind, name}) {
  if (kind === 'field') {
    return () => {
      return registry.getInstance(name);
    };
  }
}

/**
 *
 */
export function clearRegistry() {
  nameToClassCreator.clear();
  nameToInstance.clear();
}

