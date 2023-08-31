import CombinedShapeSvgUrl from "PUBLIC_DIR/images/combined.shape.svg?url";
import React, { useState, useEffect, useCallback } from "react";
import { withTranslation } from "react-i18next";
import HelpButton from "@docspace/components/help-button";
import FieldContainer from "@docspace/components/field-container";
import TextInput from "@docspace/components/text-input";
import Button from "@docspace/components/button";
import { inject, observer } from "mobx-react";
import { combineUrl } from "@docspace/common/utils";
import config from "PACKAGE_FILE";
import history from "@docspace/common/history";
import { isMobileOnly } from "react-device-detect";
import { isSmallTablet } from "@docspace/components/utils/device";
import checkScrollSettingsBlock from "../utils";
import { TimeoutSettingsTooltip } from "../sub-components/common-tooltips";
import { StyledSettingsComponent, StyledScrollbar } from "./StyledSettings";
import { setDocumentTitle } from "SRC_DIR/helpers/utils";
import LoaderCustomization from "../sub-components/loaderCustomization";
import withLoading from "SRC_DIR/HOCs/withLoading";
import Badge from "@docspace/components/badge";
import toastr from "@docspace/components/toast/toastr";
import ToggleButton from "@docspace/components/toggle-button";

const toggleStyle = {
  position: "static",
};

const textInputProps = {
  id: "textInputContainerTimeoutSettings",
  className: "timeout-textarea",
  scale: true,
  tabIndex: 8,
};

const buttonProps = {
  tabIndex: 9,
  className: "save-cancel-buttons send-request-button",
  primary: true,
  size: "small",
};
let timerId = null;
const TimeoutSettings = (props) => {
  const {
    t,
    isMobileView,
    tReady,
    isLoaded,
    setIsLoadedTimeoutSettings,
    isLoadedPage,
    initSettings,
    setIsLoaded,
    isSettingPaid,
    currentColorScheme,
    standalone,
    setIsEnableTimeout,
    setTimeoutSeconds,
    saveTimeoutSettings,
    timeoutSeconds,
    enable,
    isDefaultTimeout,
  } = props;
  const [hasScroll, setHasScroll] = useState(false);
  const isLoadedSetting = isLoaded && tReady;
  const [isCustomizationView, setIsCustomizationView] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setDocumentTitle(t("TimeoutSettings"));

    if (!isLoaded) initSettings().then(() => setIsLoaded(true));

    const checkScroll = checkScrollSettingsBlock();
    checkInnerWidth();
    window.addEventListener("resize", checkInnerWidth);

    const scrollPortalName = checkScroll();

    if (scrollPortalName !== hasScroll) {
      setHasScroll(scrollPortalName);
    }

    // TODO: Remove div with height 64 and remove settings-mobile class
    const settingsMobile = document.getElementsByClassName(
      "settings-mobile"
    )[0];

    if (settingsMobile) {
      settingsMobile.style.display = "none";
    }

    return () => window.removeEventListener("resize", checkInnerWidth);
  }, []);

  useEffect(() => {
    if (isLoadedSetting) setIsLoadedTimeoutSettings(isLoadedSetting);
  }, [isLoadedSetting]);

  const onSendRequest = () => {
    window.open("https://helpdesk.onlyoffice.com/hc/en-us/requests/new");
  };

  const onSaveSettings = async () => {
    try {
      if (!timeoutSeconds?.trim()) {
        setIsError(true);
        return;
      }

      timerId = setTimeout(() => {
        setIsLoading(true);
      }, [200]);

      await saveTimeoutSettings();
      toastr.success(t("Settings:SuccessfullySaveSettingsMessage"));
    } catch (e) {
      toastr.error(e);
    }

    clearTimeout(timerId);
    timerId = null;
    setIsLoading(false);

    setIsError(false);
  };

  const onClickToggle = (e) => {
    const checked = e.currentTarget.checked;
    setIsEnableTimeout(checked);
  };

  const onChangeTextInput = (e) => {
    const { value } = e.target;
    setTimeoutSeconds(value);
  };
  const checkInnerWidth = useCallback(() => {
    if (!isSmallTablet()) {
      setIsCustomizationView(true);

      const currentUrl = window.location.href.replace(
        window.location.origin,
        ""
      );

      const newUrl = combineUrl(
        window.DocSpaceConfig?.proxy?.url,
        config.homepage,
        "/portal-settings/customization/general"
      );

      if (newUrl === currentUrl) return;

      history.push(newUrl);
    } else {
      setIsCustomizationView(false);
    }
  }, [isSmallTablet, setIsCustomizationView]);

  const tooltipTimeoutSettingsTooltip = (
    <TimeoutSettingsTooltip t={t} currentColorScheme={currentColorScheme} />
  );

  const settingsBlock = (
    <div className="settings-block">
      {standalone ? (
        <>
          <ToggleButton
            className="settings-timeout_toggle-button"
            label={t("TimeoutSettingsToggle")}
            onChange={onClickToggle}
            isChecked={enable ?? false}
            style={toggleStyle}
            isDisabled={isLoading}
          />
          <FieldContainer
            id="fieldContainerPortalRenaming"
            className="field-container-width"
            labelText={`${t("TimeoutSettingsDefaultTimeoutSeconds")}`}
            isVertical={true}
          >
            <TextInput
              tabIndex={10}
              id="textInputContainerTimerSettings"
              scale={true}
              value={timeoutSeconds}
              onChange={onChangeTextInput}
              isDisabled={isLoading || !enable}
              hasError={isError}
              placeholder={`${t("Common:EnterTimeout")}`}
            />
            {/* <div className="errorText">{errorValue}</div> */}
          </FieldContainer>
        </>
      ) : (
        <>
          <div className="settings-block-description">
            {t("DNSSettingsMobile")}
          </div>
          <FieldContainer
            id="fieldContainerDNSSettings"
            className="field-container-width settings_unavailable"
            labelText={`${t("YourCurrentDomain")}`}
            isVertical={true}
          >
            <TextInput
              {...textInputProps}
              isDisabled={true}
              value={location.hostname}
            />
          </FieldContainer>
        </>
      )}
    </div>
  );

  const buttonContainer = standalone ? (
    <Button
      {...buttonProps}
      label={t("Common:SaveButton")}
      onClick={onSaveSettings}
      isDisabled={isLoading || isDefaultTimeout}
      isLoading={isLoading}
    />
  ) : (
    <Button
      {...buttonProps}
      label={t("Common:SendRequest")}
      onClick={onSendRequest}
      isDisabled={!isSettingPaid}
    />
  );

  return !isLoadedPage ? (
    <LoaderCustomization timeoutSettings={true} />
  ) : (
    <StyledSettingsComponent
      hasScroll={hasScroll}
      className="category-item-wrapper"
      isSettingPaid={isSettingPaid}
      standalone={standalone}
    >
      {isCustomizationView && !isMobileView && (
        <div className="category-item-heading">
          <div className="category-item-title">{t("TimeoutSettings")}</div>
          <HelpButton
            offsetRight={0}
            iconName={CombinedShapeSvgUrl}
            size={12}
            tooltipContent={tooltipTimeoutSettingsTooltip}
            className="timeout-setting_helpbutton "
          />
          {!isSettingPaid && (
            <Badge
              className="paid-badge"
              backgroundColor="#EDC409"
              label={t("Common:Paid")}
              isPaidBadge={true}
            />
          )}
        </div>
      )}
      {(isMobileOnly && isSmallTablet()) || isSmallTablet() ? (
        <StyledScrollbar stype="mediumBlack">{settingsBlock}</StyledScrollbar>
      ) : (
        <> {settingsBlock}</>
      )}
      <div className="send-request-container">{buttonContainer}</div>
    </StyledSettingsComponent>
  );
};

export default inject(({ auth, common }) => {
  const { currentColorScheme, standalone } = auth.settingsStore;
  const {
    isLoaded,
    setIsLoadedTimeoutSettings,
    initSettings,
    setIsLoaded,
    timeoutSettings,
    setIsEnableTimeout,
    setTimeoutSeconds,
    saveTimeoutSettings,
    isDefaultTimeout,
  } = common;
  const { currentQuotaStore } = auth;
  const { isBrandingAndCustomizationAvailable } = currentQuotaStore;
  const { customObj } = timeoutSettings;
  const { timeoutSeconds, enable } = customObj;

  return {
    isDefaultTimeout,
    timeoutSeconds,
    enable,
    setTimeoutSeconds,
    isLoaded,
    setIsLoadedTimeoutSettings,
    initSettings,
    setIsLoaded,
    isSettingPaid: isBrandingAndCustomizationAvailable,
    currentColorScheme,
    standalone,
    setIsEnableTimeout,
    saveTimeoutSettings,
  };
})(
  withLoading(
    withTranslation(["Settings", "Common"])(observer(TimeoutSettings))
  )
);
