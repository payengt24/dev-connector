import React, { Component } from 'react'

class Login extends Component {

  constructor(){
    super();
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const {email, password} = this.state;

    const userLogin= {
      email,
      password
    }

    console.log(userLogin)

  }



  render() {

    const {email, password} = this.state

    return (
      <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">Sign in to your DevConnector account</p>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input 
                    type="email" 
                    className="form-control form-control-lg" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={this.handleChange}
                    name="email" />
                  </div>
                  <div className="form-group">
                    <input 
                    type="password" 
                    className="form-control form-control-lg" 
                    placeholder="Password" 
                    value={password}
                    onChange={this.handleChange}
                    name="password" />
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

export default Login
