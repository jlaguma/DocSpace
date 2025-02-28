import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import Section from "@docspace/common/components/Section";
import Loaders from "@docspace/common/components/Loaders";
import { withTranslation } from "react-i18next";

import { SectionHeaderContent, SectionBodyContent } from "./Section";
//import { setDocumentTitle } from "@docspace/client/src/helpers/filesUtils";
import { inject, observer } from "mobx-react";

class PureVersionHistory extends React.Component {
  render() {
    const { isLoading, versions, showProgressBar } = this.props;

    return (
      <Section
        withBodyAutoFocus={true}
        headerBorderBottom={true}
        showSecondaryProgressBar={showProgressBar}
        secondaryProgressBarIcon="file"
        showSecondaryButtonAlert={false}
        withBodyScroll={false}
      >
        <Section.SectionHeader>
          {versions && !isLoading ? (
            <SectionHeaderContent
              title={versions[0].title}
              onClickBack={this.redirectToHomepage}
            />
          ) : (
            <Loaders.SectionHeader />
          )}
        </Section.SectionHeader>

        <Section.SectionBody>
          <SectionBodyContent />
        </Section.SectionBody>
      </Section>
    );
  }
}

const VersionHistory = withTranslation("VersionHistory")(PureVersionHistory);

VersionHistory.propTypes = {
  history: PropTypes.object.isRequired,
};

export default inject(({ auth, filesStore, versionHistoryStore }) => {
  const { filter, isLoading } = filesStore;
  const {
    setIsVerHistoryPanel,
    versions,
    showProgressBar,
  } = versionHistoryStore;

  return {
    isTabletView: auth.settingsStore.isTabletView,
    isLoading,
    filter,
    versions,
    showProgressBar,

    setIsVerHistoryPanel,
  };
})(withRouter(observer(VersionHistory)));
