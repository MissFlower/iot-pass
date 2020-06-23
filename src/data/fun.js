import store from "@/store";
import router from "@/router";
import { Message } from "element-ui"

export function addBreadCrumbFun(data) {
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

// 处理菜单为tree的函数
export function dealFun(list) {
  const len = list.length;
  if (list && len > 0) {
    const obj = {};
    list.forEach(item => {
      if (!obj[item.levels]) {
        obj[item.levels] = [];
      }
      obj[item.levels].push(item);
    });
    const objKeys = Object.keys(obj);
    objKeys.reverse();
    for (let i = 0; i < objKeys.length - 1; i++) {
      const arrI = obj[objKeys[i]];
      const arrI1 = obj[objKeys[i + 1]];
      for (let j = 0; j < arrI.length; j++) {
        for (let m = 0; m < arrI1.length; m++) {
          if (arrI[j].pcode + "" === arrI1[m].code + "") {
            if (!arrI1[m].children) {
              arrI1[m].children = [];
            }
            arrI1[m].children.push(arrI[j]);
            break;
          }
        }
      }
    }
    const arr = obj[1];
    return arr;
  } else {
    return [];
  }
}

//处理角色权限tree的函数
export function dealAuthTreeFun(list) {
  let arr = [];
  if (list && list.length > 0) {
    const obj = {};
    list.forEach(item => {
      if (!obj[item.pid]) {
        obj[item.pid] = [];
      }
      obj[item.pid].push(item);
    });
    list.forEach(item => {
      if (obj[item.id]) {
        item.children = obj[item.id];
      }
    });
    arr = obj[0];
  }
  return arr;
}

//处理用户的菜单列表的函数
export function dealUserTreeFun(list) {
  let arr = [];
  if (list && list.length > 0) {
    const obj = {};
    list.forEach(item => {
      if (!obj[item.pcode]) {
        obj[item.pcode] = [];
      }
      obj[item.pcode].push(item);
    });
    list.forEach(item => {
      if (obj[item.code]) {
        item.children = obj[item.code];
      }
    });
    arr = obj[0];
  }
  return arr;
}

// 处理权限数组


export function dealMenus (menus) {
  const list = [];
  const funArr = [];
  const funList = [];
  if (menus.length > 0) {
    menus.forEach(item => {
      if (item.menuFlag === "Y") {
        item.path = item.frontPath ? item.frontPath : "/";
        list.push(item);
      } else {
        funArr.push(item.code);
        funList.push(item);
      }
    });
  }
  store.dispatch("setMenuLists", list);
  store.dispatch("setFunctionArr", funArr);
  store.dispatch("setFunctionLists", funList);
  if (list.length === 0) {
    Message.warning("用户没有菜单权限，请联系管理员");
    if (this.$route.path !== "/index") {
      router.push("/index");
    }
  }
  return {
    list,
    funArr
  }
}
