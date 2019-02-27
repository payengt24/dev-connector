import React, { Component } from 'react'

class Register extends Component {

  constructor(){
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}


    }
  }


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const {name, email, password, password2} = this.state
    console.log(name)

    const newUser = {
      name,
      email,
      password,
      password2
    }

    console.log(newUser);

  }

  render() {
    return (
<div className="register">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Sign Up</h1>
          <p className="lead text-center">Create your DevConnector account</p>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input 
              type="text"
              className="form-control form-control-lg" 
              placeholder="Name" 
              name="name"
              value={this.state.name} 
              onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <input 
              type="email" 
              className="form-control form-control-lg" 
              placeholder="Email Address" 
              value={this.state.email} 
              onChange={this.handleChange}
              name="email" />
              <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
            </div>
            <div className="form-group">
              <input 
              type="password" 
              className="form-control form-control-lg" 
              placeholder="Password"
              value={this.state.password}  
              onChange={this.handleChange}
              name="password" />
              
            </div>
            <div className="form-group">
              <input 
              type="password" 
              className="form-control form-control-lg" 
              placeholder="Confirm Password" 
              value={this.state.password2} 
              onChange={this.handleChange}
              name="password2" />
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>
    )
  }
}

export default Register