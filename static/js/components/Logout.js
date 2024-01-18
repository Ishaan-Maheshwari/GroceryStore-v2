export default{
    name:'Logout',
    template:`
    <div>
        <div v-if="error_mssg" class="alert alert-danger" role="alert">
            {{error_mssg}}
        </div>
        <h1 v-if="logout_success" class="text-success" > Successfully logged out ! </h1>
        <h1 else class="text-warning">Logging out</h1>
        <button class="btn btn-secondary" @click="home">Go to Home</button>
    </div>
    `,
    data(){
        return{
            error_mssg:null,
            op_success:false
        }
    },
    computed : {
        logout_success(){
            return this.op_success;
        }
    },
    created(){
        this.logout()
    },
    methods:{
        home(){
            this.$router.push('/')
        },
        async logout(){
            const res = await fetch('api/logout',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            if (res.ok) {
                console.log(data);
                localStorage.removeItem('auth-token');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                localStorage.removeItem('user_id');
                alert('Successfully logged out !');
                this.op_success = true
            }
            else{
                this.error_mssg = data.message;
            }
        }
    }
}