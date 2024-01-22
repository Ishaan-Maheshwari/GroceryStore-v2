import AdminNavbar from "./AdminNavbar.js";
import RegistrationForm from "../../../js/components/RegistrationForm.js";
// Path: static/modules/admin/components/member-registration-form.js

export default {
    name : 'MemberRegistrationForm',
    components : {
        RegistrationForm,
        AdminNavbar
    },
    template:`
    <div>
        <AdminNavbar />
        <div class="container md-3 px-2 mt-4">
        <h2 class="text-primary text--center">Register a new Member into the Veggie-land 🍅</h2>
        <hr>
        <div class="row justify-content-center">
            <div class="col-md-6 p-2">
                <RegistrationForm @registered="registered" />
            </div>
        </div>
        </div>
    </div>
    `,
    methods:{
        registered(){
            alert('Member registered successfully');
            this.$router.push({path : '/admin/members'});
        }
    },
}