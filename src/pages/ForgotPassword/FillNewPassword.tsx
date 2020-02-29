import { connect } from 'dva';

import React, { FC } from 'react';

import { AuthPageLayout, PasswordsForm } from './components';

const ForgotPassword: FC<any> = (props) => {
  return (
    <AuthPageLayout>
      <PasswordsForm {...props} />
    </AuthPageLayout>
  );
};

export default connect(() => ({}))(ForgotPassword);
