
import { ROUTES_PATH } from '../constants/routes.js'
export let PREVIOUS_LOCATION = ''

// we use a class so as to test its methods in e2e tests
export default class Login {
  constructor({ document, localStorage, onNavigate, PREVIOUS_LOCATION, store }) {
    // Initialize class properties
    this.document = document // Reference to the document object
    this.localStorage = localStorage // Reference to the localStorage object
    this.onNavigate = onNavigate // Callback function for navigation
    this.PREVIOUS_LOCATION = PREVIOUS_LOCATION // Previous location
    this.store = store // Store object
    const formEmployee = this.document.querySelector(`form[data-testid="form-employee"]`)
    formEmployee.addEventListener("submit", this.handleSubmitEmployee)
    const formAdmin = this.document.querySelector(`form[data-testid="form-admin"]`)
    formAdmin.addEventListener("submit", this.handleSubmitAdmin)
  }
  
  handleSubmitEmployee = e => {
    e.preventDefault()
    const user = {
      type: "Employee",
      email: e.target.querySelector(`input[data-testid="employee-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="employee-password-input"]`).value,
      status: "connected"
    }
    this.localStorage.setItem("user", JSON.stringify(user))
    //login user et handle navigation
    this.login(user)
      .catch(
        (err) => this.createUser(user)
      )
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
        this.PREVIOUS_LOCATION = ROUTES_PATH['Bills']
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION
        this.document.body.style.backgroundColor="#fff"
      })

  }

  handleSubmitAdmin = e => {
    e.preventDefault()
    // Extract user information from the form
    const user = {
      type: "Admin",
      //[bug report - exe2] login admin qui fonctionne pour naviger vers Dashbord
      // `input[data-testid="employee-email-input"]` -> `input[data-testid="admin-email-input"]`
      // `input[data-testid="employee-password-input"]` -> `input[data-testid="admin-password-input"]`
      email: e.target.querySelector(`input[data-testid="admin-email-input"]`).value,
      password: e.target.querySelector(`input[data-testid="admin-password-input"]`).value,
      status: "connected"
    }
    //store user informationdans localStorage
    //login user et handle navigation
    this.localStorage.setItem("user", JSON.stringify(user))
    this.login(user)
      .catch(
        (err) => this.createUser(user)
      )
      .then(() => {
        this.onNavigate(ROUTES_PATH['Dashboard'])
        this.PREVIOUS_LOCATION = ROUTES_PATH['Dashboard']
        PREVIOUS_LOCATION = this.PREVIOUS_LOCATION
        document.body.style.backgroundColor="#fff"
      })
  }

  // not need to cover this function by tests
  login = (user) => {
    if (this.store) {
      return this.store
      .login(JSON.stringify({
        email: user.email,
        password: user.password,
      })).then(({jwt}) => {
        localStorage.setItem('jwt', jwt)
      })
    } else {
      return null
    }
  }

  // not need to cover this function by tests
  createUser = (user) => {
    if (this.store) {
      return this.store
      .users()
      .create({data:JSON.stringify({
        type: user.type,
        name: user.email.split('@')[0],
        email: user.email,
        password: user.password,
      })})
      .then(() => {
        console.log(`User with ${user.email} is created`)
        return this.login(user)
      })
    } else {
      return null
    }
  }
}
