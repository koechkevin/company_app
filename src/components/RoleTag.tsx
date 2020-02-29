import React, { FC } from 'react';

import { resolveRoleName } from '../utils/utils';

import styles from './RoleTag.module.scss';

interface TagProps {
  role: string;
}

export const RoleTag: FC<TagProps> = ({ role }) => (
  <span className={`${styles.tags} ${styles[role || '']}`}>{resolveRoleName(role)}</span>
);
