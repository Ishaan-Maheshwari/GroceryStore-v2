export default{
    name:'Logout',
    template:`
    <div>
        <h1 class="text-secondary">Logging out...</h1>
        <div v-if="error_mssg" class="alert alert-danger" role="alert">
            {{error_mssg}}
        </div>
        <div v-if="logout_success" class="alert alert-success" role="alert">
            Successfully logged out !
        </div>
        <button class="btn btn-secondary" @click="home">Go to Home</button>
    </div>
    `,
    data(){
        return{
            error_mssg:null,
            logout_success:false
        }
    },
    mounted: {
        async logout(){
            const res = await fetch('api/logout',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        }
    },
    methods:{
        home(){
            this.$router.push('/')
        }
    }
}