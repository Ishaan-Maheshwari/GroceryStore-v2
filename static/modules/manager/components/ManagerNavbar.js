export default{
    name:'ManagerNavbar',
    template:`
        <nav class="navbar navbar-expand-md navbar-light sticky-top" style="background-color: #e3f2fd;">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Grocery Store</a>
                <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false"
                    aria-label="Toggle navigation">🔻</button>
                <div class="collapse navbar-collapse" id="collapsibleNavId">
                    <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li class="nav-item">
                            <a class="nav-link text-secondary" :href="$router.resolve('/admin/home').href"><i class="bi bi-graph-up-arrow"></i> Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" :href="$router.resolve('/admin/categories').href" ><i class="bi bi-tag-fill"></i> Categories</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" :href="$router.resolve('/admin/products').href"><i class="bi bi-flower3"></i> Products</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" :href="this.$router.resolve('/admin/discounts').href"><i class="bi bi-percent"></i> Offers & Discounts</a>
                        </li>
                        <li v-if="isAdmin" class="nav-item">
                            <a class="nav-link text-secondary" href="">➕ New Store Manager</a>
                        </li>
                        <li v-if="isAdmin" class="nav-item">
                            <a class="nav-link text-secondary" href="">Requests</a>
                        </li>
                        <li v-if="isAdmin" class="nav-item">
                            <a class="nav-link text-secondary" href="">Memberships</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary " href="#" @click="logout"><i class="bi bi-box-arrow-right"></i> Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `,
    data(){
        return{
            currentUser:null
        }
    },
    computed:{
        isAdmin(){
            return this.currentUser.role === 'admin'
        }
    },
    created(){
        const token = localStorage.getItem('auth-token')
        const role = localStorage.getItem('role')
        const username = localStorage.getItem('username')
        if(token){
            this.currentUser = {
                "role":role,
                "username":username,
                "token":token
            }
        }else{
            localStorage.clear()
            this.$router.push({path:'/'})
        }
    },
    methods:{
        async logout(){
            this.$router.push({path:'/logout'});
        },
        register_manager(){
            this.$router.push('/register_manager')
        }
    }
}