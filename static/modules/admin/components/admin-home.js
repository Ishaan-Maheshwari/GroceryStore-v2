import AdminNavbar from "./AdminNavbar.js";

export default {
    name: "AdminHome" ,
    template: `
        <div>
            <AdminNavbar />
            <div class="container-fluid mt-2">
                <div class="row">
                    <div class="col-md-12">
                        <div class="jumbotron">
                            <h1 class="display-4">Welcome to Admin Dashboard</h1>
                            <p class="lead">Manage your store from here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    components: {
        AdminNavbar,
    }
}