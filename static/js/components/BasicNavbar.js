// Description: Navbar component which is used to display the navbar on the homepage

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
                    <li v-if="is_authenticated" class="nav-item">
                        <a class="nav-link text-secondary" href=""><i class="bi bi-cart3"></i> cart </a>
                    </li>
                    <li v-if="is_authenticated" class="nav-item">
                        <a class="nav-link text-secondary" href=""><i class="bi bi-person-circle"></i> {{currentUser.username}}</a>
                    </li>
                    <button v-if="is_authenticated" class="btn text-secondary rounded" @click="logout"> <i class="bi bi-box-arrow-right"></i>logout</button>  
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
            this.$router.push('/')
        },
        show_category(){
            this.$router.push('/')
        },
        show_product(){
            this.$router.push('/')
        },
        home(){
            this.$router.push('/')
        }
    }
}