// TODO : add link to categories
// TODO : add product to cart

export default{
    name:'ProductDetails',
    props : ['product'],
    template:`
    <div class="container px-4">
        <div class="row">
            <div class="col-sm-6 col-md-3 my-2">
                <img src="https://placehold.co/400x600" class="img-fluid" alt="Responsive image">
            </div>
            <div class="col-sm-6 col-md-3 my-2">
                <h3 class="text-primary">{{product.product_name}}</h3>
                <p>Category : <a href="#" >{{product.category}}</a></p>
                <p>{{product.product_desc}}</p>
                <p>Price : {{product.price}}</p>
                <p v-if="isOutOfStock" class="text-danger">Out of Stock</p>
                <p v-else>Item in Stock : {{product.inventory}}</p>
                {% endif %}
                <p>Discount : {{product_details[2].name}}<br>
                {{product.discount_perc}} % off </p>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6 col-md-3 my-2">
                <a v-if="!isOutOfStock" class="btn btn-outline-danger disabled" href="#" role="button">Out of Stock</a>
                <a v-else class="btn btn-primary text-white " href="#" role="button">Add to Cart</a>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            isOutOfStock : false
        }
    },
}
