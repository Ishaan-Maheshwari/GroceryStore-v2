// TODO : add to cart

export default{
    name : 'ProductCard',
    props : ['product'],
    template: `
    <div class="card col-md-4 col-lg-3 p-2 my-2 border-0">
        <div class="card-body rounded border border-secondary shadow">
            <h3 class="text-primary">{{ product.product_name}}</h3>
            <a :href="$router.resolve({path:'/category/'+product.category_id+'/products'}).href"><span><i class="bi bi-tag-fill"></i>{{product.category}}</span></a>
            <hr>
            <p>{{ product.product_desc}}</p>
            <p>₹ {{ product.price}}</p>
            <p>{{product.discount_perc}} : {{product.discount_name}}</p>
            <p v-if="isOutOfStock" class="text-danger">Out of Stock</p>
            <p v-else >{{ product.inventory}} <i> available in stock. </i></p>
            <a class="btn btn-outline-primary" :href="$router.resolve({path:'/product/'+product.product_id}).href" role="button"><i class="bi bi-info-circle-fill"></i> Info </a>
            &nbsp;&nbsp;
            <a v-if="isOutOfStock" class="btn btn-outline-danger disabled" role="button">Out of Stock</a>
            <a v-else class="btn btn-success text-white " @click="addToCart(product.product_id)" role="button">Add to Cart</a>
        </div>
    </div>
    `,
    created(){
        if(this.product.inventory == 0){
            this.isOutOfStock = true;
        }
    },
    computed:{
        product_details(){
            return this.product.product_details;
        }
    },
    methods : {
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
            }else{
                console.log(result.message);
                alert(result.message);
            }
        }
    }
}