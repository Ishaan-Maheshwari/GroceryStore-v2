import Navbar from "./components/Navbar.js";
import productSearchBar from "./components/product-search-bar.js";
import categorySearchBar from "./components/category-search-bar.js";
import productCard from "./components/product-card.js";

export default {
    name : 'UserDashboard',
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-fluid px-4 text-center mt-4">
            <!-- <h2>User Dashbaord</h2> -->
            <h2> <i class="bi bi-shop"></i> &nbsp;&nbsp;Grocery Store</h2>
            <hr>
        </div>

        <div class="container-md px-4 text-center mt-4">
            <div class="row">
                <div class="col-md-3">
                    <productSearchBar @productsearch="searchProduct" :searchvalue="productSearchQuery" />
                </div>
                <div class="col-md-3">
                    <categorySearchBar @categorysearch="searchCategory" :searchvalue="categorySearchQuery" />
                </div>
            </div>
        </div>

        <div class="container-md px-4 mt-4">
            <h4>Latest Products Added</h4>
            <hr>
            <div class="row">
                <productCard v-for="product in latestProducts" :product="product" :key="product.id" />
            </div>
            <br>
            <br>
            <h4>Popular Products of our Store</h4>
            <hr>
            <div class="row">
                <productCard v-for="product in popularProducts" :product="product" :key="product.id" />
            </div>
            <br>
            <br>
            <h4>Products at low prices</h4>
            <hr>
            <div class="row">
                <productCard v-for="product in discountedProducts" :product="product" :key="product.id" />
            </div>

        </div>
    </div>
    `,
    components: {
        Navbar,
        productSearchBar,
        categorySearchBar,
        productCard
    },
    data() {
        return {
            username: null,
            user_id: null,
            productSearchQuery: null,
            categorySearchQuery: null,
            latestProducts: [],
            popularProducts: [],
            discountedProducts: [],
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        this.getHomepageData();
    },
    methods: {
        searchProduct(searchvalue) {
            if (searchvalue == null || searchvalue == '') {
                this.$router.push('/products');
            } else {
                this.$router.push('/products/' + searchvalue);
            }
        },
        searchCategory(searchvalue) {
            if (searchvalue == null || searchvalue == '') {
                this.$router.push('/categories');
            } else {
                this.$router.push('/categories/' + searchvalue);
            }
        },
        getHomepageData() {
            fetch('/api/user/home', {
                method: 'GET',
                headers: {
                    'Authentication-Token' : localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong');
                }
            }).then(data => {
                this.latestProducts = data.latest_products;
                this.popularProducts = data.popular_products;
                this.discountedProducts = data.discounted_products;
            }).catch(error => {
                console.log(error);
            });
        }
    }
}