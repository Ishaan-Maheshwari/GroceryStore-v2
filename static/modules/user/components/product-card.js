// TODO : view moew details of product
// TODO : add to cart

export default{
    name : 'ProductCard',
    props : ['product'],
    template: `
    <div class="card col-md-4 col-lg-3 p-2 my-2 border-0">
        <div class="card-body rounded border border-secondary shadow">
            <h3 class="text-primary">{{ product.product_name}}</h3>
            <span><i class="bi bi-tag-fill"></i>  {{product.category}}</span>
            <hr>
            <p>{{ product.product_desc}}</p>
            <p>₹ {{ product.price}}</p>
            <p>{{product.discount_perc}} : {{product.discount_name}}</p>
            <p>{{ product.inventory}} <i> available in stock. </i></p>
            <a class="btn btn-outline-primary" href="" role="button"><i class="bi bi-info-circle-fill"></i> Info </a>
            &nbsp;&nbsp;
            <a v-if="!isOutOfStock" class="btn btn-outline-danger disabled" @click="" role="button">Add to cart</a>
            <a v-else class="btn btn-success text-white " @click="" role="button">Add to Cart</a>
        </div>
    </div>
    `,
    data(){
        return{
            isOutOfStock : false
        }
    },
    created(){
        if(this.product.inventory == 0){
            this.isOutOfStock = true;
        }
    }
}