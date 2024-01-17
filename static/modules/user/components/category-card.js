// TODO: view products in that category

export default {
    name: 'CategoryCard',
    props: ['category'],
    template: `
    <div class="card col-md-4 col-lg-3 p-2 my-2 border-0">
        <div class="card-body rounded border border-secondary shadow">
            <h3 class="text-primary">{{ category.name }}</h3>
            <p>{{ category.desc }}</p>
            <a class="btn btn-outline-primary" :href="$router.resolve({path : '/category/'+category.id+'/products'}).href" role="button">view Products</a>
        </div>
    </div>
    `,
}