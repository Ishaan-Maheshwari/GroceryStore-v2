import AdminNavbar from "./AdminNavbar.js";

export default {
    name: "AdminEditCategoryForm",
    template: `
        <div>
            <AdminNavbar />
        <div class="container mt-2 p-2">
            <h2 class="text-primary">
                Edit category Details ℹ for your Store.
            </h2>
            <hr>
            {{errors?errors:''}}
            <div class="container-md px-4 text-center mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-6 p-2 border border-secondary rounded">
                        <h4 class="text-secondary">Enter details for new category</h4>
                        <hr>
                        <div class="container">
                                <div class="mb-3 row">
                                    <label for="catname" class="col-4 col-form-label">Category Name :</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="new_category.name" id="catname" :placeholder="category.name">
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="catdesc" class="col-4 col-form-label">Description</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="new_category.desc" id="catdesc" :placeholder="category.desc">
                                    </div>
                                </div>
                                
                                <div class="mb-3 row">
                                    <div class="col">
                                        <button type="submit" class="btn btn-secondary" @click="update_category(cat_id)">Update Category</button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `,
    data() {
        return {
            cat_id: this.$route.params.category_id,
            category: null,
            new_category: {
                name: null,
                desc: null,
            },
            errors: null,
        };
    },
    components: {
        AdminNavbar,
    },
    created() {
        if (this.cat_id == null) {
            errors = "Category ID not found";
        }
        this.fetchCategoryDetails(this.cat_id);
    },
    methods: {
        async update_category(cat_id) {
            const req_data = {
                name: this.new_category.name,
                desc: this.new_category.desc,
            }
            const res = await fetch("api/categories/"+cat_id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth-token")
                },
                body: JSON.stringify(req_data),
            });
            const data = await res.json();
            if (res.ok) {
                console.log(data);
                this.$router.push({ path: "/admin/categories" });
            } else {
                this.errors = data.message;
            }
        },
        async fetchCategoryDetails(category_id){
            const res = await fetch('api/categories/'+category_id);
            const data = await res.json();
            if(res.ok){
                this.category = data;
            }else{
                console.log(data);
                this.errors = data.message;
            }
        }
    },
}