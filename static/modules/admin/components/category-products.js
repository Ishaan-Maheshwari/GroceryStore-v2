import AdminNavbar from './AdminNavbar.js'

export default{
    name:'AdminCategoryProducts',
    prop:['category_id'],
    template:`
    <div>
        <AdminNavbar/>
        <div class="container-fluid mt-2">
            <div class="row">
                <div class="col-md-12">
                    <div class="jumbotron">
                        <h1 class="display-4">Welcome to {{ cat_name }} Category</h1>
                        <p class="lead">{{ cat_desc }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="container px-4">
            <div class="row">
                <a class="btn btn-primary text-white" role="button">➕ Add New Product</a>
            </div>
        </div>
        <br>
        <div class="container">
            <div class="row">

                <div class="card col-md-4 col-lg-3 mx-2 my-2 border-secondary shadow" v-for="product in products">
                    <!-- <img class="card-img-top" src="holder.js/100x180/" alt=""> -->

                    <div class="card-body">
                        <h3 class="text-primary">{{ product.product_name}}</h3>
                        <p>{{ product.product_desc}}</p>
                        <p>{{ product.price}}</p>
                        <p>{{ product.inventory}}</p>
                        <p>{{product.category}}</p>
                        <p>{{product.discount_perc}} : {{product.discount_name}}</p>
                        <a class="btn btn-outline-primary" href="#" @click="view_product_details(product.product_id)" role="button">View</a>
                        <a class="btn btn-primary" href="#" @click="editProduct(product.product_id)" role="button">Edit</a>
                        <a class="btn btn-secondary" href="#" @click="deleteProduct(product.product_id)" role="button">Delete</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            products:[],
            cat_id:this.$route.params.category_id,
            cat_name: null,
            cat_desc: null,
            errors : []
        }
    },
    components:{
        AdminNavbar
    },
    created(){
        this.fetchProducts();
        this.getCategoryDetails().then((data)=>{
            this.cat_name = data.name;
            this.cat_desc = data.desc;
        })
    },
    methods:{
        async fetchProducts(){
            const url = 'api/category/'+this.cat_id+'/products';
            const res = await fetch(url);
            const data = await res.json()
            if(res.ok){
                this.products = data.products;
            }else{
                console.log(data)
            }
        },
        async getCategoryDetails(){
            const url = 'api/categories/'+this.cat_id;
            const res = await fetch(url);
            const data = await res.json()
            if(res.ok){
                return data;
            }else{
                console.log(data);
                return {name:null, desc:null};
            }
        },
        view_product_details(product_id){
            this.$router.push({path:'/admin/product/view/'+product_id, params:{product_id:product_id}});
        },
        editProduct(product_id){
            this.$router.push({path:'/admin/product/edit/'+product_id, params:{product_id:product_id}});
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
                this.products = this.products.filter(product => product.product_id != product_id);
            }else{
                console.log(data);
                this.errors.push(data.message);
            }
        }
    }
}