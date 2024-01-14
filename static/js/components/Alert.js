export default{
    name:'Alert',
    template:`
    <div v-if="show">
        <div v-if="issuccess" class="alert alert-danger alert-dismissible fade show" role="alert">
            <button type="button" class="button close" data-bs-dismiss="alert" aria-label="Close"><i class="bi bi-x-lg"></i></button>
            <strong>{{message}}</strong> 
        </div>
        <div v-if="ifwarning" class="alert alert-success alert-dismissible fade show" role="alert">
            <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close"><i class="bi bi-x-lg"></i></button>
            <strong>{{message}}</strong>
        </div>
    </div>
    `,
    props:{
        message:{
            type:String,
            required:true
        },
        type:{
            type:String,
            required:true
        }
    },
    data(){
        return{
            show:true
        }
    },
    watch:{
        message(){
            this.show=true
        }
    },
    created(){
        setTimeout(()=>{
            this.show=false
        },2000)
    },
    computed:{
        issuccess(){
            return this.type==='success'
        },
        ifwarning(){
            return this.type==='warning'
        }
    }
}