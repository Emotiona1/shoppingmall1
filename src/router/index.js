import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () =>
    import ('../views/home/Home')
const Category = () =>
    import ('../views/category/Category')
const Cart = () =>
    import ('../views/cart/Cart')
const Profile = () =>
    import ('../views/profile/Profile')
const Detail = () =>
    import ('../views/detail/Detail')

//1.安装插件 
Vue.use(VueRouter)


const routes = [{
        path: '',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/category',
        component: Category
    },
    {
        path: '/cart',
        component: Cart
    },
    {
        path: '/profile',
        component: Profile
    },
    {
        path: '/detail/:iid',
        component: Detail
    },
]

let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function(location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => {}, () => {})
    }
}
VueRouter.prototype.replace = function(location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => {}, () => {})
    }
}




//2.创建router
const router = new VueRouter({
    routes,
    mode: 'history'
})




export default router