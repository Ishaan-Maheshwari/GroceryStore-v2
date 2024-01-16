import AdminNavbar from './AdminNavbar.js'

export default{
    name:'AdminAllCategory',
    template:`
    <div>
        <AdminNavbar/>
        <div class="container-md px-4 text-center mt-4">
            <h2 class="p-3 rounded" style="background-color:rgba(100, 247, 198, 0.5);">All Categories</h2>  
            <hr>
        </div>

        <div class="container px-4">
            <div class="row">
                <a class="btn btn-primary text-white" href="#" @click="addNewCategory" role="button">➕ Add New Category</a>
            </div>
        </div>
        <br>
        <div class="container">
            <div class="row">
                <div class="card col-md-4 col-lg-3 mx-2 my-2 border-secondary shadow" v-for="category in categories" :index="category.id">
                    <!-- <img class="card-img-top" src="holder.js/100x180/" alt=""> -->

                    <div class="card-body">
                        <h3 class="text-primary">{{category.name}}</h3>
                        <p>{{category.desc}}</p>
                        <a class="btn btn-outline-primary" href="#" @click="view_products(category.id); return false;" role="button">Products</a>
                        <a class="btn btn-info" href="#" @click="editCategory(category.id); return false;" role="button"><i class="bi bi-pencil-fill"></i></a>
                        <a class="btn btn-danger" href="#" @click="deleteCategory(category.id)" role="button"><i class="bi bi-trash-fill"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            categories:[]
        }
    },
    components:{
        AdminNavbar
    },
    created(){
        this.fetchCategories()
    },
    methods:{
        async fetchCategories(){
            const res = await fetch('api/categories');
            const data = await res.json()
            if(res.ok){
                this.categories = data;
            }else{
                console.log(data)
            }
        },
        view_products(category_id){
            // push to route /admin/categories/:category_id/products with props category_id and category_name
            this.$router.push({path:'/admin/category/'+category_id+'/products', params:{category_id:category_id}});
        },
        addNewCategory(){
            this.$router.push({path:'/admin/category/new'});
        },
        editCategory(category_id){
            this.$router.push({path:'/admin/category/edit/'+category_id, params:{category_id:category_id}});
        }
        ,
        async deleteCategory(category_id){
            // delete category with category_id
            // if success, remove category from categories array
            const res = await fetch('api/categories/'+category_id, 
            {
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            });
            const data = await res.json();
            if(res.ok){
                this.categories = this.categories.filter(category => category.id != category_id);
                console.log(data)
            }
            else{
                console.log(data)
            }
        }
    },

}