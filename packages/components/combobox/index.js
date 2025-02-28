import PropTypes from "prop-types";
import React from "react";
import equal from "fast-deep-equal/react";

import ComboButton from "./sub-components/combo-button";
import DropDown from "../drop-down";
import DropDownItem from "../drop-down-item";
import StyledComboBox from "./styled-combobox";

class ComboBox extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      isOpen: props.opened,
      selectedOption: props.selectedOption,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const needUpdate =
      !equal(this.props, nextProps) || !equal(this.state, nextState);

    return needUpdate;
  }

  stopAction = (e) => e.preventDefault();

  setIsOpen = (isOpen) => this.setState({ isOpen: isOpen });

  handleClickOutside = (e) => {
    if (this.ref.current.contains(e.target)) return;

    this.setState({ isOpen: !this.state.isOpen }, () => {
      this.props.toggleAction && this.props.toggleAction(e, this.state.isOpen);
    });
  };

  comboBoxClick = (e) => {
    const {
      disableIconClick,
      disableItemClick,
      isDisabled,
      toggleAction,
      isLoading,
    } = this.props;

    if (
      isDisabled ||
      disableItemClick ||
      isLoading ||
      (disableIconClick && e && e.target.closest(".optionalBlock")) ||
      e?.target.classList.contains("nav-thumb-vertical")
    )
      return;

    this.setState({ isOpen: !this.state.isOpen }, () => {
      toggleAction && toggleAction(e, this.state.isOpen);
    });
  };

  optionClick = (option) => {
    this.setState({
      isOpen: !this.state.isOpen,
      selectedOption: option,
    });

    this.props.onSelect && this.props.onSelect(option);
  };

  componentDidUpdate(prevProps) {
    if (this.props.opened !== prevProps.opened) {
      this.setIsOpen(this.props.opened);
    }

    if (this.props.selectedOption !== prevProps.selectedOption) {
      this.setState({ selectedOption: this.props.selectedOption });
    }
  }

  render() {
    //console.log("ComboBox render");
    const {
      dropDownMaxHeight,
      directionX,
      directionY,
      scaled,
      size,
      options,
      advancedOptions,
      isDisabled,
      children,
      noBorder,
      scaledOptions,
      displayType,
      toggleAction,
      textOverflow,
      showDisabledItems,
      comboIcon,
      manualY,
      manualX,
      isDefaultMode,
      manualWidth,
      displaySelectedOption,
      fixedDirection,
      withBlur,
      fillIcon,
      isExternalLink,
      isPersonal,
      offsetLeft,
      modernView,
      withBackdrop,
      isAside,
      withBackground,
      advancedOptionsCount,
      isMobileView,
      withoutPadding,
      isLoading,
      isNoFixedHeightOptions,
    } = this.props;

    const { tabIndex, ...props } = this.props;

    const { isOpen, selectedOption } = this.state;

    const dropDownMaxHeightProp = dropDownMaxHeight
      ? { maxHeight: dropDownMaxHeight }
      : {};

    const dropDownManualWidthProp =
      scaledOptions && !isDefaultMode
        ? { manualWidth: "100%" }
        : scaledOptions && this.ref.current
        ? { manualWidth: this.ref.current.clientWidth + "px" }
        : { manualWidth: manualWidth };

    const optionsLength = options.length
      ? options.length
      : displayType !== "toggle"
      ? 0
      : 1;

    const withAdvancedOptions = !!advancedOptions?.props.children;

    let optionsCount = optionsLength;

    if (withAdvancedOptions) {
      const advancedOptionsWithoutSeparator = advancedOptions.props.children.filter(
        (option) => option.key !== "s1"
      );

      const advancedOptionsWithoutSeparatorLength =
        advancedOptionsWithoutSeparator.length;

      optionsCount = advancedOptionsCount
        ? advancedOptionsCount
        : advancedOptionsWithoutSeparatorLength
        ? advancedOptionsWithoutSeparatorLength
        : 6;
    }

    const disableMobileView = optionsCount < 4;

    return (
      <StyledComboBox
        ref={this.ref}
        isDisabled={isDisabled}
        scaled={scaled}
        size={size}
        data={selectedOption}
        onClick={this.comboBoxClick}
        toggleAction={toggleAction}
        isOpen={isOpen}
        disableMobileView={disableMobileView}
        withoutPadding={withoutPadding}
        {...props}
      >
        <ComboButton
          noBorder={noBorder}
          isDisabled={isDisabled}
          selectedOption={selectedOption}
          withOptions={optionsLength > 0}
          optionsLength={optionsLength}
          withAdvancedOptions={withAdvancedOptions}
          innerContainer={children}
          innerContainerClassName="optionalBlock"
          isOpen={isOpen}
          size={size}
          scaled={scaled}
          comboIcon={comboIcon}
          modernView={modernView}
          fillIcon={fillIcon}
          tabIndex={tabIndex}
          isLoading={isLoading}
        />
        {displayType !== "toggle" && (
          <DropDown
            id={this.props.dropDownId}
            className="dropdown-container not-selectable"
            directionX={directionX}
            directionY={directionY}
            manualY={manualY}
            manualX={manualX}
            open={isOpen}
            forwardedRef={this.ref}
            clickOutsideAction={this.handleClickOutside}
            style={advancedOptions && { padding: "6px 0px" }}
            {...dropDownMaxHeightProp}
            {...dropDownManualWidthProp}
            showDisabledItems={showDisabledItems}
            isDefaultMode={isDefaultMode}
            fixedDirection={fixedDirection}
            withBlur={withBlur}
            isExternalLink={isExternalLink}
            isPersonal={isPersonal}
            offsetLeft={offsetLeft}
            withBackdrop={withBackdrop}
            isAside={isAside}
            withBackground={withBackground}
            isMobileView={isMobileView && !disableMobileView}
            isNoFixedHeightOptions={isNoFixedHeightOptions}
          >
            {advancedOptions
              ? advancedOptions
              : options.map((option) => {
                  const disabled =
                    option.disabled ||
                    (!displaySelectedOption &&
                      option.label === selectedOption.label);

                  const isActive =
                    displaySelectedOption &&
                    option.label === selectedOption.label;

                  const isSelected = option.label === selectedOption.label;
                  return (
                    <DropDownItem
                      {...option}
                      textOverflow={textOverflow}
                      key={option.key}
                      disabled={disabled}
                      onClick={this.optionClick.bind(this, option)}
                      fillIcon={fillIcon}
                      isModern={noBorder}
                      isActive={isActive}
                      isSelected={isSelected}
                    />
                  );
                })}
          </DropDown>
        )}
      </StyledComboBox>
    );
  }
}

ComboBox.propTypes = {
  /** If you need display options not basic options */
  advancedOptions: PropTypes.element,
  /** Children elements */
  children: PropTypes.any,
  /** Accepts class */
  className: PropTypes.string,
  /** X direction selection */
  directionX: PropTypes.oneOf(["left", "right"]),
  /** Y direction selection */
  directionY: PropTypes.oneOf(["bottom", "top", "both"]),
  /** Component Display Type */
  displayType: PropTypes.oneOf(["default", "toggle"]),
  /** Height of Dropdown */
  dropDownMaxHeight: PropTypes.number,
  /** Display disabled items or not when displayType !== toggle */
  showDisabledItems: PropTypes.bool,
  /** Accepts id */
  id: PropTypes.string,
  /** Accepts id for dropdown container */
  dropDownId: PropTypes.string,
  /** Indicates that component will have backdrop */
  withBackdrop: PropTypes.bool,
  /** Indicates that component is disabled */
  isDisabled: PropTypes.bool,
  /** Indicates that component is displayed without borders */
  noBorder: PropTypes.bool,
  /** Will be triggered whenever an ComboBox is selected option */
  onSelect: PropTypes.func,
  /** Tells when a component is open */
  opened: PropTypes.bool,
  /** Combo box options */
  options: PropTypes.array.isRequired,
  /** Indicates that component is scaled by parent */
  scaled: PropTypes.bool,
  /** Indicates that component`s options is scaled by ComboButton */
  scaledOptions: PropTypes.bool,
  /** Selected option */
  selectedOption: PropTypes.object.isRequired,
  /** Select component width, one of default */
  size: PropTypes.oneOf(["base", "middle", "big", "huge", "content"]),
  /** Accepts css style */
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  /** The event will be raised when using `displayType: toggle` when clicking on a component */
  toggleAction: PropTypes.func,
  /** Accepts css text-overflow */
  textOverflow: PropTypes.bool,
  /** Disables clicking on the icon */
  disableIconClick: PropTypes.bool,
  /** Defines the operation mode of the component, by default with the portal */
  isDefaultMode: PropTypes.bool,
  /** Y offset */
  offsetDropDownY: PropTypes.string,
  comboIcon: PropTypes.string,
  manualY: PropTypes.string,
  manualX: PropTypes.string,
  /** Dropdown manual width */
  manualWidth: PropTypes.string,
  displaySelectedOption: PropTypes.bool,
  fixedDirection: PropTypes.bool,
  /** Disable clicking on the item */
  disableItemClick: PropTypes.bool,
  /** Indicates that component will fill selected item icon */
  fillIcon: PropTypes.bool,
  isExternalLink: PropTypes.bool,
  isPersonal: PropTypes.bool,
  offsetLeft: PropTypes.number,
  /** Tell when combo-box should displaying at modern view */
  modernView: PropTypes.bool,
  /** Count of advanced options  */
  advancedOptionsCount: PropTypes.number,
  /** Accepts css tab-index style */
  tabIndex: PropTypes.number,
  withoutPadding: PropTypes.bool,
  /** Tells when a component is loading */
  isLoading: PropTypes.bool,
};

ComboBox.defaultProps = {
  displayType: "default",
  isDisabled: false,
  noBorder: false,
  scaled: true,
  scaledOptions: false,
  size: "base",
  disableIconClick: true,
  showDisabledItems: false,
  manualY: "102%",
  isDefaultMode: true,
  manualWidth: "200px",
  displaySelectedOption: false,
  fixedDirection: false,
  disableItemClick: false,
  isExternalLink: false,
  modernView: false,
  tabIndex: -1,
  withoutPadding: false,
  isLoading: false,
};

export default ComboBox;
