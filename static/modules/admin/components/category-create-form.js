import AdminNavbar from "./AdminNavbar.js";

export default {
    name: "AdminCreateCategoryForm",
    template: `
        <div>
            <AdminNavbar />
        <div class="container mt-2 p-2">
            <h2 class="text-primary">
                Add a new category 📦 for your Store.
            </h2>
            <hr>
            <div class="container-md px-4 text-center mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-6 p-2 border border-secondary rounded">
                        <h4 class="text-secondary">Enter details for new category</h4>
                        <hr>
                        <div class="container">
                                <div class="mb-3 row">
                                    <label for="catname" class="col-4 col-form-label">Category Name :</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="category.name" id="catname" placeholder="Label for your Category">
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="catdesc" class="col-4 col-form-label">Description</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" v-model="category.desc" id="catdesc" placeholder="a short description describing the Category">
                                    </div>
                                </div>
                                
                                <div class="mb-3 row">
                                    <div class="col">
                                        <button type="submit" class="btn btn-secondary" @click="create_category">Add Category</button>
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
            category: {
                name: "",
                desc: "",
            },
            errors: {},
        };
    },
    components: {
        AdminNavbar,
    },
    methods: {
        async create_category() {
            const req_data = {
                name: this.category.name,
                desc: this.category.desc,
            }
            const res = await fetch("api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth-token")
                },
                body: JSON.stringify(req_data),
            });
            const data = await res.json();
            if (res.ok) {
                console.log(data);
                if( localStorage.getItem("role") == "manager" ){
                    alert("Successfully requested to add category. \n Admin will review and update the category. \n Changes will be reflected after admin approval.");
                }
                this.$router.push({ path: "/admin/categories" });
            } else {
                this.errors = data.errors;
            }
        },
    },
}