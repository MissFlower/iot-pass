import request from "@/utils/request";
import Qs from "qs";

const headerFrom = {
  "Content-Type": "application/x-www-form-urlencoded"
};

export function getMenuList(data) {
  return request({
    url: "/menu/list",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}

export function createMenu(data) {
  return request({
    url: "/menu/create",
    method: "post",
    headers: headerFrom,
    data: Qs.stringify(data)
  });
}
