import AdminNavbar from "./AdminNavbar.js";

export default {
    name: "AdminEditDiscountForm",
    template: `
    <div>
        <AdminNavbar />
        <div class="container mt-2 p-2">
            <h2 class="text-primary">
                Edit this Discount Offer for your Store.
            </h2>
            <hr>
            <div class="container-md px-4 text-center mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-6 p-2 border border-secondary rounded">
                        <form @submit.prevent="update_discount(discount_id)" >
                            <h4 class="text-secondary">Enter details for new offer</h4>
                            <hr>
                            <div class="container">
                                    <div class="mb-3 row">
                                        <label for="disname" class="col-4 col-form-label">Discount Name :</label>
                                        <div class="col-8">
                                            <input type="text" class="form-control" v-model="discount.name" id="disname" placeholder="Label for your Discount">
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <label for="disdesc" class="col-4 col-form-label">Description</label>
                                        <div class="col-8">
                                            <input type="text" class="form-control" v-model="discount.desc" id="disdesc" placeholder="a short description describing the Discount">
                                        </div>
                                    </div>

                                    <div class="mb-3 row">
                                        <label for="disperc" class="col-4 col-form-label">Discount %</label>
                                        <div class="col-8">
                                            <input type="number" min="0" max="100" class="form-control" v-model="discount.discount_percent" id="disperc" placeholder="in %">
                                        </div>
                                    </div>

                                    <div class="mb-3 row">
                                        <div class="col-8">
                                            <input type="checkbox" v-model="discount.is_active" true-value="true" false-value="false">
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3 row">
                                        <div class="col">
                                            <button type="submit" class="btn btn-secondary">Edit Discount</button>
                                        </div>
                                    </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            discount: {
                name: "",
                desc: "",
                discount_percent:0,
                is_active: true
            },
            discount_id: this.$route.params.discount_id,
            errors: [],
        };
    },
    created() {
        this.fetchDiscount();
    },
    components: {
        AdminNavbar,
    },
    methods: {
        async update_discount(discount_id) {
            const req_data = this.discount;
            const res = await fetch("api/discounts/"+discount_id, {
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
                this.$router.push({ path: "/admin/discounts" });
            } else {
                this.errors.push(data.message);
            }
        },
        async fetchDiscount(){
            const res = await fetch('api/discounts/'+this.discount_id);
            const data = await res.json();
            if(res.ok){
                this.discount = data;
            }else{
                this.errors.push("Unable to fetch discount details.");
                this.errors.push(data.message);
                console.log(data);
            }
        }
    },
}