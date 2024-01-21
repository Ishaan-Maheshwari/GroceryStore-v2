import AdminNavbar from "./AdminNavbar.js";
import ProductStats from "./product-stats.js";
import DailySalesChart from "./daily-sales-chart.js";

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
        </div>
    `,
    components: {
        AdminNavbar,
        ProductStats,
        DailySalesChart
    }
}