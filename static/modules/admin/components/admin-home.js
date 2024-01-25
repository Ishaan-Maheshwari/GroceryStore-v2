import AdminNavbar from "./AdminNavbar.js";
import ProductStats from "./product-stats.js";
import DailySalesChart from "./daily-sales-chart.js";
import outOfStockProductCard from "./out-of-stock-product-card.js";
import lowStockProductsCard from "./low-stock-products-card.js";

export default {
    name: "AdminHome" ,
    template: `
        <div>
            <AdminNavbar />
            <div class="container-md px-4 text-center mt-4">
                <h2 class="p-3 rounded" style="background-color: antiquewhite;">Admin Dashboard</h2>
                <hr>
            </div>
            <div class="container">
            <div class="row text-align-center ">
                <button class="btn btn-primary col col-md-2" @click="getReport">Get Report</button>
                <div class="col col-md-1"></div>
                <a v-if="taskid" class="btn btn-secondary col col-md-2" :href="reportlink" role="button">Download Report</a>
            </div>
            </div>
            <br>
            <div class="container">
                <div class="row text-align-center align-items-center justify-content-center">
                    <div class="col col-md-4">
                    <a class="btn btn-secondary text-white" :href="$router.resolve({ path : '/admin/category/new'}).href" role="button">➕ Add New Category</a>
                    </div>
                    <div class="col col-md-4">
                    <a class="btn btn-dark text-white" :href="$router.resolve({ path : '/admin/discounts/new'}).href" role="button">➕ Add New Discount</a>
                    </div>
                    <div class="col col-md-4">
                    <a class="btn btn-primary text-white" :href="$router.resolve({ path : '/admin/product/new'}).href" role="button">➕ Add New Product</a>
                    </div>
                </div>
            </div>
            <br>
            <br>
            <DailySalesChart />
            <br>
            <ProductStats />
            <br>
            <h3 class="text-center">Out of Stock Product Stock</h3>
            <outOfStockProductCard :products="outstocks" />
            <br>
            <h3 class="text-center">Low Stock Products</h3>
            <lowStockProductsCard :products="lowstocks"/>
        </div>
    `,
    components: {
        AdminNavbar,
        ProductStats,
        DailySalesChart,
        outOfStockProductCard,
        lowStockProductsCard
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.getOutOfStockProducts();
        this.getLowStockProducts();
    },
    data() {
        return {
            taskid: null,
            lowstocks : [],
            outstocks : []
        }
    },
    computed: {
        reportlink(){
            return "/get-rpt/" + this.taskid;
        }
    },
    methods: {
        getReport(){
            fetch("/download-rpt", {
                method: "GET",
                headers: {
                    "Authentication-Token" : localStorage.getItem("auth-token"),
                    "Content-Type" : "application/json"
                }
            }).then(res => res.json()).then(data => {
                if(data.status == "Success"){
                    alert("Report Generated Successfully");
                    this.taskid = data.taskid;
                    clearInterval(this.interval);
                }else{
                    alert("Report Generation Failed");
                }
            }).catch(err => {             
                alert("Report Generation Failed due to some error");
            });
        },
        getOutOfStockProducts() {
            let url = '/api/admin/out-of-stock';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => {
                this.outstocks = res.products;
            })
            .catch(err => {
                console.log(err.message);
                alert('Error: ' + err.message);
            })
        },

        getLowStockProducts() {
            let url = '/api/admin/low-stock';
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(res => {
                this.lowstocks = res.products;
            })
            .catch(err => {
                console.log(err.message);
                alert('Error: ' + err.message);
            })
        }
    }
}