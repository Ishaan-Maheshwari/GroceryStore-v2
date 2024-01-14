import Home from "./components/Home.js"
import Logout from "./components/Logout.js"


const routes = [
    { path: '/', component: Home},
    { path: '/logout', component: Logout}
]

export default new VueRouter({
    routes,
})


