import Navbar from "./components/Navbar.js";
import orderCard from "./components/order-card.js";

export default {
    name : 'OrderPage',
    template : `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2>Order Details</h2>
            <hr>
        </div>

        <div class="container">
            <div class="row">
                <orderCard v-for="order in orders" :key="order.id" :order="order" />
            </div>
        </div>
    </div>
    `,
    components : {
        Navbar,
        orderCard
    },
    data() {
        return {
            username : null,
            user_id : null,
            orders : []
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        this.order_id = this.$route.params.order_id;
        this.getOrders();
    },
    methods : {
        getOrders() {
            fetch(`/api/user/orders`, {
                method : 'GET',
                headers : {
                    'Authentication-Token' : localStorage.getItem('auth-token'),
                    'Content-Type' : 'application/json'
                },
            })
            .then(res => res.json())
            .then(data => {
                this.orders = data.orders;
            })
            .catch(err => console.log(err));
        }
    },
}