// TODO : add link to categories
// TODO : add product to cart

export default{
    name:'ProductDetails',
    props : ['product'],
    template:`
    <div class="container px-4">
        <div class="row">
            <div class="col-sm-4 col-md-3 my-2">
                <img src="https://placehold.co/400x600" class="img-fluid" alt="Responsive image">
            </div>
            <div class="col-sm-8 col-md-6 my-2">
                <h3 class="text-primary">{{product.product_name}}</h3>
                <p>Category : <a :href="$router.resolve({path:'/category/'+product.category_id+'/products'}).href" >{{product.category}}</a></p>
                <p>{{product.product_desc}}</p>
                <p>Price : {{product.price}}</p>
                <p>Discount : {{product.discount_perc}} % off &nbsp; {{product.discount_name}}</p>
                <p v-if="isOutOfStock" class="text-danger">Out of Stock</p>
                <p v-else>{{product.inventory}} available in stock.</p>
                <div class="row">
                    <div class="col-sm-6 col-md-3 my-2">
                        <a v-if="isOutOfStock" class="btn btn-outline-danger disabled" href="#" role="button">Out of Stock</a>
                        <a v-else class="btn btn-success text-white " @click="addToCart(product.product_id)" role="button">Add to Cart</a>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    `,
    computed:{
        isOutOfStock(){
            return this.product.inventory == 0;
        }
    },
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
            }else{
                console.log(result.message);
                alert(result.message);
            }
        }
    }
}
