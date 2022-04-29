export const waitForElementToLoad = (selector : string): Promise<Element> => {
    return new Promise<Element>(resolve => {
        const el = document.querySelector(selector)!;
        if (el) {
            return resolve(el);
        }
        const observer = new MutationObserver(mutations => {
            const el = document.querySelector(selector)!;
            if (el) {
                resolve(el);
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
  }