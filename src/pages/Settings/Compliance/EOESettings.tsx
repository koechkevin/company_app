import { Icon, InputCard, ListItem, Switch, Text } from '@aurora_app/ui-library';
import { faShieldCheck } from '@fortawesome/pro-light-svg-icons';
import { connect } from 'dva';
import React, { FC, useEffect, useState } from 'react';

import { CompanySettings } from '../../../models/company';
import { Dispatch } from '../../../models/dispatch';

interface EOESettingsProps {
  companyId?: string;
  companySettings: CompanySettings;
  updateCompanySettings: (data: any) => void;
  fetchCompanySettings: (companyId: string) => void;
}

const EOESettings: FC<EOESettingsProps> = (props) => {
  const {
    updateCompanySettings,
    companySettings: { isEoeEnabled },
  } = props;

  const [checked, setChecked] = useState<boolean>(isEoeEnabled);

  useEffect(() => {
    setChecked(isEoeEnabled);
  }, [isEoeEnabled]);

  return (
    <InputCard style={{ paddingTop: 0 }}>
      <ListItem
        style={{ padding: '8px 0' }}
        leading={<Icon icon={faShieldCheck} />}
        title={<Text style={{ fontWeight: 'bold' }}>EOE Settings</Text>}
      />
      <ListItem
        title="Enable EEO/OFCCP Compliance"
        description="Enabling this will Always display the Voluntary EEO Survey to candidates on the job application process."
        style={{ padding: '8px 0 8px 8px' }}
        trailing={
          <Switch
            checked={checked}
            onChange={setChecked}
            onClick={(isEoeEnabled: boolean) => updateCompanySettings({ isEoeEnabled })}
            style={{ minWidth: 36 }}
          />
        }
      />
    </InputCard>
  );
};

const mapStateToProps = ({ global, settings }: any) => ({
  companyId: global.companyDetails.companyId,
  companySettings: settings.companySettings,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateCompanySettings: (data: any) => dispatch({ type: 'settings/updateCompanySettings', payload: data }),
  fetchCompanySettings: () => dispatch({ type: 'settings/fetchCompanySettings' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EOESettings);
