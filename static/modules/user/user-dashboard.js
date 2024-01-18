import Navbar from "./components/Navbar.js";

export default {
    name : 'UserDashboard',
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-fluid mt-2">
            <div class="row">
                <div class="col-md-12">
                    <div class="jumbotron">
                        <h1 class="display-4">Welcome to User Dashboard</h1>
                        <p class="lead">Start Your shopping from here.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    components: {
        Navbar
    },
    data() {
        return {
            username: null,
            user_id: null
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
    }
}