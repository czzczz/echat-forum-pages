// Import the router factory
import { RouterFactory, nativeScrollBehavior } from 'meteor/akryum:vue-router2';

// Create router instance
const routerFactory = new RouterFactory({
    mode: 'history',
    scrollBehavior: nativeScrollBehavior,
});

import Index from './ui/Index';
import Login from './ui/Login';
import Layout from "./ui/Layout";
import Register from "./ui/Register";
import Mainpage from "./ui/Mainpage";
import LayoutMain from "./ui/LayoutMain";
import User from "./ui/User";
import UserSettings from "./ui/UserSettings";
import MessageEdit from "./ui/MessageEdit";

RouterFactory.configure( router => {
    router.addRoutes([
        {
            path: '/',
            component: Index,
        },
        {
            path: '/Layout',
            component: Layout,
            children: [
                {
                    path: '/login',
                    name: 'login',
                    component: Login,
                },
                {
                    path: '/register',
                    name: 'register',
                    component: Register,
                }
            ],
        },
        {
            path: '/LayoutMain',
            name: 'LayoutMain',
            component: LayoutMain,
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: Mainpage,
                },
                {
                    path: '/message-edit/:msgId',
                    component: MessageEdit,
                },
                {
                    path: '/user',
                    name: 'user',
                    component: User,
                    children: [
                        {
                            path: 'page',
                            name: 'userMain',
                            component: Mainpage,
                        },
                        {
                            path: 'page/:userId',
                            component: Mainpage,
                        },
                    ]
                }
            ]
        },
        {
            path: '/user/settings',
            name: 'userSettings',
            component: UserSettings,
        },
    ]);
});

export default routerFactory;