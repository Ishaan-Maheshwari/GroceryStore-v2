export default {
    name : 'CategorySearchBar',
    props : ['searchvalue'],
    template: `
    <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search Categories" v-model="searchvalue">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="$emit('categorysearch',searchvalue)"><i class="bi bi-search"/></button>
        </div>
    </div>
    `,
    methods: {}
}