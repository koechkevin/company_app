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
  setEditable: (visible: boolean) => void;
}

const GeneralInformation: FC<Props> = (props) => {
  const { company, loading, editable, setEditable, form, onSave } = props;
  const { getFieldDecorator, validateFields } = form;

  const onSubmit = (e: any) => {
    e.preventDefault();

    validateFields((errors: any, values: any) => {
      if (!errors) {
        onSave(values);
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
              {getFieldDecorator('name', {
                initialValue: get(company, 'name'),
                rules: [{ max: 128, message: formatErrorMessage('Company name', ErrorType.MAX_LENGTH, 128) }],
              })(<Input label="Company Name" maxLength={128} />)}
            </Col>
            <Col xs={24} sm={12}>
              {getFieldDecorator('contactName', {
                initialValue: get(company, 'contactName'),
                rules: [{ max: 128, message: formatErrorMessage('Company legal name', ErrorType.MAX_LENGTH, 128) }],
              })(<Input label="Company Legal Name" maxLength={128} />)}
            </Col>
            <Col xs={24} sm={12}>
              {getFieldDecorator('website', {
                initialValue: get(company, 'website'),
                rules: [{ max: 128, message: formatErrorMessage('Company website', ErrorType.MAX_LENGTH, 128) }],
              })(<Input label="Company Website" maxLength={128} />)}
            </Col>
            <Col xs={24} sm={12}>
              {getFieldDecorator('auroraUrl', {
                initialValue: get(company, 'auroraUrl'),
                rules: [{ max: 64, message: formatErrorMessage('Aurora URL', ErrorType.MAX_LENGTH, 64) }],
              })(<Input label="Aurora URL" maxLength={64} />)}
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
            <FieldView label="Company Name" value={get(company, 'name')} />
          </Col>
          <Col sm={12}>
            <FieldView label="Company Legal Name" value={get(company, 'contactName')} />
          </Col>
          <Col sm={12}>
            <FieldView label="Company ID" value={get(company, 'companyId')} />
          </Col>
          <Col sm={12}>
            <FieldView label="Company Website" value={get(company, 'website')} />
          </Col>
          <Col sm={12}>
            <FieldView style={{ marginBottom: 0 }} label="Aurora URL" value={get(company, 'auroraUrl')} />
          </Col>
        </Row>
      )}
    </InputCard>
  );
};

export default Form.create<Props>()(GeneralInformation);
