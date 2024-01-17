import Navbar from "./components/Navbar.js";
import ProductCard from "./components/product-card.js";

export default {
    name : 'CategoryProductsPage',
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2>{{ category_name }} Products</h2>
            <hr>
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
        ProductCard
    },
    data() {
        return {
            username: null,
            user_id: null,
            category_id: null,
            category_name: null,
            products: []
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        this.category_id = this.$route.params.category_id;
        this.category_name = this.$route.params.category_name;
        this.getCategoryProducts();
    },
    methods: {
        getCategoryProducts() {
            fetch(`/api/category/${this.category_id}/products`)
            .then(res => res.json())
            .then(data => {
                this.products = data.products;
            })
            .catch(err => console.log(err));
        }
    },
}