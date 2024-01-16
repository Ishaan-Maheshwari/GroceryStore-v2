// Description: Navbar component which is used to display the navbar in the admin dashboard

export default{
    name:'Navbar',
    template:`
        <nav class="navbar navbar-expand-md navbar-light sticky-top" style="background-color: #e3f2fd;">
            <div class="container-fluid">
                <a class="navbar-brand" href="">Grocery Store</a>
                <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false"
                    aria-label="Toggle navigation">🔻</button>
                <div class="collapse navbar-collapse" id="collapsibleNavId">
                    <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href=""><i class="bi bi-graph-up-arrow"></i> Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#" @click="admin_show_categories"><i class="bi bi-tag-fill"></i> Categories</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#" @click="admin_show_products"><i class="bi bi-flower3"></i> Products</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#" @click="admin_show_discounts"><i class="bi bi-percent"></i> Offers & Discounts</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="">➕ New Store Manager</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#" @click="logout"><i class="bi bi-box-arrow-right"></i> Logout</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary border rounded" href="">Go to Store</a>
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
        }
    },
    methods:{
        async logout(){
            const error_mssg = null;
            const logout_success = false;
            const res = await fetch('api/logout',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token':this.currentUser.token
                }
            })
            const data = await res.json()
            if (res.ok) {
                console.log(data);
                localStorage.removeItem('auth-token')
                localStorage.removeItem('role')
                localStorage.removeItem('username')
                this.currentUser = null
                this.logout_success = true
            }
            else{
                this.error_mssg = data.error
            }
            this.$router.push({path:'/logout', params: { error_mssg:this.error_mssg, logout_success: this.logout_success }});
        },
        admin_dashboard(){
            this.$router.push('/admin_dashboard')
        },
        admin_show_categories(){
            this.$router.push('/admin/categories')
        },
        admin_show_products(){
            this.$router.push('/admin/products')
        },
        admin_show_discounts(){
            this.$router.push('/admin/discounts')
        },
        register_manager(){
            this.$router.push('/register_manager')
        },
        home(){
            this.$router.push('/')
        }
    }
}