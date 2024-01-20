import Navbar from "./components/Navbar.js";
import CategoryCard from "./components/category-card.js";
import CategorySearchBar from "./components/category-search-bar.js";

export default {
    name : 'AllCategoriesPage',
    props : ['like'],
    template: `
    <div>
        <Navbar :username="username" :user_id="user_id" />
        <div class="container-md px-4 text-center mt-4">
            <h2 v-if="categoryquery == null">All Categories</h2>
            <h2 v-else>Seach Results for : {{categoryquery}}</h2>
            <hr>
        </div>
        <div class="container-md px-4">
            <div class="row">
                <div class="col-md-3">
                    <CategorySearchBar @categorysearch="searchCategory" :searchvalue="categoryquery" />
                </div>
            </div>
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
        CategoryCard,
        CategorySearchBar,
    },
    data() {
        return {
            username: null,
            user_id: null,
            categories: [],
            categoryquery: null,
        }
    },
    created() {
        if (localStorage.getItem('username') == null) {
            this.$router.push('/login');
        }
        this.username = localStorage.getItem('username');
        this.user_id = localStorage.getItem('user_id');
        if (this.like == '' || this.like == null) {
            this.getAllCategories();
        }else{
            this.categoryquery = this.like;
            this.searchCategory(this.like);
        }
    },
    methods: {
        getAllCategories() {
            fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                this.categories = data;
            })
            .catch(err => console.log(err));
        },
        searchCategory(searchvalue) {
            if (searchvalue == null || searchvalue == '') {
                this.getAllCategories();
            } else {
                fetch('/api/search/categories/' + searchvalue)
                .then(res => res.json())
                .then(data => {
                    this.categories = data.categories;
                    this.categoryquery = searchvalue;
                })
                .catch(err => console.log(err));
            }
        }
    }
}