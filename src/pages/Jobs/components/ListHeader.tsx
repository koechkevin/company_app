import { Icon, Menu, Text } from '@aurora_app/ui-library';
import { faSort } from '@fortawesome/pro-solid-svg-icons';
import { Col, Dropdown, Menu as AntMenu, Row } from 'antd';
import React, { FC } from 'react';

import styles from './ListHeader.module.scss';

const { Item } = AntMenu;

const ListHeader: FC = () => {
  return (
    <Row className={styles.listHeader} gutter={12}>
      <Col span={10}>
        <Row type="flex" align="middle" gutter={12}>
          <Col className={styles.col} span={6}>
            <Text strong>Job ID</Text>
          </Col>

          <Dropdown
            trigger={['click']}
            overlay={
              <Menu className={styles.menu}>
                <Item className={styles.item}>Alphabetically</Item>
                <Item className={styles.item}>Recent</Item>
                <Item className={styles.item}>Older</Item>
              </Menu>
            }
          >
            <Col className={styles.col} span={18}>
              <Text strong>Job Title</Text>
              <Icon icon={faSort} />
            </Col>
          </Dropdown>
        </Row>
      </Col>

      <Col span={14}>
        <Row type="flex" align="middle" gutter={12}>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu className={styles.menu}>
                <Item className={styles.item}>Alphabetically</Item>
                <Item className={styles.item}>Recent</Item>
                <Item className={styles.item}>Older</Item>
              </Menu>
            }
          >
            <Col className={styles.col} span={6}>
              <Text strong>Location</Text>
              <Icon icon={faSort} />
            </Col>
          </Dropdown>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu className={styles.menu}>
                <Item className={styles.item}>Alphabetically</Item>
                <Item className={styles.item}>Recent</Item>
                <Item className={styles.item}>Older</Item>
              </Menu>
            }
          >
            <Col className={styles.col} span={7}>
              <Col>
                <Text strong>Job Boards</Text>
                <Icon icon={faSort} />
              </Col>
            </Col>
          </Dropdown>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu className={styles.menu}>
                <Item className={styles.item}>Alphabetically</Item>
                <Item className={styles.item}>Recent</Item>
                <Item className={styles.item}>Older</Item>
              </Menu>
            }
          >
            <Col className={styles.col} span={6}>
              <Text strong>Applicants</Text>
              <Icon icon={faSort} />
            </Col>
          </Dropdown>
          <Col className={[styles.col, styles.hiringTeam].join(' ')} span={4}>
            <Text strong>Hiring Team</Text>
          </Col>
          <Col className={styles.col} span={1} />
        </Row>
      </Col>
    </Row>
  );
};

export default ListHeader;
