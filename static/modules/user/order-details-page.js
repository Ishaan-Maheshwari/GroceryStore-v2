import Navbar from "./components/Navbar.js";
import OrderItemCard from "./components/order-item-card.js";

export default {
    name : 'OrderDetailsPage',
    template : `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2>Order Details</h2>
            <hr>
        </div>

        <div class="container px-4 py-4 mt-4">
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <div class="alert alert-warning" role="alert">
                        <p>Order ID :#  {{ order_details.id }}</p>
                        <p>Order Date : {{ order_details.date }}</p>
                        <p>Order Time : {{ order_details.time }}</p>
                        <p>Total Amount : ₹ {{ order_details.total }}</p>
                        <p>Shipping Address : {{ order_details.address }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <h3>Ordered Items</h3>
            <hr>
            <div class="row">
                <OrderItemCard v-for="item in order_items" :key="item.id" :item="item" />
            </div>
        </div>
    </div>
    `,
    components : {
        Navbar,
        OrderItemCard
    },
    data() {
        return {
            username : null,
            user_id : null,
            order_details : null,
            order_items : null,
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        this.order_id = this.$route.params.order_id;
        this.getOrderItems();
    },
    methods : {
        getOrderItems() {
            fetch(`/api/order/${this.order_id}`, {
                method : 'GET',
                headers : {
                    'Authentication-Token' : localStorage.getItem('auth-token'),
                    'Content-Type' : 'application/json'
                },
            })
            .then(res => res.json())
            .then(data => {
                if(data.status == 'Success') {
                    this.order_details = data.order_details;
                    this.order_items = data.order_details.items;
                    return;
                }
                alert(data.message); 
            })
            .catch(err => console.log(err));
        }
    },
}