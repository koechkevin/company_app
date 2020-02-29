import { Icon, Input, InputCard, ListItem, Text } from '@aurora_app/ui-library';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { get } from 'lodash';
import React, { FC, useEffect } from 'react';

import { Address } from '../../../../models/user';

interface Props extends FormComponentProps {
  initialValues: Address;
  onChange: (fieldValues: any) => void;
  onClose: () => void;
}

const LocationForm: FC<Props> = (props) => {
  const { form, onChange, onClose, initialValues } = props;
  const { getFieldDecorator, getFieldsValue } = form;

  const { addressLocality, addressCountry, addressRegion } = getFieldsValue();

  useEffect(() => {
    onChange({
      addressLocality,
      addressCountry,
      addressRegion,
    });
  }, [addressLocality, addressCountry, addressRegion, onChange]);

  return (
    <InputCard style={{ padding: '8px 8px 0 8px', minHeight: 204 }}>
      <ListItem
        description={<Text style={{ fontSize: 16 }}>Enter your location</Text>}
        trailing={<Icon onClick={onClose} hover icon={faTimes} />}
        style={{ padding: 8 }}
      />
      <Row style={{ padding: '0, 8px' }} gutter={16}>
        <Col>
          {getFieldDecorator('addressCountry', { initialValue: get(initialValues,'addressCountry') })(
            <Input validateStatus="" label="Country" />,
          )}
        </Col>
        <Col lg={12}>
          {getFieldDecorator('addressLocality', { initialValue: get(initialValues,'addressLocality') })(
            <Input validateStatus="" label="City" />,
          )}
        </Col>
        <Col lg={12}>
          {getFieldDecorator('addressRegion', { initialValue: get(initialValues,'addressRegion') })(
            <Input validateStatus="" label="State" />,
          )}
        </Col>
      </Row>
    </InputCard>
  );
};

export default connect()(Form.create<Props>()(LocationForm));
