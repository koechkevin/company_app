import { Button, Icon, InputCard, ListItem, TextArea } from '@aurora_app/ui-library';
import { faEnvelope, faPencil } from '@fortawesome/pro-light-svg-icons';
import { Form, Row } from 'antd';
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

const Address: FC<Props> = (props) => {
  const { company, editable, loading, form, setEditable, onSave } = props;
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
        title="Mailing Address"
        leading={<Icon icon={faEnvelope} />}
        style={{ marginBottom: 8, padding: '12px 8px' }}
        trailing={!editable && <Icon onClick={() => setEditable(true)} icon={faPencil} hover />}
      />
      {editable ? (
        <Form style={{ padding: '0 16px' }} onSubmit={onSubmit}>
          <Row>
            {getFieldDecorator('address', {
              initialValue: get(company, 'address'),
              rules: [{ max: 500, message: formatErrorMessage('Company description', ErrorType.MAX_LENGTH, 500) }],
            })(<TextArea autoSize label="Billing Address" />)}
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
        <FieldView style={{ marginBottom: 0 }} label="Billing Address" value={get(company, 'address')} />
      )}
    </InputCard>
  );
};

export default Form.create<Props>()(Address);
