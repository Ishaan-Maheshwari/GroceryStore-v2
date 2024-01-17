export default {
    name : 'Navbar',
    props : ['username','user_id'],
    template: `    
    <nav class="navbar navbar-expand-md navbar-light sticky-top shadow mb-3" style="background-color: #e3f2fd;">
        <div class="container-fluid">
        <a class="navbar-brand" href="/"> <i class="bi bi-shop"></i> Grocery Store</a>
        <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
            aria-expanded="false" aria-label="Toggle navigation">🔻</button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
            <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                <li class="nav-item">
                    <a class="nav-link text-secondary" href="/"><i class="bi bi-house-door-fill"></i> Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-secondary" :href="$router.resolve('/categories').href"><i class="bi bi-tag-fill"></i> Categories</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-secondary" :href="$router.resolve('/products').href"><i class="bi bi-flower3"></i> Products</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-secondary" href="#"><i class="bi bi-box-seam-fill"></i> Orders </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-secondary" href="#"><i class="bi bi-cart3"></i> cart </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-secondary" href="#"><i class="bi bi-person-circle"></i> {{username}}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-secondary" href="#/logout"> <i class="bi bi-box-arrow-right"></i>  logout</a>
                </li>
            </ul>   
        </div>
        </div>
    </nav>
    `,
    methods: {}
}