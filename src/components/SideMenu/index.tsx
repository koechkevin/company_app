import { MenuItemProps } from '@aurora_app/ui-library/lib/Menu';
import { Drawer } from 'antd';
import React, { CSSProperties, useEffect } from 'react';
import { useMedia, useWindowSize } from 'react-use';

import { getFlatMenuKeys } from '../../utils/utils';
import SideBar from './SideBar';

const style: CSSProperties = {
  padding: 0,
  height: '100vh',
};

interface InternalProps {
  name?: string;
  location: any;
  avatarUrl?: string;
  loading?: boolean;
  collapsed: boolean;
  avatarColor?: string;
  menu: MenuItemProps[];
  jumpTo: () => void;
  handleCollapse: (collapsed: boolean) => void;
}

const SideMenu: React.FC<InternalProps> = (props) => {
  const { menu, collapsed, location, handleCollapse } = props;
  const isMobile = useMedia('(max-width: 575px)');
  const flatMenuKeys = getFlatMenuKeys(menu);
  const { width } = useWindowSize();

  useEffect(() => {
    if (isMobile) {
      handleCollapse(false);
    }
  }, [handleCollapse, isMobile, location]);

  if (isMobile) {
    return (
      <Drawer
        width={width}
        placement="left"
        bodyStyle={style}
        closable={false}
        visible={isMobile ? collapsed : !collapsed}
        onClose={() => handleCollapse(true)}
      >
        <SideBar
          {...props}
          width={width}
          isMobile={isMobile}
          onCollapse={handleCollapse}
          flatMenuKeys={flatMenuKeys}
          collapsed={isMobile ? false : collapsed}
        />
      </Drawer>
    );
  }

  return <SideBar {...props} onCollapse={handleCollapse} flatMenuKeys={flatMenuKeys} />;
};

export default SideMenu;
