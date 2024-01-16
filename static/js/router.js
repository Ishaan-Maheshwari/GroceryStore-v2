import Home from "./components/Home.js"
import Logout from "./components/Logout.js"
import AdminHome from "../modules/admin/components/admin-home.js"
import AdminAllProducts from "../modules/admin/components/all-products.js"
import AdminProductDetails from "../modules/admin/components/product-details.js"
import AdminCreateProductForm from "../modules/admin/components/product-create-form.js"
import AdminEditProductForm from "../modules/admin/components/product-edit-form.js"
import AdminAllCategories from "../modules/admin/components/all-categories.js"
import AdminAllDiscounts from "../modules/admin/components/all-discounts.js"
import AdminCategoryProducts from "../modules/admin/components/category-products.js"
import AdminCreateCategoryForm from "../modules/admin/components/category-create-form.js"
import AdminEditCategoryForm from "../modules/admin/components/category-edit-form.js"


const routes = [

    { path: '/', component: Home},
    { path: '/logout', component: Logout, props: true},

    {path: '/admin/home', component: AdminHome, props: true},
    {path: '/admin/products', component: AdminAllProducts},
    {path: '/admin/product/view/:product_id', component: AdminProductDetails, props: true},
    {path: '/admin/product/new', component: AdminCreateProductForm},
    {path: '/admin/product/edit/:product_id', component: AdminEditProductForm, props: true},

    {path: '/admin/categories', component: AdminAllCategories},
    {path: '/admin/category/new', component: AdminCreateCategoryForm},
    {path: '/admin/category/edit/:category_id', component: AdminEditCategoryForm, props: true},
    {path: '/admin/category/:category_id/products', component: AdminCategoryProducts, props: true},

    {path: '/admin/discounts', component: AdminAllDiscounts},
]

export default new VueRouter({
    routes,
})


