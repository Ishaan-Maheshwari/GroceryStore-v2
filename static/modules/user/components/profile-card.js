// TODO : Edit profile button

export default {
  name: 'ProfileDetailsCard',
  props: ['user_details'],
  template : `
  <div class="card">
    <div class="card-header text-center">
      <h5 class="card-title">Profile Details</h5>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4 justify-content-center align-items-center">
          <img src="https://i.pinimg.com/736x/07/33/ba/0733ba760b29378474dea0fdbcb97107.jpg" class="card-img-top img-fluid" alt="Profile Picture">
        </div>
        <div class="col-md-8">
          <ul class="list-group list-group-flush">
          <li class="list-group-item"><b>Name:</b> {{ user_details.first_name }} {{ user_details.last_name }}</li>
            <li class="list-group-item"><b>Username:</b> @{{ user_details.username }}</li>
            <li class="list-group-item"><b>Role:</b> {{ user_details.role }}</li>
            <li class="list-group-item"><b>Email:</b> {{ user_details.email }}</li>
            <li class="list-group-item"><b>Telephone:</b> {{ user_details.telephone }}</li>
            <li class="list-group-item text-success" v-if="user_details.is_active">Active <i class="bi bi-record-circle"></i></b></li>
            <li class="list-group-item text-danger" v-else>Inactive <i class="bi bi-exclamation-circle-fill"></i></b></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  `,
}
