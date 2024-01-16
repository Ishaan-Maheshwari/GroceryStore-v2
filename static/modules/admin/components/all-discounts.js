import AdminNavbar from './AdminNavbar.js'

export default{
    name:'AdminAllDiscounts',
    template:`
    <div>
        <AdminNavbar/>
        <div class="container-md px-4 text-center mt-4">
            <h2 class="p-3 rounded" style="background-color:rgba(100, 247, 198, 0.5);">All Discounts</h2>  
            <hr>
        </div>

        <div class="container px-4">
            <div class="row">
                <a class="btn btn-primary text-white" href="" role="button">➕ Add New Discount</a>
            </div>
        </div>
        <br>
        <div class="container">
            <div class="row">
                <table class="table table-striped table-inverse table-responsive text-align-center">
                    <thead class="thead-inverse">
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Discount %</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr v-for="discount in discounts">
                            <td>{{ discount.name }}</td>
                            <td>{{ discount.desc }}</td>
                            <td>{{ discount.discount_percent }} %</td>
                            <td v-if="discount.is_active" class="text-sucess">Active</td>
                            <td v-else class="text-danger">Not Active</td>
                            <td>
                                <a class="btn btn-primary text-white" href=""
                                    role="button">Edit</a>
                                <a class="btn btn-danger text-white" href=""
                                    role="button">Delete</a>
                            </td>
                        </tr>

                        </tbody>
                </table>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            discounts:[]
        }
    },
    components:{
        AdminNavbar
    },
    created(){
        this.fetchDiscounts()
    },
    methods:{
        async fetchDiscounts(){
            const res = await fetch('api/discounts');
            const data = await res.json()
            if(res.ok){
                this.discounts = data;
            }else{
                console.log(data)
            }
        }
    }
}