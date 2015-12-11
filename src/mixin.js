import auth from './service.js'

export default {
  route: {
    canActivate() {
      if(auth.user.authenticated){
        return true
      } else {
        window.location.href = "/!#/auth/login"
      }
    }
  },

  data: function(){
    return {
      user: auth.user
    }
  },

  http: {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
}
