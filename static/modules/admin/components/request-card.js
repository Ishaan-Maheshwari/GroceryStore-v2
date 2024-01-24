export default{
    name : "RequestCard",
    props : ['request'],
    template : `
        <div class="card px-2 my-2">
            <div class="card-body row justify-contents-center text-align-center">
                <div class="col">
                    <h5 class="card-text">#ID</h5>
                    <p class="card-text">{{request.id}}</p>
                </div>
                <div class="col">
                    <h5 class="card-text">Requestee</h5>
                    <p class="card-text">{{request.requester_username}}</p>
                </div>
                <div class="col">
                    <h5 class="card-text">Purpose</h5>
                    <p class="card-text">{{request.action}}</p>
                </div>
                <div class="col">
                    <h5 class="card-text">Status</h5>
                    <p class="card-text">{{request.status}}</p>
                </div>
                <div class="col">
                    <h5 class="card-text">Actions</h5>
                    <button class="btn btn-outline-warning" @click="view_request"><i class="bi bi-info-circle-fill"></i></button>
                    <button class="btn btn-outline-primary" @click="$emit('approve-request', request.id)"><i class="bi bi-check-circle-fill"></i></button>
                    <button class="btn btn-outline-secondary" @click="$emit('reject-request', request.id)"><i class="bi bi-x-octagon"></i></button>
                </div>
            </div>
            <div v-if="show_deatils" class="card-body">
                <h5 class="card-title">Request Details</h5>
                <p class="card-text">{{request.details}}</p>
            </div>
        </div>
    `,
    data(){
        return{
            show_deatils : false
        }
    },
    methods : {
        view_request(){
            this.show_deatils = !this.show_deatils;
        }
    }
}

