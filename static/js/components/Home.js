import BasicNavbar from './BasicNavbar.js'
import Login from './Login.js'
import RegistrationForm from './RegistrationForm.js'

export default{
    name:'Home',
    template:`
    <div>
        <BasicNavbar/>
    <div class="container text-center mt-4">
        <div class="row justify-content-center">

            <div class="col-md-6 p-2 order-md-1">
                <Login v-if="loginVisible" @showRegister="showRegister" />
                <RegistrationForm v-if="registerVisible" @registered="showLogin" />
            </div>

            <div class="col-md-6 p-2">
                <!-- <h3 class="text-primary">Fresh & Healthy</h3>
                    <hr>
                    <p class="text-justify">
                        Welcome to "Freshest Bites" – the grocery store that'll tickle your taste buds and jazz up your
                        kitchen adventures! We're not your average grocery shop; we're a flavor-fiesta wonderland where
                        culinary dreams come true! Picture this: a symphony of veggies, a ballet of fruits, and an orchestra
                        of snacks, all dancing together in perfect harmony to make your grocery shopping a delightful
                        experience. Buckle up and get ready to explore our aisle-o-coolness, where discounts do the Macarena
                        and deals samba right into your shopping cart. So, grab a pineapple, put on your salsa shoes, and
                        let's spice up your shopping journey together – it's thyme to get shopping! 🍍🎉
                    </p> -->

                <div class="jumbotron">
                    <h1 class="display-4 text-primary">Welcome to Gorocery Store</h1>
                    <p class="lead text-justify">
                        Welcome to "Freshest Bites" – the grocery store that'll tickle your taste buds and jazz up your
                        kitchen adventures! We're not your average grocery shop; we're a flavor-fiesta wonderland where
                        culinary dreams come true! Picture this: a symphony of veggies, a ballet of fruits, and an orchestra
                        of snacks, all dancing together in perfect harmony to make your grocery shopping a delightful
                        experience. Buckle up and get ready to explore our aisle-o-coolness, where discounts do the Macarena
                        and deals samba right into your shopping cart. So, grab a pineapple, put on your salsa shoes, and
                        let's spice up your shopping journey together – it's thyme to get shopping! 🍍🎉
                    </p>

                </div>

            </div>

        </div>
    </div>
    </div>
    `,
    data(){
        return{
            loginVisible:true,
            registerVisible:false
        }
    },
    components:{
        BasicNavbar,
        Login,
        RegistrationForm
    },
    methods:{
        showLogin(){
            this.loginVisible = true;
            this.registerVisible = false;
        },
        showRegister(){
            this.loginVisible = false;
            this.registerVisible = true;
        }
    }
}