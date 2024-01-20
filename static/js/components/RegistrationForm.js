export default{
    name : 'RegistrationForm',
    template:`
    <div class="container py-3 border border-secondary rounded">
        <h4 class="text-secondary">Enter into the Veggie-land 🍅</h4>
        <hr>
        {{error?error:null}}
        <form @submit.prevent="register" method="post">
            <div class="mb-3 row">
                <label for="username" class="col-4 col-form-label">Username</label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model="username" id="username" placeholder="A unique name to identify you">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="email" class="col-4 col-form-label">Email</label>
                <div class="col-8">
                    <input type="email" class="form-control" v-model="email" id="email" placeholder="Your email address">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="password" class="col-4 col-form-label">Password</label>
                <div class="col-8">
                    <input type="password" class="form-control" v-model="password" id="password" placeholder="A strong password">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="fname" class="col-4 col-form-label">First Name</label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model="first_name" id="fname" placeholder="Your first name">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="lname" class="col-4 col-form-label">Last Name</label>
                <div class="col-8">
                    <input type="text" class="form-control" v-model="last_name" id="lname" placeholder="Your last name">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="tel" class="col-4 col-form-label">Telephone</label>
                <div class="col-8">
                    <input type="tel" class="form-control" v-model="telephone" id="tel" placeholder="Your telephone number">
                </div>
            </div>

            <div class="mb-3 row">
                <div class="col-sm-6">
                    <button type="submit" class="btn btn-outline-primary">Register yourself</button>
                </div>
                <div class="col-sm-6">
                    <a href="#" @click="$emit('registered')" >Already have an account !</a>
                </div>
            </div>
        </form>
    </div>
    `,
    data(){
        return {
            username:'',
            email:'',
            password:'',
            first_name:'',
            last_name:'',
            telephone:'',
            error:null
        }
    },
    methods:{
        register(){
            const data = {
                username:this.username,
                email:this.email,
                password:this.password,
                first_name:this.first_name,
                last_name:this.last_name,
                telephone:this.telephone
            }
            fetch('/api/user/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
            .then(res=>res.json())
            .then(res=>{
                if(res.error){
                    this.error = res.error
                }else{
                    this.$emit('registered', 'success');
                }
            })
        }
    }
}