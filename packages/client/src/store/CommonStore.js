import { makeAutoObservable, runInAction } from "mobx";
import authStore from "@docspace/common/store/AuthStore";
import api from "@docspace/common/api";
import { setDNSSettings } from "@docspace/common/api/settings";
import { setTimeoutSettings } from "@docspace/common/api/settings";
import toastr from "@docspace/components/toast/toastr";

class CommonStore {
  whiteLabelLogoUrls = [];
  whiteLabelLogoText = null;
  dnsSettings = {
    defaultObj: {},
    customObj: {},
  };
  timeoutSettings = {
    defaultObj: {},
    customObj: {},
  };

  isInit = false;
  isLoaded = false;
  isLoadedArticleBody = false;
  isLoadedSectionHeader = false;
  isLoadedSubmenu = false;
  isLoadedLngTZSettings = false;
  isLoadedDNSSettings = false;
  isLoadedTimeoutSettings = false;
  isLoadedPortalRenaming = false;
  isLoadedCustomization = false;
  isLoadedCustomizationNavbar = false;
  isLoadedWelcomePageSettings = false;
  isLoadedAdditionalResources = false;
  isLoadedCompanyInfoSettingsData = false;

  greetingSettingsIsDefault = true;

  constructor() {
    this.authStore = authStore;
    makeAutoObservable(this);
  }

  initSettings = async () => {
    if (this.isInit) return;
    this.isInit = true;

    const { settingsStore } = authStore;
    const { standalone } = settingsStore;

    const requests = [];
    requests.push(
      settingsStore.getPortalTimezones(),
      settingsStore.getPortalCultures(),
      this.getWhiteLabelLogoUrls(),
      this.getWhiteLabelLogoText(),
      this.getGreetingSettingsIsDefault(),
      this.getTimeoutSettings()
    );

    if (standalone) {
      requests.push(this.getDNSSettings());
    }
    return Promise.all(requests).finally(() => this.setIsLoaded(true));
  };

  setLogoUrls = (urls) => {
    this.whiteLabelLogoUrls = urls;
  };

  setLogoText = (text) => {
    this.whiteLabelLogoText = text;
  };

  restoreWhiteLabelSettings = async (isDefault) => {
    const res = await api.settings.restoreWhiteLabelSettings(isDefault);
    this.getWhiteLabelLogoUrls();
  };

  getGreetingSettingsIsDefault = async () => {
    const isDefault = await api.settings.getGreetingSettingsIsDefault();
    runInAction(() => {
      this.greetingSettingsIsDefault = isDefault;
    });
  };

  get isDefaultDNS() {
    const { customObj, defaultObj } = this.dnsSettings;
    return (
      defaultObj.dnsName === customObj.dnsName &&
      defaultObj.enable === customObj.enable
    );
  }
  get isDefaultTimeout() {
    const { customObj, defaultObj } = this.timeoutSettings;
    return (
      defaultObj.timeoutSeconds === customObj.timeoutSeconds &&
      defaultObj.enable === customObj.enable
    );
  }
  setIsEnableDNS = (value) => {
    this.dnsSettings.customObj.enable = value;
  };

  setTimeoutSeconds = (value) => {
    this.timeoutSettings.customObj.timeoutSeconds = value;
  };

  setIsEnableTimeout = (value) => {
    this.timeoutSettings.customObj.enable = value;
  };

  setDNSName = (value) => {
    this.dnsSettings.customObj.dnsName = value;
  };

  setDNSSettings = (data) => {
    this.dnsSettings = { defaultObj: data, customObj: data };
  };

  setTimeoutSettings = (data) => {
    this.timeoutSettings = { defaultObj: data, customObj: data };
  };

  getMappedDomain = async () => {
    const { settingsStore } = authStore;
    const { getPortal } = settingsStore;

    const res = await getPortal();
    const { mappedDomain } = res;

    const tempObject = {};

    tempObject.enable = !!mappedDomain;

    if (tempObject.enable) {
      tempObject.dnsName = mappedDomain;
    }

    this.setDNSSettings(tempObject);
  };
  saveDNSSettings = async () => {
    const { customObj } = this.dnsSettings;
    const { dnsName, enable } = customObj;

    await setDNSSettings(dnsName, enable);

    try {
      this.getMappedDomain();
    } catch (e) {
      toastr.error(e);
    }
  };
  saveTimeoutSettings = async () => {
    const { customObj } = this.timeoutSettings;
    const { timeoutSeconds, enable } = customObj;

    await setTimeoutSettings(timeoutSeconds, enable);
  };

  getDNSSettings = async () => {
    this.getMappedDomain();
  };

  getWhiteLabelLogoUrls = async () => {
    const res = await api.settings.getLogoUrls();
    this.setLogoUrls(Object.values(res));
  };

  getWhiteLabelLogoText = async () => {
    const res = await api.settings.getLogoText();
    this.setLogoText(res);
    return res;
  };

  getTimeoutSettings = async () => {
    console.log("XXX calling api.settings.getTimeoutSettings()");
    const ts = await api.settings.getTimeoutSettings();
    console.log("XXX TIMEOUT SETTINGS =", ts);
    this.setTimeoutSettings(ts);
    return ts;
  };

  setIsLoadedArticleBody = (isLoadedArticleBody) => {
    this.isLoadedArticleBody = isLoadedArticleBody;
  };

  setIsLoadedSectionHeader = (isLoadedSectionHeader) => {
    this.isLoadedSectionHeader = isLoadedSectionHeader;
  };

  setIsLoadedSubmenu = (isLoadedSubmenu) => {
    this.isLoadedSubmenu = isLoadedSubmenu;
  };

  setIsLoadedLngTZSettings = (isLoadedLngTZSettings) => {
    this.isLoadedLngTZSettings = isLoadedLngTZSettings;
  };

  setIsLoadedWelcomePageSettings = (isLoadedWelcomePageSettings) => {
    this.isLoadedWelcomePageSettings = isLoadedWelcomePageSettings;
  };

  setIsLoadedPortalRenaming = (isLoadedPortalRenaming) => {
    this.isLoadedPortalRenaming = isLoadedPortalRenaming;
  };

  setIsLoadedDNSSettings = (isLoadedDNSSettings) => {
    this.isLoadedDNSSettings = isLoadedDNSSettings;
  };

  setIsLoadedTimeoutSettings = (isLoadedTimeoutSettings) => {
    this.isLoadedTimeoutSettings = isLoadedTimeoutSettings;
  };

  setIsLoadedCustomization = (isLoadedCustomization) => {
    this.isLoadedCustomization = isLoadedCustomization;
  };

  setIsLoadedCustomizationNavbar = (isLoadedCustomizationNavbar) => {
    this.isLoadedCustomizationNavbar = isLoadedCustomizationNavbar;
  };

  setIsLoadedAdditionalResources = (isLoadedAdditionalResources) => {
    this.isLoadedAdditionalResources = isLoadedAdditionalResources;
  };

  setIsLoadedCompanyInfoSettingsData = (isLoadedCompanyInfoSettingsData) => {
    this.isLoadedCompanyInfoSettingsData = isLoadedCompanyInfoSettingsData;
  };

  setIsLoaded = (isLoaded) => {
    this.isLoaded = isLoaded;
  };
}

export default CommonStore;
