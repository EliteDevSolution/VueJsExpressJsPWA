/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Author: EliteDevSolution
==========================================================================================*/

import Vue from 'vue'
import Router from 'vue-router'
import Auth from './middleware/Auth'
// Multi translation
import i18n from '@/plugins/i18n'
import store from '@/store/store'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [

        {
        // =============================================================================
        // MAIN LAYOUT ROUTES
        // =============================================================================
            path: '',
            component: () => import('./layouts/main/Main.vue'),
            children: [
              {
                path: '/',
                name: 'home',
                meta: {
                  middleware: Auth,
                },
                component: () => import('./views/Home.vue')
              },
              {
                path: '/my_data',
                meta: {
                  middleware: Auth,
                  breadcrumb: [
                    { title: i18n.t('home.title'), url: '/' },
                    { title: i18n.t('my_data.title'), active: true }
                  ],
                },
                component: () => import('@/views/pages/my-data/MyData.vue')
              },
              {
                path: '/campaigns',
                name: 'Campaigns',
                meta: {
                  middleware: Auth,
                  breadcrumb: [
                    { title: i18n.t('home.title'), url: '/' },
                    { title: i18n.t('campaigns.title'), active: true }
                  ],
                },
                component: () => import('./views/Page2.vue')
              },
              {
                path: '/users',
                name: 'Users',
                meta: {
                  middleware: Auth,
                  permission: ["SuperAdmin"],
                  breadcrumb: [
                    { title: i18n.t('home.title'), url: '/' },
                    { title: i18n.t('users.title'), active: true }
                  ],
                },
                component: () => import('./views/pages/users/Users.vue')
              },
              {
                path: '/users/add',
                name: 'users-add',
                meta: {
                  middleware: Auth,
                  breadcrumb: [
                    { title: i18n.t('home.title'), url: '/' },
                    { title: i18n.t('users.title'), url: '/users' },
                    { title: i18n.t('users.add_user.title'), active: true }
                  ],
                  permission: ["SuperAdmin"],
                },
                component: () => import('./views/pages/users/Add.vue')
              },
              {
                path: '/users/edit:user',
                name: 'users-edit',
                meta: {
                  middleware: Auth,
                  breadcrumb: [
                    { title: i18n.t('home.title'), url: '/' },
                    { title: i18n.t('users.title'), url: '/users' },
                    { title: i18n.t('users.update_user.title'), active: true }
                  ],
                  permission: ["SuperAdmin"],
                },
                component: () => import('./views/pages/users/Edit.vue')
              },
            ],
        },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
        {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
        // =============================================================================
        // PAGES
        // =============================================================================
              {
                path: '/login',
                name: 'login',
                meta: {},
                component: () => import('@/views/pages/auth/Login.vue')
              },
              {
                path: '/register',
                name: 'register',
                meta: {},
                component: () => import('@/views/pages/auth/Register.vue')
              },
              {
                path: '/error-404',
                name: 'error-404',
                meta: {},
                component: () => import('@/views/pages/Error404.vue')
              },
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/error-404'
        }
    ],
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = "none";
  }
})
// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;
  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Than run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const loggedIn = localStorage.getItem('userInfo');
    if(loggedIn)
    {
      if(to.name !== 'error-404' && Array.isArray(to.meta.permission) && to.meta.permission.length > 0 && !store.state.AppActiveUser.roles.some( ele => to.meta.permission.includes(ele) ))
        return next('/');
    }
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];
    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);
    return middleware[0]({ ...context, next: nextMiddleware });
  } else
  {
    const loggedIn = localStorage.getItem('userInfo');
    if(loggedIn)
    {
      if(to.name !== 'error-404')
        return next('/');
    }
  }
  return next();
})

export default router
