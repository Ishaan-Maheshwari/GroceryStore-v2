import AdminNavbar from "./AdminNavbar.js";
import RequestCard from "./request-card.js";

export default {
    name: "AdminRequestsPage",
    template: `
    <div>
        <AdminNavbar />
        <div class="container mt-2 p-2">
            <h2 class="text-primary">
                Requests for your Store.
            </h2>
        </div>
        <hr>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <RequestCard v-for="request in requests" :request="request" :key="request.id" @approve-request="approve_request" @reject-request="reject_request" />
                </div>
            </div>
        </div>
    </div>`,
    data() {
        return {
            requests: [],
        }
    },
    components : {
        AdminNavbar,
        RequestCard,
    },
    created() {
        this.get_requests();
    },
    methods : {
        get_requests() {
            fetch('/api/admin/get-all-requests',{
                method : 'GET',
                headers : {
                    'Authentication-Token' : localStorage.getItem('auth-token'),
                    'Content-Type' : 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.requests = data.requests;
                })
                .catch(error => console.error('Error:', error));
        },
        approve_request(id){
            console.log(id);
            var res = confirm("Are you sure you want to approve this request?");
            if(res){
                this.approve(id);
            }
        },
        reject_request(id){
            var res = confirm("Are you sure you want to reject this request?");
            if(res){
                this.reject(id);
            }
        },
        async approve(id){
            let response = await fetch('/api/admin/approve-request',{
                method : 'POST',
                headers : {
                    'Authentication-Token' : localStorage.getItem('auth-token'),
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    request_id : id
                })
            });
            let data = await response.json();
            console.log(data);
            if(data.code == 200){
                alert(data.message);
                this.get_requests();
            }
            else{
                alert(data.message);
            }
        },
        async reject(id){
            let response = await fetch('/api/admin/decline-request',{
                method : 'POST',
                headers : {
                    'Authentication-Token' : localStorage.getItem('auth-token'),
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({
                    request_id : id
                })
            });
            let data = await response.json();
            console.log(data);
            if(data.code == 200){
                alert(data.message);
                this.get_requests();
            }
            else{
                alert(data.message);
            }
        }
    }
}