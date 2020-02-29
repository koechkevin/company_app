import { Action } from '../../../models/dispatch';

interface MemberState {
  inviteSent: boolean;
}

const initialState: MemberState = {
  inviteSent: false,
};

export default {
  namespace: 'members',

  state: initialState,

  effects: {},

  reducers: {
    setInviteSent: (state: MemberState, { payload }: Action): MemberState => ({ ...state, inviteSent: payload }),
  },
};
