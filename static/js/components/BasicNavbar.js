// Description: Navbar component which is used to display the navbar in the admin dashboard

export default{
    name:'BasicNavbar',
    template:`
        <nav class="navbar navbar-expand-md navbar-light sticky-top shadow" style="background-color: #e3f2fd;">
            <div class="container-fluid">
            <a class="navbar-brand" href="#"> <i class="bi bi-shop"></i> Grocery Store</a>
            <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                aria-expanded="false" aria-label="Toggle navigation">🔻</button>
            <div class="collapse navbar-collapse" id="collapsibleNavId">
                <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <a class="nav-link text-secondary" @click="show_category"><i class="bi bi-tag-fill"></i> Categories</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-secondary" @click="show_product"><i class="bi bi-flower3"></i> Products</a>
                    </li>
                    <li v-if="is_authenticated" class="nav-item">
                        <a class="nav-link text-secondary" href=""><i class="bi bi-cart3"></i> cart </a>
                    </li>
                    <li v-if="is_authenticated" class="nav-item">
                        <a class="nav-link text-secondary" href=""><i class="bi bi-person-circle"></i> {{currentUser.username}}</a>
                    </li>
                    <li v-if="is_authenticated" class="nav-item">
                        <button class="btn nav-link text-secondary rounded" @click="logout"> <i class="bi bi-box-arrow-right"></i> logout</button>
                    </li>
                    <!-- <li class="nav-item">
                        <a class="nav-link text-secondary border border-secondary rounded" >Are you Admin? <i class="bi bi-tools"></i> </a>
                    </li> -->   
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
                "username":username
            }
        }
    },
    computed : {
        is_authenticated() {
            return this.currentUser !== null
        },
        is_admin() {
            if (this.currentUser === null) {
                return false
            }
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
                "username":username
            }
        }
    },
    methods:{
        logout(){
            this.$router.push('/logout')
        },
        admin_dashboard(){
            this.$router.push('/')
        },
        show_category(){
            this.$router.push('/')
        },
        show_product(){
            this.$router.push('/')
        },
        logout(){
            this.$router.push('/')
        },
        home(){
            this.$router.push('/')
        }
    }
}