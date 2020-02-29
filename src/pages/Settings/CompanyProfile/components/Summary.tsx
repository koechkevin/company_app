import { Button, Icon, InputCard, ListItem, Text, TextArea } from '@aurora_app/ui-library';
import { faBuilding, faPen } from '@fortawesome/pro-regular-svg-icons';
import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { get } from 'lodash';
import React, { FC } from 'react';

import { Company } from '../../../../models/company';
import { ErrorType } from '../../../../utils/constants';
import { formatErrorMessage } from '../../../../utils/errorHandle';

interface Props extends FormComponentProps {
  company: Company;
  loading?: boolean;
  editable?: boolean;
  onSave: (params: any) => void;
  setEditable: (editable: boolean) => void;
}

const Summary: FC<Props> = (props) => {
  const { editable, company, loading, form, setEditable, onSave } = props;
  const description = get(company, 'description');
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
    <InputCard style={{ padding: '8px 8px 16px' }}>
      <ListItem
        title="Company Summary"
        leading={<Icon icon={faBuilding} />}
        style={{ marginBottom: 8, padding: '12px 8px' }}
        trailing={!editable && <Icon onClick={() => setEditable(true)} icon={faPen} hover />}
      />
      {editable ? (
        <Form style={{ padding: '0 16px' }} onSubmit={onSubmit}>
          <Row>
            {getFieldDecorator('description', {
              initialValue: get(company, 'description'),
              rules: [{ max: 500, message: formatErrorMessage('Company description', ErrorType.MAX_LENGTH, 500) }],
            })(<TextArea autoSize maxLength={500} label="Short company description" />)}
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
        <ListItem
          title={
            <Text style={{ opacity: description ? 1 : 0.5, fontWeight: 'normal' }}>
              {description || 'Add an overview of your company.'}
            </Text>
          }
        />
      )}
    </InputCard>
  );
};

export default Form.create<Props>()(Summary);
