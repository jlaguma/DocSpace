import React from "react";
import styled from "styled-components";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import { setDocumentTitle } from "@docspace/client/src/helpers/filesUtils";
import config from "PACKAGE_FILE";
import { RoomSearchArea } from "@docspace/common/constants";
import Items from "./Items";
import { isMobile, tablet } from "@docspace/components/utils/device";
import FilesFilter from "@docspace/common/api/files/filter";
import RoomsFilter from "@docspace/common/api/rooms/filter";
import { combineUrl } from "@docspace/common/utils";
import { isDesktop, isTablet, isMobileOnly } from "react-device-detect";
import Banner from "./Banner";
import { showLoader, hideLoader } from "@docspace/common/utils";
import Loaders from "@docspace/common/components/Loaders";
import withLoader from "../../../HOCs/withLoader";
import { withTranslation } from "react-i18next";
import toastr from "@docspace/components/toast/toastr";
import { getCategoryUrl } from "SRC_DIR/helpers/utils";
import { CategoryType } from "SRC_DIR/helpers/constants";

const StyledBlock = styled.div`
  padding: 0 20px;

  @media ${tablet} {
    padding: ${(props) => (props.showText ? "0 16px" : 0)};
  }
`;

const ArticleBodyContent = (props) => {
  const {
    personal,
    docSpace,
    firstLoad,
    showText,
    isDesktopClient,
    // enableThirdParty,
    isVisitor,
    FirebaseHelper,
    theme,
    toggleArticleOpen,
    categoryType,
    isAdmin,
    filesIsLoading,
    roomsFolderId,
    archiveFolderId,
  } = props;

  const [disableBadgeClick, setDisableBadgeClick] = React.useState(false);

  let loadTimeout = null;

  const campaigns = (localStorage.getItem("campaigns") || "")
    .split(",")
    .filter((campaign) => campaign.length > 0);

  const cleanTimer = () => {
    loadTimeout && clearTimeout(loadTimeout);
    loadTimeout = null;
  };

  const onClick = React.useCallback(
    (folderId) => {
      const {
        toggleArticleOpen,
        setIsLoading,
        fetchFiles,

        fetchRooms,
        setAlreadyFetchingRooms,

        homepage,
        history,
      } = props;

      if (filesIsLoading) return;
      const filesSection = window.location.pathname.indexOf("/filter") > 0;

      if (filesSection) {
        // loadTimeout = setTimeout(() => {
        setIsLoading(true);
        // }, 200);
      } else {
        showLoader();
      }

      if (folderId === roomsFolderId || folderId === archiveFolderId) {
        setAlreadyFetchingRooms(true);

        const filter = RoomsFilter.getDefault();
        filter.searchArea =
          folderId === archiveFolderId
            ? RoomSearchArea.Archive
            : RoomSearchArea.Active;

        fetchRooms(folderId, filter).finally(() => {
          if (filesSection) {
            cleanTimer();
            setIsLoading(false);
          } else {
            hideLoader();
          }
        });
      } else {
        fetchFiles(folderId, null, true, false)
          .catch((err) => toastr.error(err))
          .finally(() => {
            if (filesSection) {
              cleanTimer();
              setIsLoading(false);
            } else {
              hideLoader();
            }
          });
      }

      if (isMobileOnly || isMobile()) {
        toggleArticleOpen();
      }
    },
    [categoryType, roomsFolderId, archiveFolderId]
  );

  const onShowNewFilesPanel = React.useCallback(
    async (folderId) => {
      if (disableBadgeClick) return;

      setDisableBadgeClick(true);

      await props.setNewFilesPanelVisible(true, [`${folderId}`]);

      setDisableBadgeClick(false);
    },
    [disableBadgeClick]
  );

  return (
    <>
      <Items
        onClick={onClick}
        onBadgeClick={onShowNewFilesPanel}
        showText={showText}
        onHide={toggleArticleOpen}
      />

      {!isDesktopClient && showText && !docSpace && (
        <StyledBlock showText={showText}>
          {(isDesktop || isTablet) &&
            personal &&
            !firstLoad &&
            campaigns.length > 0 && <Banner FirebaseHelper={FirebaseHelper} />}
        </StyledBlock>
      )}
    </>
  );
};

export default inject(
  ({
    auth,
    filesStore,
    treeFoldersStore,
    selectedFolderStore,
    dialogsStore,
    settingsStore,
  }) => {
    const {
      fetchFiles,
      fetchRooms,
      setAlreadyFetchingRooms,
      setIsLoading,
      setFirstLoad,
      firstLoad,
      isLoading,
      isLoaded,
      categoryType,
      filesIsLoading,
    } = filesStore;

    const { roomsFolderId, archiveFolderId } = treeFoldersStore;

    const { setNewFilesPanelVisible } = dialogsStore;
    const isArticleLoading = (!isLoaded || isLoading) && firstLoad;
    const {
      showText,
      articleOpen,

      toggleArticleOpen,

      personal,
      docSpace,

      isDesktopClient,
      FirebaseHelper,
      theme,
    } = auth.settingsStore;

    const selectedFolderTitle = selectedFolderStore.title;

    selectedFolderTitle
      ? setDocumentTitle(selectedFolderTitle)
      : setDocumentTitle();

    return {
      toggleArticleOpen,
      showText,
      articleOpen,
      enableThirdParty: settingsStore.enableThirdParty,
      isVisitor: auth.userStore.user.isVisitor,
      isAdmin: auth.userStore.user.isAdmin,
      homepage: config.homepage,

      fetchRooms,
      setAlreadyFetchingRooms,

      personal,
      docSpace,

      isArticleLoading,
      setIsLoading,
      setFirstLoad,
      fetchFiles,

      setNewFilesPanelVisible,
      firstLoad,
      isDesktopClient,
      FirebaseHelper,
      theme,

      roomsFolderId,
      archiveFolderId,

      categoryType,
      filesIsLoading,
    };
  }
)(
  withRouter(
    withTranslation([])(
      withLoader(observer(ArticleBodyContent))(<Loaders.ArticleFolder />)
    )
  )
);
