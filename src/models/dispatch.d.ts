import { EffectsCommandMap } from 'dva';

export interface Action {
  type: string;
  actionCode?: string;
  payload?: any;
  [extraProps: string]: any;
}

export type Dispatch = (action: Action) => any;

export type Effects = EffectsCommandMap;
