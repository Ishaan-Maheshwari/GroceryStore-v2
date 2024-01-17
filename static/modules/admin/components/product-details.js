import AdminNavbar from "./AdminNavbar.js";

export default {
    name: "AdminProductDetails",
    template:`
    <div>
        <AdminNavbar />
        <div class="container-md px-4 text-center mt-4">
            <h2>{{product.product_name}}</h2>
            <hr>
        </div>
        <div class="container px-4">
            <div class="row">
                <div class="col-sm-6 col-md-3 my-2">
                    <a class="btn btn-primary text-white " href="#" @click="editProduct(product_id)" role="button">✏ Edit this Product</a>
                </div>
                <div class="col-sm-6 col-md-3 my-2">
                <a class="btn btn-secondary text-white" href="#" @click="deleteProduct(product_id)" role="button">❌ Delete this Product</a>
                </div>
                <div class="col-sm-12 col-md-6 my-2 text-right">
                    <a class="btn btn-link" href="#" @click="viewAllProducts" role="button">⬅ Go Back to Products</a>
                </div>
            </div>
        </div>
        <div class="container px-4">
            <div class="row">
                <div class="col-sm-6 col-md-3 my-2">
                    <img src="https://placehold.co/400x600" class="img-fluid" alt="Responsive image">
                </div>
                <div class="col-sm-6 col-md-3 my-2">
                    <h3 class="text-primary">{{product.product_name}}</h3>
                    <p>Category : <a href="#" @click="viewCategory(product.category_id)" >{{product.category}}</a></p>
                    <p>{{product.product_desc}}</p>
                    <p>Price : {{product.price}}</p>
                    <p v-if="isProductOutofStock">Out of Stock</p>
                    <p v-else>Item in Stock : {{product.inventory}}</p>
                    <p>Discount : {{product.discount_name}}<br>
                    {{product.discount_perc}} % off </p>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6 col-md-3 my-2">
                    <a v-else class="btn btn-outline-danger disabled" href="#" role="button">Out of Stock</a>
                    <a v-if="isProductOutofStock" class="btn btn-primary text-white " href="#" role="button">Add to Cart</a>
                </div>
            </div>
        </div>
    </div>
        `,
    data() {
        return {
            product : null,
            product_loaded: false,
            product_id: this.$route.params.product_id,
            errors: [],
        };
    },
    components: {
        AdminNavbar,
    },
    created() {
        this.get_product_details();
    },
    computed: {
        isProductOutofStock() {
            return this.product.inventory == 0;
        }
    },
    methods : {
        async get_product_details() {
            const res = await fetch('api/product/'+this.product_id);
            const data = await res.json();
            if(res.ok){
                this.product = data.product;
                this.product_loaded = true;
            }else{
                this.errors.push(data.message);
            }
        },
        viewCategory(cat_id){
            this.$router.push({path:'/admin/category/'+cat_id+'/products', params:{category_id: cat_id}});
        },
        viewAllProducts(){
            this.$router.push({path:'/admin/products'});
        },
        editProduct(product_id){
            this.$router.push({path:'/admin/product/edit/'+product_id, params:{product_id: product_id}});
        },
        async deleteProduct(product_id){
            if(!confirm("Are you sure you want to delete this product?")) return;
            const res = await fetch('api/products/'+product_id,
            {
                method:'DELETE',
                headers:{
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json()
            if(res.ok){
                console.log(data)
                this.$router.push({path:'/admin/products'});
            }else{
                console.log(data);
                this.errors.push(data.message);
            }
        }
    }
}