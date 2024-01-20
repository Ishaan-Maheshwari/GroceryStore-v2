import Navbar from "./components/Navbar.js";
import ProfileDetailsCard from "./components/profile-card.js";

export default {
    name : 'UserProfilePage',
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2 class="text-primary">
            <i class="bi bi-person-circle"> User Profile
            </h2>
            <hr>
        </div>
        <div class="container-md px-4 py-4 mt-4">
            <div class="row">
                <div class="col-md-8">
                    <ProfileDetailsCard :user_details="user_details" />
                </div>
                
                <div class="col-md-4">   
                        
                    <ul class="list-group">
                        <a tag="li" class="list-group-item" :href="$router.resolve({path : '/profile'}).href">
                            <i class="bi bi-pencil-square"></i> Edit Profile
                        </a>
                        <a tag="li" class="list-group-item" :href="$router.resolve({path : '/profile'}).href">
                            <i class="bi bi-key"></i> Change Password
                        </a>
                        <a tag="li" class="list-group-item" :href="$router.resolve({path : '/profile'}).href">
                            <i class="bi bi-trash"></i> Delete Profile
                        </a>
                        <a tag="li" class="list-group-item" :href="$router.resolve({path : '/myorders'}).href">
                            <i class="bi bi-box-seam"></i> Orders
                        </a>
                        <a tag="li" class="list-group-item" :href="$router.resolve({path : '/cart'}).href">
                            <i class="bi bi-cart3"></i> Cart
                        </a>
                    </ul>
                    
                </div>

            </div>
        </div>
    </div>
    `,
    components: {
        Navbar,
        ProfileDetailsCard
    },
    data() {
        return {
            username: null,
            user_id: null,
            user_details: null
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        this.getUserDetails();
    },
    methods: {
        getUserDetails() {
            let url = '/api/common/user_details/' + this.user_id ;
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => {
                this.user_details = res.user_details;
            })
            .catch(err => {
                console.log(err.message);
                alert('Error: ' + err.message);
            })
        }
    }
}