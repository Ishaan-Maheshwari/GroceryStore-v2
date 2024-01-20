export default{
    name: 'OrderItemCard',
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    template : `
    <div class="card mx-1 my-2 w-100" :key="item.id">
        <div class="row g-0">
            <div class="col-2">
            <img src="static/modules/user/components/assets/img/Grocery-art.png" class="img-fluid rounded-start" alt="...">
            </div>
            <!-- Second column for cart-item details -->
            <div class="col-6">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">
                        {{ item.desc }}<br>
                        Price: ₹ {{ item.sell_price }}<br>
                    </p>
                </div>
            </div>
            <!-- Third column for total price -->
            <div class="col-4">
                <div class="card-body">
                    <p class="card-text"><b>Quantity</b> : {{ item.quantity }}</p>
                    <h5 class="card-title">Total Price</h5>
                    <p class="card-text"> ₹ {{ total_price }}</p>
                </div>
            </div>

        </div>
    </div>
    `,
    computed() {
        return {
            total_price() {
                return this.item.sell_price * this.item.quantity;
            }
        }
    }
}