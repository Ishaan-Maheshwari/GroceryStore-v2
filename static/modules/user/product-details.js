import Navbar from "./components/Navbar.js";
import productDetailsComponent from "./components/product-details-component.js";

export default {
    name : 'ProductDetailsPage',
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2>Product Details</h2>
            <hr>
        </div>
        <productDetailsComponent :product="product" />
    </div>
    `,
    components: {
        Navbar,
        productDetailsComponent
    },
    data() {
        return {
            username: null,
            user_id: null,
            product_id: null,
            product: null,
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        this.product_id = this.$route.params.product_id;
        this.getProductDetails();
    },
    methods: {
        getProductDetails() {
            fetch(`/api/product/${this.product_id}`)
            .then(res => res.json())
            .then(data => {
                this.product = data.product;
            })
            .catch(err => console.log(err));
        }
    },
}