import Vue from 'vue';
import Vuex from 'vuex';

//import components libraries
import ElementUI from 'element-ui';
import OfficeUIFabricVue from 'office-ui-fabric-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

// import css style
import 'element-ui/lib/theme-chalk/index.css';
import 'office-ui-fabric-vue/dist/index.css';

import routerFactory from '/pages/routes';

import VueMeteorTracker from 'vue-meteor-tracker';

library.add(fas);
library.add(far);
Vue.component('font-awesome-icon', FontAwesomeIcon);


Vue.use(Vuex);
Vue.use(VueMeteorTracker);
Vue.use(ElementUI);
Vue.use(OfficeUIFabricVue);


import Layout from '/pages/ui/Layout';

import './main.html';

// const store = new Vuex.Store({
//     state: {
//         auth: '',
//         userID: '',
//     },
//     mutations: {
//         changeAuth(state, auth) {
//             state.auth = auth;
//         },
//         changeUserID(state, id) {
//             state.userID = id;
//         }
//     }
// });

Meteor.startup(() => {
    document.title = "论坛系统";
    // Start the router
    const router = routerFactory.create();
    new Vue({
        router,
        // store,
        render: h => h(Layout),
    }).$mount('#app');
});

