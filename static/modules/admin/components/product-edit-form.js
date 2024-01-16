import AdminNavbar from "./AdminNavbar.js";

export default {
    name: "AdminEditProductForm",
    template:`
    <div>
        <AdminNavbar />
        <div class="container mt-2 p-2">
            <h2 class="text-primary">
                ✏ Edit product details.
            </h2>
            <hr>
            <div class="container-md px-4 text-center mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-6 p-2 border border-secondary rounded">
                        <h4 class="text-secondary">Enter details for new product</h4>
                        <hr>
                        <div class="container">
                            <form @submit.prevent="updateProduct">
                                <div class="mb-3 row">
                                    <label for="prodname" class="col-4 col-form-label">Product Name :</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="product.name" id="prodname"
                                            placeholder="Product Name">
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="proddesc" class="col-4 col-form-label">Description : </label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="product.desc" id="proddesc"
                                            placeholder="Product's detailed description">
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="prodinventory" class="col-4 col-form-label">Number : </label>
                                    <div class="col-8">
                                        <input type="Number" min="1" class="form-control" v-model="product.inventory"
                                            id="prodinventory" placeholder="that's what we'll call him here">
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="prodprice" class="col-4 col-form-label">Price : </label>
                                    <div class="col-8">
                                        <input type="number" min="0" class="form-control" v-model="product.price" id="prodprice"
                                            placeholder="that's what we'll call him here">
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="prodcategory" class="col-4 col-form-label">Select Category</label>
                                    <select class="form-select form-select-lg" v-model="product.category_id" id="prodcategory">
                                        <option v-for="cat in categories" :value="cat.id">{{cat.name}}</option>
                                    </select>
                                </div>
                                <div class="mb-3 row">
                                    <a href="#">Create new category</a>
                                </div>

                                <div class="mb-3 row">
                                    <label for="proddiscount" class="col-4 col-form-label">Select Discount</label>
                                    <select class="form-select form-select-lg" v-model="product.discount_id" id="proddiscount">
                                        <option v-for="discount in discounts" :value="discount.id">{{discount.discount_percent}}% : {{discount.name}}</option>
                                    </select>
                                </div>
                                <div class="mb-3 row">
                                    <a href="#">Create new offer</a>
                                </div>

                                <div class="mb-3 row">
                                    <label for="prodmanfdate" class="col-4 col-form-label">Manufacturing Date:</label>
                                    <div class="col-8">
                                        <input type="date" class="form-control" v-model="product.manf_date" id="prodmanfdate">
                                    </div>
                                </div>
                                
                                <div class="mb-3 row">
                                    <div class="col">
                                        <button type="submit" class="btn btn-secondary">Update Product</button>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col">
                                        <p class="text-danger" v-if="errors.length">
                                            <b>Please correct the following error(s):</b>
                                            <ul>
                                                <li v-for="error in errors">{{ error }}</li>
                                            </ul>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            product: {
                name: "",
                desc: "",
                inventory: 0,
                price: 0,
                category_id: null,
                discount_id: null,
                manf_date: null
            },
            product_id: this.$route.params.product_id,
            categories: [],
            discounts: [],
            errors : []
        }
    },
    components:{
        AdminNavbar
    },
    created(){
        this.getCategories();
        this.getDiscounts();
    },
    mounted(){
        if(!localStorage.getItem('auth-token')){
            this.$router.push({path:'/admin/login'});
        }
        this.getProduct();
    },
    methods: {
        async updateProduct(){
            const res = await fetch('api/products/'+this.product_id, {
                method: 'PUT',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.product)
            });
            const data = await res.json();
            if(res.ok){
                this.$router.push({path:'/admin/products'});
            }else{
                this.errors.push(data.message);
                console.log(data)
            }
        },
        async getCategories(){
            const res = await fetch('api/categories');
            const data = await res.json()
            if(res.ok){
                this.categories = data;
            }else{
                this.errors.push(data.message);
                console.log(data)
            }
        },
        async getDiscounts(){
            const res = await fetch('api/discounts');
            const data = await res.json()
            if(res.ok){
                this.discounts = data;
            }else{
                this.errors.push(data.message);
                console.log(data)
            }
        },
        async getProduct(){
            const res = await fetch('api/products/'+this.product_id);
            const data = await res.json()
            if(res.ok){
                this.product = data;
            }else{
                this.errors.push(data.message);
                console.log(data)
            }
        }
    },
}