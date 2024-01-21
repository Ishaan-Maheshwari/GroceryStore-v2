// Page is not reloading on cart item update. Need to fix this.

import Navbar from "./components/Navbar.js";
import CartItemCard from "./components/cart-item-card.js";

export default {
    name: 'CartPage',
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2 class="text-primary">
            <i class="bi bi-cart3"/> Cart
            </h2>
            <hr>
        </div>
        <div class="container px-4 py-4 mt-4" >
            <div class="row">
                <div v-if="isCartEmpty" class="alert alert-info" role="alert">
                    Your cart is empty. Please add some items to your cart.
                </div>
                    <div  v-else class="col-sm-12 col-md-6">
                        <div class="alert alert-info" role="alert">
                            <h4 class="alert-heading">Your cart contains {{ total_products }} products.</h4>
                            <p>Proceed to checkout to place your order.</p>
                            <hr>
                            <p class="mb-0">Click on the checkout button to place your order.</p>
                        </div>
                    </div>
                    <div  v-if="isCartEmpty" class="col-sm-12 col-md-4">
                        <h4 class="text-primary">Total Amount: -/- </h4>
                    </div>
                    <div  v-else class="col-sm-12 col-md-3 justify-item-center align-item-center">
                        <div class="alert alert-warning" role="alert">
                            <h4 class=" alert-heading">Total Amount</h4>
                            <hr>
                            <h5>₹ {{ total_amount }}</h5>
                            <p> for {{ total_items }} items, includind taxes and discounts. </p>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-3 justify-item-center align-item-center">
                        <div class="mb-3">
                            <label for="AddTxtArea" class="form-label fs-3 fw-bold">Address to deliver</label>
                            <textarea class="form-control" id="AddTxtArea" rows="3" v-model="address" required></textarea>
                        </div>
                        <div  v-if="isCartEmpty" class="col-sm-12 col-md-4">
                            <button type="submit" class="btn btn-success" disabled>Checkout</button>
                        </div>
                        <div  v-else class="col-sm-12 col-md-4">
                            <button type="submit" class="btn btn-success" @click="checkoutCart">Checkout</button>
                        </div>
                    </div>
                    <hr>  
            </div>
            <div v-if="isCartEmpty">
                No items in your cart.
            </div>
            <CartItemCard v-else v-for="cart_item in cart_items" :cart_item="cart_item" :key="cart_item.id" @cart-item-updated="forceRenderer" />
        </div>
    </div>
    `,
    components: {
        Navbar,
        CartItemCard
    },
    data() {
        return {
            username: null,
            user_id: null,
            cart_items: null,
            total_amount: 0,
            address: null
        }
    },
    computed : {
        total_items() {
            if (this.cart_items == null) {
                return 0;
            }
            let total = 0;
            this.cart_items.forEach(item => {
                total += item.quantity;
            });
        },
        isCartEmpty() {
            return this.total_items == 0;
        },
        total_products() {
            if (this.cart_items == null) {
                return 0;
            }
            return this.cart_items.length;
        }
    },
    mounted (){
        this.$on('cart-item-updated', data => {
            this.fetchCartItems();
          })
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        } else {
            this.username = localStorage.getItem('username');
            this.user_id = localStorage.getItem('user_id');
            this.fetchCartItems();
        }
    },
    methods: {
        forceRenderer() {
            this.fetchCartItems();
        },
        fetchCartItems() {
            fetch('/api/cart/details', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                        'Content-Type': 'application/json',
                    },
            })
                .then(response => response.json())
                .then(data => {
                    this.cart_items = data.items;
                    this.total_amount = data.total_amount;
                })
        },
        checkoutCart() {
            fetch('/api/cart/checkout', {
                method: 'POST',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    address: this.address
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 'Success') {
                        console.log(data.message);
                        alert(data.message);
                        // this.fetchCartItems();
                        this.$router.push('/orders');
                    } else {
                        console.log(data.message);
                        alert(data.message);
                    }
                })
        }
    }
}