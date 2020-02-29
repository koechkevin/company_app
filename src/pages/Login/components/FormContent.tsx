import { Button, Input, Paragraph } from '@aurora_app/ui-library';
import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Link } from 'dva/router';
import React, { FC, FormEvent, useEffect, useState } from 'react';

import { BasicAuth } from '../../../models/user';
import { Routes } from '../../../routes/Routes';

import styles from './FormContent.module.scss';

interface Props extends FormComponentProps {
  loading: boolean;
  login: (props: BasicAuth) => void;
  authCredentials: { match: boolean; error: string };
}

export const FormContent: FC<Props> = (props) => {
  const { form, login, authCredentials, loading } = props;
  const { getFieldDecorator, getFieldsValue, validateFields } = form;
  const [state, setState] = useState({
    formError: '',
    formValid: true,
    fieldsValid: false,
  });

  useEffect(() => {
    if (!authCredentials.match) {
      setState((state) => ({ ...state, formValid: false, formError: authCredentials.error }));
    }
  }, [authCredentials]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    validateFields((errors, values: BasicAuth) => {
      if (!errors) {
        login(values);
      }
    });
  };

  const handleChange = () => {
    setState({ ...state, formValid: true });
  };

  const checkFormValues = () => {
    const data = getFieldsValue();
    if (data.username && data.password) {
      setState({ ...state, fieldsValid: true });
    } else {
      setState({ ...state, fieldsValid: false });
    }
  };

  return (
    <Form className={styles.formContent} onSubmit={onSubmit} hideRequiredMark>
      <div style={{ height: '70px' }}>
        {getFieldDecorator('username')(
          <Input
            autoFocus
            label="Email"
            autoComplete="username"
            onChange={handleChange}
            onKeyUp={checkFormValues}
            validateStatus={!state.formValid ? 'error' : ''}
          />,
        )}
      </div>
      <div style={{ height: '90px' }}>
        {getFieldDecorator('password')(
          <Input
            password
            label="Password"
            onChange={handleChange}
            onKeyUp={checkFormValues}
            autoComplete="new-password"
            validateStatus={!state.formValid ? 'error' : ''}
            help={!state.formValid ? state.formError : ''}
          />,
        )}
      </div>
      <Row>
        <Paragraph>
          <Link to={Routes.ForgotPassword}>Forgot your password?</Link>
        </Paragraph>
      </Row>
      <Form.Item>
        <Button
          block
          type="primary"
          size="large"
          htmlType="submit"
          className={styles.loginBtn}
          loading={loading}
          disabled={!state.fieldsValid || !state.formValid}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

const CreatedForm = Form.create<Props>()(FormContent);

export default CreatedForm;
