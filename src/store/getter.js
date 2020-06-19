const getter = {
  collapse: state => state.collapse.collapse,
  userInfo: state => state.app.userInfo,
  loading: state => state.app.loading,
  loginStatus: state => state.app.loginStatus,
  breadcrumdList: state => state.app.breadcrumdList,
  menuLists: state => state.app.menuLists,
  functionArr: state => state.app.functionArr
};
export default getter;
