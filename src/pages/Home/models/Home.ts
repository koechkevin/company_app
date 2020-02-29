// Dashboard state interface
interface Dashboard {
  loading: boolean;
}

export default {
  namespace: 'Dashboard',

  state: {

  },

  effects: {

  },

  reducers: { // Redux reducers

  },

  subscriptions: {
    setup({ dispatch, history }: any) {
      return history.listen(({ pathname }: any) => {
        if (pathname === '/app/home') {

        }
      });
    },
  },
};
