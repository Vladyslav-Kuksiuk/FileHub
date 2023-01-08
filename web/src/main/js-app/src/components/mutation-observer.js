/**
 * Observer on HTMLElement removing.
 */
class RemovalObserver {
  #removalHandlers = new Map();

  /**
   * Constructor.
   */
  constructor() {
    const body = document.body;
    const config = {
      childList: true,
      subtree: true,
    };

    const callback = (mutationsList) => {
      [...mutationsList]
          .filter((mutation) => {
            return mutation.type === 'childList';
          })
          .forEach((mutation) => {
            const removedNodes = mutation.removedNodes;
            removedNodes.forEach((removedNode) => {
              const listenedNodes = this.#removalHandlers.keys();
              [...listenedNodes].forEach((listenedNode) => {
                if (removedNode.contains(listenedNode)) {
                  this.#removalHandlers.get(listenedNode)();
                  this.#removalHandlers.delete(listenedNode);
                }
              });
            });
          });
    };

    const observer = new MutationObserver(callback);

    observer.observe(body, config);
  }

  /**
   * Adds handler on HTMLElement removing.
   *
   * @param {HTMLElement} element
   * @param {function(): void} handler
   */
  observe(element, handler) {
    this.#removalHandlers.set(element, handler);
  }
}

export const Observer = new RemovalObserver();
