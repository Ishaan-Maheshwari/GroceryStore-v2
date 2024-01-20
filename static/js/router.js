import Home from "./components/Home.js"
import Logout from "./components/Logout.js"

import AdminHome from "../modules/admin/components/admin-home.js"
import AdminAllProducts from "../modules/admin/components/all-products.js"
import AdminProductDetails from "../modules/admin/components/product-details.js"
import AdminCreateProductForm from "../modules/admin/components/product-create-form.js"
import AdminEditProductForm from "../modules/admin/components/product-edit-form.js"
import AdminAllCategories from "../modules/admin/components/all-categories.js"
import AdminCategoryProducts from "../modules/admin/components/category-products.js"
import AdminCreateCategoryForm from "../modules/admin/components/category-create-form.js"
import AdminEditCategoryForm from "../modules/admin/components/category-edit-form.js"
import AdminAllDiscounts from "../modules/admin/components/all-discounts.js"
import AdminCreateDiscountForm from "../modules/admin/components/discount-create-form.js"
import AdminEditDiscountForm from "../modules/admin/components/discount-edit-form.js"

import UserDashboard from "../modules/user/user-dashboard.js"   
import AllProductsPage from "../modules/user/all-products.js"
import ProductDetailsPage from "../modules/user/product-details.js"
import AllCategoriesPage from "../modules/user/all-categories.js"
import CategoryProductsPage from "../modules/user/category-products.js"
import UserProfilePage from "../modules/user/profile-page.js"
import CartPage from "../modules/user/cart-page.js"
import OrderPage from "../modules/user/order-page.js"
import OrderDetailsPage from "../modules/user/order-details-page.js"


const routes = [

    { path: '/', component: Home},
    { path: '/logout', component: Logout},

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
    {path: '/admin/discounts/new', component: AdminCreateDiscountForm},
    {path: '/admin/discounts/edit/:discount_id', component: AdminEditDiscountForm, props: true},

    {path: '/dashboard', component: UserDashboard},
    {path: '/products', component: AllProductsPage, props: true},
    {path: '/products/:like', component: AllProductsPage, props: true},
    {path: '/product/:product_id', component: ProductDetailsPage, props: true},
    {path: '/categories', component: AllCategoriesPage, props: true},
    {path: '/categories/:like', component: AllCategoriesPage, props: true},
    {path: '/category/:category_id/products', component: CategoryProductsPage, props: true},
    {path: '/profile', component: UserProfilePage},
    {path: '/cart', component: CartPage},
    {path: '/myorders', component: OrderPage},
    {path: '/myorder/:order_id', component: OrderDetailsPage, props: true},
]

export default new VueRouter({
    routes,
})


