import { ListItem, Title } from '@aurora_app/ui-library';
import { Row } from 'antd';
import { connect } from 'dva';
import React, { FC } from 'react';

import { Company } from '../../../models/company';
import { Dispatch } from '../../../models/dispatch';
import { UserProfile } from '../../../models/user';
import { Address, Avatar, ContactInformation, GeneralInformation, Summary } from './components';

import styles from './CompanyProfile.module.scss';

interface Props {
  loading: boolean;
  company: Company;
  profile: UserProfile;
  showSummaryForm?: boolean;
  showGeneralForm?: boolean;
  showAddressForm?: boolean;
  showContactForm?: boolean;
  toShowEditForm: (key: string, editable: boolean) => void;
  updateCompany: (id: string, params?: object, key?: string) => void;
}

export const CompanyProfile: FC<Props> = (props) => {
  const {
    loading,
    company,
    showSummaryForm,
    showGeneralForm,
    showAddressForm,
    showContactForm,
    toShowEditForm,
    updateCompany,
  } = props;

  const onSubmit = (key: string, params: object) => {
    updateCompany(company.companyId, params, key);
  };

  return (
    <Row className={styles.profile}>
      <ListItem leading={<Title level={4}>Company Profile</Title>} />
      <Avatar company={company} />
      <Summary
        loading={loading}
        company={company}
        editable={showSummaryForm}
        onSave={(params: object) => onSubmit('showSummaryForm', params)}
        setEditable={(editable: boolean) => toShowEditForm('showSummaryForm', editable)}
      />
      <GeneralInformation
        loading={loading}
        company={company}
        editable={showGeneralForm}
        onSave={(params: object) => onSubmit('showGeneralForm', params)}
        setEditable={(editable: boolean) => toShowEditForm('showGeneralForm', editable)}
      />
      <Address
        loading={loading}
        company={company}
        editable={showAddressForm}
        onSave={(params: object) => onSubmit('showAddressForm', params)}
        setEditable={(editable: boolean) => toShowEditForm('showAddressForm', editable)}
      />
      <ContactInformation
        loading={loading}
        company={company}
        editable={showContactForm}
        onSave={(params: object) => onSubmit('showContactForm', params)}
        setEditable={(editable: boolean) => toShowEditForm('showContactForm', editable)}
      />
    </Row>
  );
};

const mapStateToProps = ({ global, loading, common }: any) => ({
  company: global.companyDetails,
  showSummaryForm: common.showSummaryForm,
  showGeneralForm: common.showGeneralForm,
  showAddressForm: common.showAddressForm,
  showContactForm: common.showContactForm,
  loading: loading.effects['settings/updateCompany'],
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateCompany: (id: string, params?: object, key?: string) => {
    dispatch({
      type: 'settings/updateCompany',
      payload: { id, key, params },
    });
  },

  toShowEditForm: (key: string, editable: boolean) => {
    dispatch({ type: 'common/showOrHideModal', modal: key, payload: editable });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProfile);
