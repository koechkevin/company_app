import { Input, Modal } from '@aurora_app/ui-library';
import { Form, Typography } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import React, { FC, useEffect } from 'react';

import { Dispatch } from '../../../../models/dispatch';
import UserRoles from './UserRoles';

import styles from './InviteUser.module.scss';

const { Text } = Typography;

interface InvitedProps {
  email: string;
}

const SentInvite: FC<InvitedProps> = (props) => {
  const { email } = props;

  return (
    <div className={styles.sentInvite}>
      <div className={styles.emailIcon}>
        <img src={process.env.PUBLIC_URL + '/images/mail.svg'} alt="Email" />
      </div>
      <Text>
        The invitation to
        <Text strong> {email} </Text>
        was sent
      </Text>
    </div>
  );
};

interface Props extends FormComponentProps {
  visible: boolean;
  inviteSent: boolean;
  onCancel: () => void;
  setInviteSent: (inviteSent: boolean) => void;
  resetRoles: () => void;
}

const InviteUser: FC<Props> = (props) => {
  const {
    visible,
    onCancel,
    inviteSent,
    setInviteSent,
    resetRoles,
    form: { getFieldDecorator, getFieldValue },
  } = props;

  useEffect(() => {
    resetRoles();
  }, [resetRoles]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      className={styles.modal}
      title="Invite to Airbus Team"
      afterClose={() => setInviteSent(false)}
      okText={inviteSent ? 'Ok, Finish' : 'Send Invite'}
      onOk={inviteSent ? onCancel : () => setInviteSent(true)}
    >
      {inviteSent ? (
        <SentInvite email={getFieldValue('emailAddress')} />
      ) : (
        <>
          <Text>
            We'll invite your new users to Airbus Team and onboard them. During signup they'll enter their full name
          </Text>
          {getFieldDecorator(
            'emailAddress',
            {},
          )(<Input label="Email Address" type="email" style={{ marginTop: 16 }} />)}
          <UserRoles />
        </>
      )}
    </Modal>
  );
};

const mapStateToProps = ({ members }: any) => ({
  inviteSent: members.inviteSent,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setInviteSent: (inviteSent: boolean) =>
    dispatch({
      type: 'members/setInviteSent',
      payload: inviteSent,
    }),
  resetRoles: () => dispatch({ type: 'members/resetRoles' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<Props>()(InviteUser));
