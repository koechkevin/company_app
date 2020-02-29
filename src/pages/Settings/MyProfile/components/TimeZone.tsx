import { Button, Icon, InputCard, ListItem, Select } from '@aurora_app/ui-library';
import { faGlobe, faPencil } from '@fortawesome/pro-light-svg-icons';
import { Form as AntForm, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { get } from 'lodash';
import moment from 'moment';
import React, { FC, useState } from 'react';

import { CompanyProfile } from '../../../../models/user';
import styles from './TimeZone.module.scss';

const { create } = AntForm;

interface Props extends FormComponentProps {
  myProfile: CompanyProfile;
  loading: boolean;
  editing: boolean;
  timezone: string;
  timezones: any[];
  onCancel: () => void;
  onSave: (data: any) => void;
  setEditing: (isEditing: boolean) => void;
}

const mapStateToProps = ({ profile: { profile, editing }, loading, global, common }: any) => ({
  myProfile: profile || {},
  editing: editing === 'timezone',
  loading: loading.effects['profile/updateCompanyUserProfile'],
  timezones: common.timezones,
});

const mapDispatchToProps = (dispatch: any) => ({
  onSave: (data: any) => dispatch({ type: 'profile/updateCompanyUserProfile', payload: data }),
  setEditing: (isEditing: boolean) =>
    dispatch({ type: 'profile/loadEditingCard', payload: isEditing ? 'timezone' : '' }),
});

const Form: FC<Props> = (props) => {
  const { form, myProfile, onSave, loading, setEditing, timezones } = props;
  const { getFieldDecorator, resetFields } = form;

  const zone = get(myProfile, 'timezone') && timezones.find((zone) => zone.zoneName === get(myProfile, 'timezone'));

  const [value, setValue] = useState(moment().utcOffset());

  const zoneNames: any[] = timezones.map((zone) => {
    return {
      value: `(UTC${zone.utcOffset}) ${zone.zoneName}`,
      utc: zone.utcOffset,
      name: zone.zoneName,
      country: zone.country,
      gmt: zone.gmtOffset,
    };
  });

  const onCancel = () => {
    resetFields();
    setEditing(false);
  };

  return (
    <AntForm id="select" className={styles.timezoneForm}>
      {getFieldDecorator('timezone', {
        initialValue: zone && `(UTC${zone.utcOffset}) ${zone.zoneName}`,
      })(
        <Select
          onSelect={(label: any, { props: { name } }: any) => setValue(name)}
          getPopupContainer={() => document.getElementById('select')}
          label="Time Zone"
          showSearch
          options={zoneNames}
        />,
      )}
      <Row type="flex">
        <Button className={styles.cancel} onClick={onCancel} ghost>
          Cancel
        </Button>
        <Button
          type="primary"
          loading={loading}
          className={styles.submit}
          onClick={() => onSave({ timezone: value, profileId: get(myProfile, 'profileId') })}
        >
          Save Changes
        </Button>
      </Row>
    </AntForm>
  );
};

const TimezoneForm = connect(mapStateToProps, mapDispatchToProps)(create<Props>()(Form));

const TimeZone: FC<Props> = (props) => {
  const { myProfile, loading, editing, setEditing, timezones } = props;

  const zone = get(myProfile, 'timezone') && timezones.find((zone) => zone.zoneName === get(myProfile, 'timezone'));

  return (
    <InputCard className={styles.inputCard}>
      <ListItem
        title="Time Zone"
        style={{ padding: '12px 8px' }}
        leading={<Icon icon={faGlobe} />}
        trailing={!editing && <Icon onClick={() => setEditing(true)} icon={faPencil} hover />}
      />
      {editing ? (
        <TimezoneForm myProfile={myProfile} loading={loading} />
      ) : (
        <ListItem className={styles.timezone} title={zone && `(UTC${zone.utcOffset}) ${zone.zoneName}`} />
      )}
    </InputCard>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeZone);
