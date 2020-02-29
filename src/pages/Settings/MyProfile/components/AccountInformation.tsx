import { Button, Icon, Input, InputCard, ListItem, Select, Text } from '@aurora_app/ui-library';
import { faIdCard, faPen } from '@fortawesome/pro-regular-svg-icons';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { OptionProps } from 'antd/lib/select';
import { connect } from 'dva';
import { get } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

import { Dispatch } from '../../../../models/dispatch';
import { Address, CompanyProfile } from '../../../../models/user';
import { FieldView } from '../../components';
import LocationForm from './LocationForm';

import styles from './TimeZone.module.scss';

const { create } = Form;

interface AccountInformationProps extends FormComponentProps {
  myProfile: CompanyProfile;
  editing: boolean;
  locations: any[];
  setEditing: (isEditing: boolean) => void;
}

interface FormProps extends AccountInformationProps {
  loading: boolean;
  onCancel: () => void;
  onSave: (data: any) => void;
}

const mapStateToProps = ({ profile: { profile, editing }, loading, common }: any) => ({
  myProfile: profile || {},
  loading: loading.effects['profile/updateCompanyUserProfile'],
  editing: editing === 'accountInformation',
  locations: common.locations,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSave: (data: any) => dispatch({ type: 'profile/updateCompanyUserProfile', payload: data }),
  setEditing: (isEditing: boolean) =>
    dispatch({ type: 'profile/loadEditingCard', payload: isEditing ? 'accountInformation' : '' }),
});

const FormComponent: FC<FormProps> = (props) => {
  const { form, onSave, myProfile, loading, setEditing, locations } = props;
  const { getFieldDecorator, getFieldsValue, resetFields, getFieldError } = form;

  const [selectLocation, setSelectLocation] = useState<boolean>(true);

  const [locationFormValues, setLocationFormValues] = useState<Address>({
    addressLocality: '',
    addressRegion: '',
    addressCountry: '',
  });

  const options: OptionProps[] = locations.map((location: any) => ({
    value: location.locationId,
    id: location.locationId,
    name: location.name,
    style: { height: 72 },
    className: styles.selectItem,
    label: (
      <Row className={styles.label}>
        <Col>
          <Text className={styles.name}>{location.name}</Text>
        </Col>
        <Col>
          <Text className={styles.address} style={{ fontSize: 12 }}>
            {location.address?.addressLocality} {location.address?.streetAddress}
          </Text>
        </Col>
      </Row>
    ),
  }));

  const location = locations.find((loc) => loc.locationId === myProfile.locationId )

  const onCancel = () => {
    resetFields();
    setEditing(false);
  };

  const { location: locationId } = getFieldsValue();

  useEffect(() => {
    const location = locations.find((location: any) => location.locationId === locationId);
    const address = get(location, 'address');
    setLocationFormValues(address);
  }, [locationId]);

  const onSubmit = () => {
    const { code, number, location, ...restValues } = getFieldsValue();
    onSave({
      ...restValues,
      locationId: location,
      phone: { code, number },
      profileId: myProfile.profileId,
      address: locationFormValues,
    });
  };

  const locationNode = {
    label: (
      <div onClick={() => setSelectLocation(!selectLocation)} style={{ color: '#0050c8', fontWeight: 600 }}>
        Enter my location manually
      </div>
    ),
    value: 'node',
    name: 'node',
    onClick: () => setSelectLocation(!selectLocation),
    style: { borderTop: '1px solid #e4e4e4', background: 'transparent' },
  };

  const address = get(myProfile, 'address');

  return (
    <Form style={{ padding: '0 16px' }}>
      <Row gutter={8}>
        <Col sm={12}>
          {getFieldDecorator('firstname', {
            initialValue: get(myProfile, 'firstname'),
          })(<Input validateStatus={getFieldError('firstname') ? 'error' : ''} label="First Name" />)}
        </Col>
        <Col sm={12}>
          {getFieldDecorator('lastname', {
            initialValue: get(myProfile, 'lastname'),
          })(<Input validateStatus={getFieldError('lastname') ? 'error' : ''} label="Last Name" />)}
        </Col>
        <Col sm={12}>
          {getFieldDecorator('email', {
            initialValue: get(myProfile, 'email'),
          })(<Input validateStatus={getFieldError('email') ? 'error' : ''} label="Email" />)}
        </Col>
        <Col sm={12}>
          <Row type="flex" gutter={8}>
            <Col span={6}>
              {getFieldDecorator('code', {
                initialValue: get(myProfile, 'phone.code'),
              })(<Input validateStatus={getFieldError('code') ? 'error' : ''} label="Code" />)}
            </Col>
            <Col span={18}>
              {getFieldDecorator('number', {
                initialValue: get(myProfile, 'phone.number'),
              })(<Input validateStatus={getFieldError('number') ? 'error' : ''} label="Number" />)}
            </Col>
          </Row>
        </Col>
        <Col id="location" className={styles.select} sm={12}>
          {!selectLocation ? (
            <LocationForm
              onClose={() => setSelectLocation(true)}
              initialValues={address}
              onChange={setLocationFormValues}
            />
          ) : (
            getFieldDecorator('location', {
              initialValue: address && get(myProfile, 'locationId'),
            })(
              <Select
                getPopupContainer={() => document.getElementById('location')}
                label="Location"
                showSearch
                filterOption={(input: string, { props: { name } }: any) => {
                  return name?.toLowerCase().includes(input.toLowerCase()) || name === 'node';
                }}
                optionFilterProp="label"
                options={[...options, locationNode]}
              />,
            )
          )}
        </Col>
      </Row>
      <Row type="flex" style={{ marginTop: 24 }}>
        <Button className={styles.cancel} onClick={onCancel} ghost>
          Cancel
        </Button>
        <Button className={styles.submit} loading={loading} onClick={onSubmit} type="primary">
          Save Changes
        </Button>
      </Row>
    </Form>
  );
};

const AccountInformationView: FC<AccountInformationProps> = (props) => {
  const { myProfile } = props;

  const address = get(myProfile, 'address');
  const addressCountry = get(myProfile, 'address.addressCountry');
  const addressLocality = get(myProfile, 'address.addressLocality');
  const addressRegion = get(myProfile, 'address.addressRegion');

  const addressName = `${addressLocality || ''} ${addressRegion || ''}, ${addressCountry || ''}`;

  return (
    <Row gutter={8}>
      <Col sm={12}>
        <FieldView label="First Name" value={get(myProfile, 'firstname')} />
      </Col>
      <Col sm={12}>
        <FieldView label="Last Name" value={get(myProfile, 'lastname')} />
      </Col>
      <Col sm={12}>
        <FieldView label="Email" value={get(myProfile, 'email')} />
      </Col>
      <Col sm={12}>
        <FieldView label="Phone Number" value={`${get(myProfile, 'phone.code')} ${get(myProfile, 'phone.number')}`} />
      </Col>
      <Col sm={12}>
        <FieldView label="Location" value={address && addressName} />
      </Col>
    </Row>
  );
};

const AccountInformationForm = connect(mapStateToProps, mapDispatchToProps)(create<any>()(FormComponent));

const AccountInformation: FC<AccountInformationProps> = (props) => {
  const { editing, setEditing } = props;

  return (
    <InputCard style={{ marginTop: 24, padding: '8px 8px 16px' }}>
      <ListItem
        title="Account Information"
        style={{ padding: '12px 8px' }}
        leading={<Icon icon={faIdCard} />}
        trailing={!editing && <Icon onClick={() => setEditing(true)} icon={faPen} hover />}
      />
      {editing ? <AccountInformationForm /> : <AccountInformationView {...props} />}
    </InputCard>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInformation);
