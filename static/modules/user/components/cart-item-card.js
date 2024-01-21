export default{
    name:'CartItemCard',
    props:['cart_item'],
    template:`
    <div class="card mx-1 my-2" :key="cart_item.id">
        <div class="row g-0">
            <div class="col-2">
            <img src="static/modules/user/components/assets/img/Grocery-art.png" class="img-fluid rounded-start" alt="...">
            </div>
            <!-- Second column for cart-item details -->
            <div class="col-6">
                <div class="card-body">
                    <h5 class="card-title">{{ cart_item.product_name }}</h5>
                    <p class="card-text">
                        {{ cart_item.product_description }}<br>
                        Price: ₹ {{ cart_item.price }}<br>
                        <small class="text-muted">Discount Applied : {{ cart_item.discount_percent }} % off</small><br>
                        Discounted Price: ₹ {{ cart_item.discounted_price }}
                    </p>
                </div>
            </div>
            <!-- Third column for total price -->
            <div class="col-2">
                <div class="card-body">
                    <p class="card-text"><b>Quantity</b> : {{ cart_item.quantity }}</p>
                    <h5 class="card-title">Total Price</h5>
                    <p class="card-text"> ₹ {{ cart_item.total_price }}</p>
                </div>
            </div>

            <!-- Fourth column for action buttons -->
            <div class="col-2">
                <div class="card-body">
                    <div class="list-group">
                    <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-center">
                        <button class="btn btn-outline-success" @click="addToCart(cart_item.product_id)"><i class="bi bi-plus-circle-fill"></i></button>
                        &nbsp;
                        <button class="btn btn-outline-secondary" @click="RemoveFromCart(cart_item.id,false)" ><i class="bi bi-dash-circle-fill"></i></button>
                        </div>
                    </div>
                    <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-center">
                        <button class="btn btn-outline-danger" @click="RemoveFromCart(cart_item.id,true)" ><i class="bi bi-trash-fill"></i></button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `,
    methods:{
        async addToCart(product_id){
            let response = await fetch('/api/cart/add',{
                method:'POST',
                headers:{
                    'Authentication-Token':localStorage.getItem('auth-token'),
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    product_id:product_id
                })
            });
            let result = await response.json();
            if(result.status == 'Success'){
                console.log(result.message);
                alert(result.message);
                this.$emit('cart-item-updated');
            }else{
                console.log(result.message);
                alert(result.message);
            }
        },
        async RemoveFromCart(cart_item_id,all=false){
            var api_endpoint = '/api/cart/reduce';
            if (all){
                api_endpoint = '/api/cart/remove';
            }
            let response = await fetch(api_endpoint ,{
                method:'POST',
                headers:{
                    'Authentication-Token':localStorage.getItem('auth-token'),
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    cart_item_id:cart_item_id
                })
            });
            let result = await response.json();
            if(result.status == 'Success'){
                console.log(result.message);
                alert(result.message);
                this.$emit('cart-item-updated');
            }else{
                console.log(result.message);
                alert(result.message);
            }
        }
    }

}