import { Menu } from '@aurora_app/ui-library';
import { Menu as AntdMenu } from 'antd';
import { Link } from 'dva/router';
import { get } from 'lodash';
import React, { FC } from 'react';

import { Company } from '../../models/company';
import { Routes } from '../../routes/Routes';

const { Item, Divider } = AntdMenu;

interface ProfileMenuProps {
  company: Company;
  onLogout: () => void;
  onChangePassword: () => void;
}

export const ProfileMenu: FC<ProfileMenuProps> = (props) => {
  const { company, onLogout, onChangePassword, ...restProps } = props;

  return (
    <Menu {...restProps}>
      <Item key="0">{get(company, 'name')}</Item>
      <Divider />
      <Item key="1">
        <Link to={Routes.Members}>Company Settings</Link>
      </Item>
      <Item key="2">
        <Link to={Routes.MyProfile}>My Profile</Link>
      </Item>
      <Item key="3" onClick={onChangePassword}>
        Change Password
      </Item>
      <Item key="4" onClick={onLogout}>
        Logout
      </Item>
    </Menu>
  );
};

export default ProfileMenu;
