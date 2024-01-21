export default {
    name: "DailySalesChart",
    template: `
    <div v-f="chart_data_found" class="container-md">
        <h2>Daily sales</h2>
        <div class="row">
            <div class="col">
                <canvas id="daily_Chart" width="100%" style="max-height:400px"></canvas>
            </div>
        </div>
        <br>
        <hr>
    </div>
    `,
    data () {
        return {
            daily_sales : null,
            chart_data_found : true
        }
    },
    created(){
        this.fetchDailySales();
    },
    methods : {
        async fetchDailySales(){
            let response = await fetch('/api/admin/dailysales',{
                method:'GET',
                headers:{
                    'Authentication-Token':localStorage.getItem('auth-token'),
                    'Content-Type':'application/json'
                }
            });
            let data = await response.json();
            if(data.status == 'Success'){
                this.daily_sales = data.daily_sales;
                this.chart_data_found = true;
                this.make_product_charts();
            }else{
                this.chart_data_found = false;
            }
        },
        make_product_charts(){
            const daily_dates = this.daily_sales.date;
            const daily_quant = this.daily_sales.total_price;
            
            new Chart("daily_Chart", {
              type: "line",
              data: {
                labels: daily_dates,
                datasets: [{
                  data: daily_quant,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  pointRadius: 2,
                  fill: false
                }]
              },
              options: {
                legend: {display: false},
                title: {
                  display: true,
                  text: "Daily Sales"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: Math.max(...daily_quant) + 1
                        }
                    }]
                }
                
              }
            });
        }
    }
}