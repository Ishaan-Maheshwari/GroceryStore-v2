export default {
    name : 'ProductSearchBar',
    props : ['searchvalue'],
    template: `
    <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search Products" v-model="searchvalue">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="$emit('productsearch',searchvalue)"><i class="bi bi-search"></i></button>
        </div>
    </div>
    `,
    methods: {}
}