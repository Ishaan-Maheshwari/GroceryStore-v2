export default {
    name:'ProductStats',
    template:`
      <div class="container-md">
          <h2>Charts of ordered product quantities</h2>
          <div class="row">
              <div class="col col-sm-12 col-md-6">
                  <canvas id="prod_barChart" width="100%" style=""></canvas>
              </div>
              <div class="col com-sm-12 col-md-6">
                  <canvas id="prod_pieChart" width="100%" style="max-width:600px"></canvas>
              </div>
          </div>
          <br>
          <hr>
      </div>
    `,
    data(){
        return{
            product_stat: null,
        }
    },
    created(){
        this.fetchProductStats();
    },
    methods:{
        make_product_charts(){
            const prod_names = this.product_stat.product_names;
            const prod_quant = this.product_stat.total_quantity;
            const labelcolors = prod_names.map(function(){ 
                        return '#' + Math.floor(Math.random()*16777215).toString(16);
                    });
            
            new Chart("prod_barChart", {
              type: "bar",
              data: {
                labels: prod_names,
                datasets: [{
                  backgroundColor: labelcolors,
                  data: prod_quant
                }]
              },
              options: {
                legend: {display: false},
                title: {
                  display: true,
                  text: "Orderd Items"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: Math.max(...prod_quant) + 1
                        }
                    }]
                }
                
              }
            });
            new Chart("prod_pieChart", {
              type: "doughnut",
              data: {
                labels: prod_names,
                datasets: [{
                  backgroundColor:labelcolors,
                  data: prod_quant
                }]
              },
              options: {
                legend: {display: false},
                title: {
                  display: true,
                  text: "Orderd Items"
                }
              }
            });
        },

        async fetchProductStats(){
            const res = await fetch('api/product_stats',{
              method: 'POST',
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.login_cred)
            });
            const data = await res.json()
            if(res.ok){
                this.product_stat = data;
                this.make_product_charts();
            }else{
                console.log(data)
            }
        }

    }
}