export default{
    name:'Logout',
    props:{
        error_mssg:{
            type:String,
            default:null
        },
        logout_success:{
            type:Boolean,
            default:false
        }
    },
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
    methods:{
        home(){
            this.$router.push('/')
        }
    }
}