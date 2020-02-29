import { Button, Icon, Input, InputCard, ListItem } from '@aurora_app/ui-library';
import { faListAlt, faPen } from '@fortawesome/pro-regular-svg-icons';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { get } from 'lodash';
import React, { FC } from 'react';

import { Company } from '../../../../models/company';
import { ErrorType } from '../../../../utils/constants';
import { formatErrorMessage } from '../../../../utils/errorHandle';
import { FieldView } from '../../components';

interface Props extends FormComponentProps {
  company: Company;
  loading?: boolean;
  editable?: boolean;
  onSave: (params: any) => void;
  setEditable: (editable: boolean) => void;
}

const ContactInformation: FC<Props> = (props) => {
  const { company, editable, loading, form, onSave, setEditable } = props;
  const { getFieldDecorator, validateFields } = form;

  const onSubmit = (e: any) => {
    e.preventDefault();

    validateFields((errors: any, values: any) => {
      if (!errors) {
        const { code, number, ...restProps } = values;
        onSave({
          ...restProps,
          phone: { code, number },
        });
      }
    });
  };

  return (
    <InputCard style={{ padding: '8px 8px 16px', marginTop: 24 }}>
      <ListItem
        title="General Information"
        leading={<Icon icon={faListAlt} />}
        style={{ marginBottom: 8, padding: '12px 8px' }}
        trailing={!editable && <Icon onClick={() => setEditable(true)} icon={faPen} hover />}
      />
      {editable ? (
        <Form style={{ padding: '0 16px' }} onSubmit={onSubmit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {getFieldDecorator('contactName', {
                initialValue: get(company, 'contactName'),
                rules: [{ max: 128, message: formatErrorMessage('Contact name', ErrorType.MAX_LENGTH, 128) }],
              })(<Input label="Contact Name" maxLength={128} />)}
            </Col>
            <Col xs={24} sm={12}>
              {getFieldDecorator('email', {
                initialValue: get(company, 'email'),
                rules: [{ max: 128, message: formatErrorMessage('Company email', ErrorType.MAX_LENGTH, 128) }],
              })(<Input label="Email" maxLength={128} />)}
            </Col>
            <Col xs={24} sm={12}>
              <Row type="flex" gutter={8}>
                <Col span={6}>
                  {getFieldDecorator('code', {
                    initialValue: get(company, 'phone.code', ''),
                  })(<Input label="Code" maxLength={12} />)}
                </Col>
                <Col span={18}>
                  {getFieldDecorator('number', {
                    initialValue: get(company, 'phone.number', ''),
                    rules: [{ max: 32, message: formatErrorMessage('Phone number', ErrorType.MAX_LENGTH, 32) }],
                  })(<Input label="Phone Number" maxLength={32} />)}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ margin: '8px 0' }}>
            <Button onClick={() => setEditable(false)} style={{ marginRight: 16 }} ghost>
              Cancel
            </Button>
            <Button loading={loading} onClick={onSubmit} type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Row>
        </Form>
      ) : (
        <Row>
          <Col sm={12}>
            <FieldView label="Contact Name" value={get(company, 'contactName')} />
          </Col>
          <Col sm={12}>
            <FieldView label="Email" value={get(company, 'email')} />
          </Col>
          <Col sm={12}>
            <FieldView
              label="Phone Number"
              style={{ marginBottom: 0 }}
              value={`${get(company, 'phone.code')} ${get(company, 'phone.number')}`}
            />
          </Col>
        </Row>
      )}
    </InputCard>
  );
};

export default Form.create<Props>()(ContactInformation);
