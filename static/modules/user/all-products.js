import Navbar from "./components/Navbar.js";
import ProductCard from "./components/product-card.js";
import ProductSearchBar from "./components/product-search-bar.js";

export default {
    name : 'AllProductsPage',
    props : ['like'],
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2 v-if="productquery == null">All Products</h2>
            <h2 v-else>Seach Results for : {{productquery}}</h2>
            <hr>
        </div>
        <div class="container-md px-4">
            <div class="row">
                <div class="col-md-3">
                    <ProductSearchBar @productsearch="searchProduct" :searchvalue="productquery" />
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <ProductCard v-for="product in products" :key="product.product_id" :product="product" />
            </div>
        </div>
    </div>
    `,
    components: {
        Navbar,
        ProductCard,
        ProductSearchBar,
    },
    data() {
        return {
            username: null,
            user_id: null,
            products: [],
            productquery: null,
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        if (this.like == '' || this.like == null) {
            this.getAllProducts();
        }else{
            this.productquery = this.like;
            this.searchProduct(this.like);
        }
    },
    methods: {
        getAllProducts() {
            fetch('/api/all_products')
            .then(res => res.json())
            .then(data => {
                this.products = data.products;
            })
            .catch(err => console.log(err));
        },
        searchProduct(searchvalue) {
            if (searchvalue == null || searchvalue == '') {
                this.getAllProducts();
            } else {
                fetch('/api/search/products/'+ searchvalue, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.products = data.products;
                    this.productquery = searchvalue;
                })
                .catch(err => console.log(err));
            }
        },
    },
}