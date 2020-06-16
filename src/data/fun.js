import store from "@/store";

export function addBreadCrumbFun(data) {
  console.log(data);
  const list = JSON.parse(JSON.stringify(store.state.app.breadcrumdList));
  list.push(data);
  store.dispatch("setBreadcrumb", list);
}

export function delBreadCrumbFun(index) {
  const list = JSON.parse(JSON.stringify(store.state.app.breadcrumdList));
  const len = list.length;
  if (len > 1) {
    list.splice(index, len - 1);
    store.dispatch("setBreadcrumb", list);
  }
}

// 手机号验证
export function phoneValidate(value) {
  if (!value && value === "") {
    return "手机号不能为空";
  } else {
    let reg = 11 && /^((1)\d{10})$/;
    if (!reg.test(value)) {
      return "手机格式不正确";
    } else {
      return "";
    }
  }
}
