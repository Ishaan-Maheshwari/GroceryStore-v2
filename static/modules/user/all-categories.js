import Navbar from "./components/Navbar.js";
import CategoryCard from "./components/category-card.js";

export default {
    name : 'AllCategoriesPage',
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2>All Categories</h2>
            <hr>
        </div>

        <div class="container">
            <div class="row">
                <CategoryCard v-for="category in categories" :key="category.id" :category="category" />
            </div>
        </div>
    </div>
    `,
    components: {
        Navbar,
        CategoryCard
    },
    data() {
        return {
            username: null,
            user_id: null,
            categories: []
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        this.getAllCategories();
    },
    methods: {
        getAllCategories() {
            fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                this.categories = data;
            })
            .catch(err => console.log(err));
        }
    },
}