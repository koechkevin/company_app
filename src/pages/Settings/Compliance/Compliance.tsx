import { Icon, ListItem, Text } from '@aurora_app/ui-library';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { Row } from 'antd';
import { connect } from 'dva';
import React, { FC, useEffect } from 'react';
import { useMedia } from 'react-use';

import { Dispatch } from '../../../models/dispatch';
import EOESettings from './EOESettings';

import styles from './Compliance.module.scss';

interface Props {
  companyId?: string;
  fetchCompanySettings: () => void;
}

const Compliance: FC<Props> = (props) => {
  const isMobile: boolean = useMedia('(max-width: 575px)');
  const { fetchCompanySettings, companyId } = props;

  useEffect(() => {
    if (companyId) {
      fetchCompanySettings();
    }
  }, [companyId, fetchCompanySettings]);

  return (
    <Row className={styles.compliance}>
      <ListItem
        title={
          <Text className={styles.title}>
            Compliance
          </Text>
        }
        trailing={isMobile && <Icon icon={faChevronDown} />}
        className={styles.header}
      />
      <EOESettings />
    </Row>
  );
};
const mapStateToProps = ({ global, settings }: any) => ({
  companyId: global.companyDetails.companyId,
  companySettings: settings.companySettings,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchCompanySettings: () => dispatch({ type: 'settings/fetchCompanySettings' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Compliance);
