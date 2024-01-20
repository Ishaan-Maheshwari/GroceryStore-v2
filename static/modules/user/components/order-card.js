export default {
    name : 'OrderCard',
    template : `
    <div class="card w-100 my-3">
        <!-- <div class="card-header">
            <h5 class="card-title">Order Details</h5>
        </div> -->
        <div class="card-body text-center">
            <div class="row">
                <div class="col-sm-4 col-md-2">
                    <h6 class="card-subtitle mb-2 text-muted">Order ID</h6>
                    <p class="card-text">{{ order.id }}</p>
                </div>
                <div class="col-sm-4 col-md-2">
                    <h6 class="card-subtitle mb-2 text-muted">Order Date</h6>
                    <p class="card-text">{{ order.date }}</p>
                </div>
                <div class="col-sm-4 col-md-2">
                    <h6 class="card-subtitle mb-2 text-muted">Order Date</h6>
                    <p class="card-text">{{ order.time }}</p>
                </div>
                <div class="col-sm-4 col-md-2">
                    <h6 class="card-subtitle mb-2 text-muted">Order Status</h6>
                    <p class="card-text">SUCCESS</p>
                </div>
                <div class="col-sm-4 col-md-2">
                    <h6 class="card-subtitle mb-2 text-muted">Total Amount</h6>
                    <p class="card-text">₹ {{ order.total }}</p>
                </div>
                <div class="col-sm-4 col-md-2">
                    <h6 class="card-subtitle mb-2 text-muted">View Details</h6>
                    <a class="text-info" :href="$router.resolve({path : '/myorder/'+order.id}).href"><i class="bi bi-eye-fill"></i></a>
                </div>
            </div>
        </div>
    </div>
    `,
    props : {
        order : {
            type : Object,
            required : true
        }
    },
}