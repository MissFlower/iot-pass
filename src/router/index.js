import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout'
import LayoutI from '@/components/layout_i'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export const constantRoutes = [
  {
    path: '/',
    redirect: '/index',
    component: LayoutI,
    meta: { name: '首页' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/index'], resolve),
        meta: { name: '官网' }
      },
      {
        path: 'login',
        component: resolve => require(['@/views/login/index'], resolve),
        meta: { name: '登录' }
      },
      {
        path: 'register',
        component: resolve => require(['@/views/login/register'], resolve),
        meta: { name: '注册' }
      },
      {
        path: 'password-find',
        component: resolve => require(['@/views/login/passwordFind'], resolve),
        meta: { name: '找回密码' }
      },
      {
        path: 'add-email-tips',
        component: resolve => require(['@/views/login/addEmailTips'], resolve),
        meta: { name: '绑定邮箱提示' }
      },
      {
        path: 'verify',
        name: 'verify',
        component: resolve => require(['@/views/login/verify'], resolve),
        meta: { name: '身份验证' }
      },
      {
        path: 'success',
        name: 'success',
        component: resolve => require(['@/views/children/success'], resolve),
        meta: { name: '验证成功' }
      }
    ]
  },
  {
    path: '/introduce',
    component: Layout,
    children: [
      {
        path: 'internetOfThings',
        component: resolve => require(['@/views/introduce/introduce'], resolve)
      },
      {
        path: 'introduction',
        component: resolve =>
          require(['@/views/introduce/introduction'], resolve)
      },
      {
        path: 'equSdk',
        component: resolve => require(['@/views/introduce/equSdk'], resolve)
      },
      {
        path: 'cloudSDK',
        component: resolve => require(['@/views/introduce/cloudSDK'], resolve)
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/home',
    children: [
      {
        path: '/home',
        component: resolve => require(['@/views/Home'], resolve),
        meta: { name: '首页' }
      }
    ]
  }, {
    path: '/center',
    component: resolve => require(['@/views/user/centerIndex'], resolve),
    children: [{
      path: 'secure',
      component: resolve => require(['@/views/user/center/secure'], resolve)
    }, {
      path: 'basicInfo',
      component: resolve => require(['@/views/user/center/basicInfo'], resolve)
    }, {
      path: 'authc',
      component: resolve => require(['@/views/user/center/authc'], resolve)
    }]
  }
]
export const asyncRoutes = [
  {
    path: '/menu',
    redirect: '/menu/index',
    component: Layout,
    meta: { name: '菜单管理', code: 'menu' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/menu/index'], resolve),
        meta: { name: '菜单管理', code: 'menu' }
      }
    ]
  },
  {
    path: '/role',
    redirect: '/role/index',
    component: Layout,
    meta: { name: '角色管理', code: 'role' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/role/index'], resolve),
        meta: { name: '角色管理', code: 'role' }
      }
    ]
  },
  {
    path: '/perspective',
    redirect: '/perspective/index',
    component: Layout,
    meta: { name: '透视分析', code: 'analysis' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/Perspectives/index'], resolve),
        meta: { name: '透视分析', code: 'analysis' }
      }
    ]
  },
  {
    path: '/user',
    redirect: '/user/index',
    component: Layout,
    meta: { name: '用户管理', code: 'mgr' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/user/index'], resolve),
        meta: { name: '用户管理', code: 'mgr' }
      }
    ]
  },
  {
    path: '/product',
    redirect: '/product/index',
    component: Layout,
    meta: { name: '产品管理', code: 'product' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/product/index'], resolve),
        meta: { name: '产品管理', code: 'product' }
      },
      {
        path: 'detail/:key',
        component: resolve =>
          require(['@/views/product/children/detail'], resolve),
        meta: { name: '产品详情', code: 'product_detail' }
      },
      {
        path: 'add-product',
        component: resolve =>
          require(['@/views/product/children/addProduct'], resolve),
        meta: { name: '创建产品', code: 'add_product' }
      }
    ]
  },
  {
    path: '/model',
    redirect: '/model/index',
    component: Layout,
    meta: { name: '物模型管理', code: 'model' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/model/index'], resolve),
        meta: { name: '物模型管理', code: 'model' }
      }
    ]
  },
  {
    path: '/device',
    redirect: '/device/deviceManage',
    component: Layout,
    meta: { name: '设备管理', code: 'device' },
    children: [
      {
        path: 'deviceManage',
        component: resolve => require(['@/views/device/deviceManage'], resolve),
        meta: { name: '设备管理', code: 'device' }
      },
      {
        path: 'deviceInfo',
        component: resolve =>
          require(['@/views/device/children/deviceInfo'], resolve),
        meta: { name: '设备详情', code: 'device_detail' }
      }
    ]
  },
  {
    path: '/firmware',
    redirect: '/firmware/index',
    component: Layout,
    meta: { name: '固件管理及升级', code: 'firmware' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/firmware/index'], resolve),
        meta: { name: '固件管理', code: 'firmware' }
      },
      {
        path: 'details',
        component: resolve => require(['@/views/firmware/details'], resolve),
        meta: { name: '固件详情', code: 'fm_details' }
      },
      {
        path: 'batchDetails',
        component: resolve => require(['@/views/firmware/batchDetails'], resolve),
        meta: { name: '固件批次详情', code: 'fm_batchDetails' }
      }
    ]
  },
  {
    path: '/log',
    redirect: '/log/index',
    component: Layout,
    meta: { name: '日志管理', code: 'log' },
    children: [
      {
        path: 'index',
        component: resolve => require(['@/views/log/index'], resolve),
        meta: { name: '日志管理', code: 'log' }
      }
    ]
  }
]

export const nofund = [{
  path: '/404',
  component: LayoutI,
  children: [{
    path: '',
    component: resolve => require(['@/views/404'], resolve),
    meta: { name: '404页面' }
  }]

}, {
  path: '*',
  redirect: '/404'
}]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
