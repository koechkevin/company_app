import { Avatar, Button, Icon, InputCard, ListItem, Menu, Modal, Text } from '@aurora_app/ui-library';
import { faPen } from '@fortawesome/pro-regular-svg-icons';
import { faCaretDown, faCaretUp } from '@fortawesome/pro-solid-svg-icons';
import { Dropdown, Menu as AntMenu, Row } from 'antd';
import { connect } from 'dva';
import { get } from 'lodash';
import React, { FC, useState } from 'react';
import { useMedia } from 'react-use';

import { Dispatch } from '../../../../models/dispatch';
import { CompanyProfile } from '../../../../models/user';
import { getInitials, resolveRoleName } from '../../../../utils/utils';

import styles from './UserDetail.module.scss';

interface Props {
  myProfile: CompanyProfile;
  showModal: () => void;
}

const EditableAvatar: FC<Props> = (props) => {
  const { myProfile } = props;

  return (
    <span className={styles.avatar}>
      <Avatar
        size={80}
        src={get(props, 'signedAvatar.signedUrl')}
        style={{ backgroundColor: get(myProfile, 'profile.avatarColor'), fontSize: 36, fontWeight: 'bold' }}
      >
        {`${getInitials(myProfile.firstname || ' ')}${getInitials(myProfile.lastname || ' ')}`}
      </Avatar>
      <Icon hover color="#979797" className={styles.icon} icon={faPen} />
    </span>
  );
};

const UserDetail: FC<Props> = (props) => {
  const { myProfile, showModal } = props;
  const additionalRoles = myProfile?.profile?.additionalRoles;

  const [dropDownVisible, setDropdownVisible] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const isMobile: boolean = useMedia('(max-width: 575px)');

  return (
    <InputCard style={{ padding: 8 }}>
      <Modal
        onOk={() => setDeleteModal(false)}
        onCancel={() => setDeleteModal(false)}
        visible={deleteModal}
        width={408}
        okText="Close"
        cancelText=" "
        title="Delete Account"
      >
        <Row style={{ textAlign: 'center' }}>
          <Text>To delete your account you will need to contact your company admin.</Text>
        </Row>
      </Modal>
      <ListItem
        className={styles.listItem}
        leading={<EditableAvatar {...props} />}
        style={{ padding: 8 }}
        description={
          <>
            <Text className={styles.email}>{myProfile.email}</Text>
            <Row className={styles.roles}>
              {myProfile?.profile?.role && (
                <span className={styles[myProfile?.profile?.role]}>{resolveRoleName(myProfile?.profile?.role)}</span>
              )}
              {additionalRoles &&
                additionalRoles?.map((role: string, index: number) => (
                  <span key={index} className={styles[role]}>
                    {resolveRoleName(role)}
                  </span>
                ))}
            </Row>
          </>
        }
        trailing={
          <Row className={styles.trailingRow}>
            <Row id="detail" type="flex" justify="space-between" className={styles.trailing}>
              <Dropdown
                trigger={['click']}
                onVisibleChange={setDropdownVisible}
                getPopupContainer={() => document.getElementById('detail') || document.body}
                overlay={
                  <Menu width={isMobile && 'calc(100vw - 64px)'}>
                    <AntMenu.Item onClick={showModal}>Reset Password</AntMenu.Item>
                    <AntMenu.Item onClick={() => setDeleteModal(true)}>Delete Account</AntMenu.Item>
                  </Menu>
                }
              >
                <Row type="flex" justify="end">
                  <Button ghost>
                    Actions{' '}
                    <Icon
                      color="#0050c8"
                      icon={dropDownVisible ? faCaretUp : faCaretDown}
                      style={{ marginRight: -8 }}
                    />
                  </Button>
                </Row>
              </Dropdown>
              <Text className={styles.lastLogin}>Last Login: Today 4:35 PM</Text>
            </Row>
          </Row>
        }
        title={<Text className={styles.name}>{`${myProfile.firstname} ${myProfile.lastname}`}</Text>}
      />
    </InputCard>
  );
};

const mapStateToProps = ({ profile: { profile } }: any) => ({
  myProfile: profile || {},
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showModal: () => dispatch({ type: 'common/showOrHideModal', modal: 'showPasswordModal', payload: true }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
