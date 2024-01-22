import AdminNavbar from "./AdminNavbar.js";
import ManagerMemberCard from "./manager-member-card.js";

export default {
    name: "AdminMembersPage",
    components: {
        AdminNavbar,
        ManagerMemberCard
    },
    template: `
    <div>
        <AdminNavbar />
        <div class="container mt-2 p-2">
            <h2 class="text-primary">
                Manage Members
            </h2>
            <hr>

            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="Search by username" v-model="searchQuery">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" @click="clear"><b>X</b></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 py-2" v-for="member in filteredItems">
                    <ManagerMemberCard :member="member":key="member.id"  @activate="manager_activation" @deactivate="manager_deactivate"/>
                </div>
            </div>

        </div>
    </div>
    `,
    data() {
        return {
            members: [],
            searchQuery: "",
        }
    },
    computed: {
        filteredItems() {
          return this.members.filter(members => {
            return members.username.toLowerCase().includes(this.searchQuery.toLowerCase());
          });
        },
    },
    created() {
        this.fetchMembers();
    },
    methods: {
        fetchMembers() {
            fetch("/api/admin/get-all-managers",{
                method: "POST",
                headers: {
                    "Authentication-Token" : localStorage.getItem("auth-token"),
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data.managers);
                    this.members = data.managers;
                })
        },
        manager_activation(id) {
            fetch(`/admin/activate/manager`, {
                method: "POST",
                headers: {
                    "Authentication-Token" : localStorage.getItem("auth-token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    manager_id: id
                })
            })
                .then(res => res.json())
                .then(data => {
                    this.fetchMembers();
                })
        },
        manager_deactivate(id) {
            fetch(`/admin/deactivate/manager`, {
                method: "POST",
                headers: {
                    "Authentication-Token" : localStorage.getItem("auth-token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    manager_id: id
                })
            })
                .then(res => res.json())
                .then(data => {
                    this.fetchMembers();
                })
        },
        clear() {
            this.searchQuery = "";
        }
    }
}