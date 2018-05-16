class containersTheme {
  constructor() {
    browser.tabs.onActivated.addListener(() => {
      this.getCurrentContainer();
    });
    browser.windows.onFocusChanged.addListener(() => {
      this.getCurrentContainer();
    });
    this.getCurrentContainer();
  }

  async getCurrentContainer() {
    const activeTabs = await browser.tabs.query({
      active: true
    });
    const hasUnpainted = activeTabs.some((tab) => {
      return this.isUnpaintedTheme(tab.cookieStoreId);
    });
    const containers = await this.getContainers();
    activeTabs.forEach((tab) => {
      const cookieStoreId = tab.cookieStoreId;
      if (!this.isUnpaintedTheme(cookieStoreId)) {
        this.changeThemeContainer(cookieStoreId,
          tab.windowId,
          containers.get(cookieStoreId));
      } else {
      this.changeThemeDefault(tab.windowId);
      }
    });
  }

  async getContainers() {
    const containersMap = new Map();
    const containers = await browser.contextualIdentities.query({});
    containers.forEach((container) => {
      containersMap.set(container.cookieStoreId, container);
    });
    return containersMap;
  }

  isUnpaintedTheme(currentCookieStore) {
    return (currentCookieStore == "firefox-default" ||
            currentCookieStore == "firefox-private");
  }

  async changeThemeDefault(windowId) {
    return browser.theme.update(windowId, {
      images: {
        headerURL: "",
      },
      colors: {
        accentcolor: "#0c0c0d",
        textcolor: "#fff",
        toolbar: "#38383d",
        toolbar_text: "#f9f9fa",
      }
    });
  }

  async changeThemeContainer(currentCookieStore, windowId, container) {
    this.cachedCookieStore = currentCookieStore;
    return browser.theme.update(windowId, {
      images: {
        headerURL: "",
      },
      colors: {
        accentcolor: "#0c0c0d",
        textcolor: "#fff",
        toolbar: container.colorCode,
        toolbar_text: "#111",
      }
    });
  }

}

new containersTheme();
