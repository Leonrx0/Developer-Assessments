import { createRouter, createWebHistory} from "vue-router";
import Home from "@/components/Home.vue"
import Rank from "@/components/content/rank.vue";
import Default from "@/components/content/default.vue";
import login from "@/components/login.vue";
import Select from "@/components/content/userSelect.vue"
import Search from "@/components/content/search.vue";



const routes = [
    {
        path:'/',
        component:login,
        name:"login",

    },
    {
        path:'/Home',
        component:Home,
        name:"Home",
        children:[
            {
                path:'/default',
                component:Default,
                name:"mDefault",
            },
            {
                path:'/rank',
                component:Rank,
                name:"mRank",
            },
            {
                path:'/select',
                component:Select,
                name:"mSelect",
            },
            {
                path:'/search',
                component:Search,
                name:"mSearch",
            }
        ]
    },
    
]
const router = createRouter({
    history: createWebHistory(),
    // history:createWebHashHistory(),
    routes,
})
export default router;