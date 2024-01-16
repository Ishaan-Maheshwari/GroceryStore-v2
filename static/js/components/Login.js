export default {
    name:'Login',
    template:`
    <div class="container py-3 border border-secondary rounded">
        <h4 class="text-secondary">Enter into the Veggie-land 🍅</h4>
        <hr>
        {{error?error:null}}
        <div class="mb-3 row">
            <!-- <label for="inputName" class="col-4 col-form-label">Username</label> -->
            <div class="col-12">
                <input type="text" class="form-control" v-model="login_cred.username" id="inputusername"
                    placeholder="Username">
            </div>
        </div>
        <div class="mb-3 row">
            <!-- <label for="inputName" class="col-4 col-form-label">Password</label> -->
            <div class="col-12">
                <input type="password" class="form-control" v-model="login_cred.password" id="inputpassword"
                    placeholder="Password">
            </div>
        </div>
        <div class="mb-3 row">
            <div class="col">
                <button type="submit" class="btn btn-secondary" @click="login">Enter</button>
            </div>
        </div>
        <a href="">No account ? Create One !</a>
    </div>
    `,
    data(){
        return{
            login_cred:{
                username:"",
                password:""
            },
            error: null,
            currentUser: null
        }
    },
    created() {
        const token = localStorage.getItem('auth-token');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        const first_name = localStorage.getItem('first_name');
        if(token){
            this.currentUser = {
                "role":role,
                "username":username,
                "token":token,
                "first_name": first_name
            }
            if(this.currentUser.role == 'admin'){
                this.$router.push({path:'/admin/home'});
            }else if(this.currentUser.role == 'manager'){
                this.$router.push({path:'/'});
            }else{
                this.$router.push({path:'/'});
            }
        }
    },
    methods:{
        async login() {
            const res = await fetch('api/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.login_cred),
            })
            const data = await res.json()
            if (res.ok) {
                console.log(data);
                localStorage.setItem('auth-token',data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('user_id', data.id);
                localStorage.setItem('username', data.username);
                this.currentUser = {
                    "username": data.username,
                    "email": data.email,
                    "role": data.role,
                    "first_name": data.first_name,
                };
                if(this.currentUser.role == 'admin'){
                    this.$router.push({path:'/admin/home'});
                }else{
                    this.$router.push({path:'/'});
                }
            }else{
                this.error = data.message
            }
        }
    }
}