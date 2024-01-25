export default {
    name: "LowStockProductsCard",
    props : {
        products : {
            type : Array,
            required : true
        }
    },
    template: `
        <div class="card">
            <div class="card-header">
                <h4>Low Stock Products</h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover table-bordered">
                        <thead class="thead-dark">
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in products">
                                <td>{{product.id}}</td>
                                <td>{{product.name}}</td>
                                <td>{{product.quantity}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

}