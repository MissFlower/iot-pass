import Cookies from "js-cookie";
// import api from "@/data/api"

export default {
  getValue(str) {
    return Cookies.get(str);
  },
  setValue(str, val) {
    Cookies.set(str, val);
  },
  removeValue(str) {
    Cookies.remove(str);
  }
};
