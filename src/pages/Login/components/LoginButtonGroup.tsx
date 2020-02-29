import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row } from 'antd';
import React from 'react';

import styles from '../LoginButtonGroup.module.scss';

const googleIcon = `${process.env.PUBLIC_URL}/images/icons/google-logo.svg`;
const officeIcon = `${process.env.PUBLIC_URL}/images/icons/office-logo.svg`;

const LoginButtonGroup: React.FC = () => {
  return (
    <Row gutter={8} className={styles.buttonGroup}>
      <Col span={8}>
        <Button block type="primary" shape="round" style={{ color: '#757575', background: '#fff' }}>
          <img src={googleIcon} alt="Google" />
          <span>Google</span>
        </Button>
      </Col>
      <Col span={8}>
        <Button block type="primary" shape="round" style={{ background: '#ea3e23' }}>
          <img src={officeIcon} alt="Office365" />
          <span>Office365</span>
        </Button>
      </Col>
      <Col span={8}>
        <Button block type="primary" shape="round" style={{ background: '#0077b5' }}>
          <FontAwesomeIcon icon={faLinkedinIn} />
          <span>Linkedin</span>
        </Button>
      </Col>
    </Row>
  );
};

export default LoginButtonGroup;
