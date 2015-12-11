import jwt_decode from 'jwt-decode'
import Ajax from '@fdaciuk/ajax'

const API_URL = 'http://localhost:8000/api/'
const LOGIN_URL = API_URL + 'auth/login'
const USER_URL = API_URL + 'users/'

export default {
  user: {
    authenticated: false,
    username: "",
    email: "",
    id: ""
  },

  login(ctx, creds, redirectUrl) {
      var self = this;
      var ajax = new Ajax();

      ajax.post(LOGIN_URL, creds).done(function(resp, xhr){
        // Set the token in localStorage
        localStorage.setItem('token', resp.token)

        // Update user object
        self.user.authenticated = true;
        self.getUserFromToken(resp.token)

        // Redirect to specified url
        window.location.href = redirectUrl;
      }).error(function(resp, xhr){
        console.log(resp);
      });
  },

  checkAuth() {
    var jwt = localStorage.getItem('token')
    if(jwt) {
      this.user.authenticated = true
      this.getUserFromToken(jwt)
    }
    else {
      this.user.authenticated = false
    }
  },

  getUserFromToken(token) {
    var decodedToken = jwt_decode(token);
    var userId = decodedToken.sub;
    this.getUser(userId);
  },

  getUser(id){
    var url = USER_URL + id;
    var self = this;
    // GET request
    var ajax = new Ajax();

    ajax.get(url).done(function(resp, xhr){
      // Update user object
      self.user.username = resp.data.username;
      self.user.email = resp.data.email;
      self.user.id = resp.data.id;

      console.log(self.user);
    }).error(function(resp, xhr){
      console.log(resp);
    });
  }
}
