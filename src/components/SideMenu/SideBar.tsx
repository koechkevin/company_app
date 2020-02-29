import { BaseMenu, SideBar as AuroraSideBar, SideBarHeader } from '@aurora_app/ui-library';
import { Row } from 'antd';
import React, { FC } from 'react';

import { ChannelMenu, DirectMessageMenu, DraftMenu } from '../../pages/Messages';

import styles from './SideMenu.module.scss';

interface Props {
  menu: any[];
  name?: string;
  width?: number;
  avatarUrl?: string;
  avatarColor?: string;
  collapsed: boolean;
  isMobile?: boolean;
  location: Location;
  flatMenuKeys: string[];
  jumpTo: () => void;
  onCollapse: (collapsed: boolean) => void;
}

const SideBar: FC<Props> = (props) => {
  const {
    menu,
    name,
    width,
    jumpTo,
    avatarUrl,
    avatarColor,
    isMobile,
    collapsed,
    location,
    flatMenuKeys,
    onCollapse,
  } = props;

  const handleCollapse = () => {
    if (isMobile) {
      onCollapse(collapsed);
    } else {
      onCollapse(!collapsed);
    }
  };

  return (
    <AuroraSideBar collapsed={collapsed} width={width} className={styles.sideBar}>
      <SideBarHeader
        name={name}
        isMobile={isMobile}
        logo={avatarUrl}
        avatarColor={avatarColor}
        onCollapse={handleCollapse}
      />
      <Row className={styles.content}>
        <BaseMenu menu={menu} openKeys={[]} inlineIndent={12} location={location} flatMenuKeys={flatMenuKeys} />
        <div className={styles.jumpTo} onClick={jumpTo}>
          Jump to...
        </div>
        <DraftMenu />
        <ChannelMenu />
        <DirectMessageMenu />
      </Row>
    </AuroraSideBar>
  );
};

export default SideBar;
