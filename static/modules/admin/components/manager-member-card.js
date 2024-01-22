export default{
    name : "ManagerMemberCard",
    props : {
        member : {
            type : Object,
            required : true
        }
    },
    template: `
    <div class="card" >
        <div class="card-body">
            <h5 class="card-title">{{member.first_name}} {{member.last_name}}</h5>
            <p class="card-text">{{member.email}}</p>
            <p class="card-text">{{member.telephone}}</p>
            <a v-if="member.active" href="#" @click="deactivate(member.id)" class="btn btn-primary">Deactivate</a>
            <a v-else href="#" @click="activate(member.id)" class="btn btn-primary">Activate</a>
        </div>
    </div>
    `,
    methods : {
        activate(id){
            this.$emit("activate", id);
        },
        deactivate(id){
            this.$emit("deactivate", id);
        }
    }
}