import { Menu } from '@aurora_app/ui-library';
import { Menu as AntdMenu } from 'antd';
import { Link } from 'dva/router';
import React, { FC } from 'react';

const { Item } = AntdMenu;

interface Props {
  profileId: string;
}

export const MoreMenu: FC<Props> = (props) => {
  const { profileId, ...restProps } = props;

  return (
    <Menu {...restProps}>
      <Item>
        <Link to={`members/profile/${profileId}`}>User Profile</Link>
      </Item>
      <Item>Jobs List</Item>
      <Item>Activity Log</Item>
      <Item>Login History</Item>
      <Item>Reset Password</Item>
      <Item>Revoke User Access</Item>
    </Menu>
  );
};

export default MoreMenu;
