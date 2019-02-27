import React, { Component } from 'react'
import ProTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { registerUser } from '../../actions/authAction'

//package that allows conditional class name (for errors on input)
import classnames from 'classnames'

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

  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({
        errors: nextProps.errors
      })
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

    // console.log(newUser);

    this.props.registerUser(newUser, this.props.history)



  }

  render() {

    const {name, email, password, password2, errors} = this.state

    return (
      <div className="register">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Sign Up</h1>
                <p className="lead text-center">Create your DevConnector account</p>
                <form noValidate onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input 
                    type="text"
                    className={classnames("form-control form-control-lg", {
                      'is-invalid': errors.name
                    })}
                    placeholder="Name" 
                    name="name"
                    value={name} 
                    onChange={this.handleChange}
                    />
                    {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                  </div>
                  <div className="form-group">
                    <input 
                    type="email" 
                    className={classnames("form-control form-control-lg", {
                      'is-invalid': errors.email
                    })}
                    placeholder="Email Address" 
                    value={email} 
                    onChange={this.handleChange}
                    name="email" />
                    {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                    <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                  </div>
                  <div className="form-group">
                    <input 
                    type="password" 
                    className={classnames("form-control form-control-lg", {
                      'is-invalid': errors.password
                    })}
                    placeholder="Password"
                    value={password}  
                    onChange={this.handleChange}
                    name="password" />
                    {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                  </div>
                  <div className="form-group">
                    <input 
                    type="password" 
                    className={classnames("form-control form-control-lg", {
                      'is-invalid': errors.password2
                    })}
                    placeholder="Confirm Password" 
                    value={password2} 
                    onChange={this.handleChange}
                    name="password2" />
                    {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
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

Register.proTypes= {
  registerUser: ProTypes.func.isRequired,
  auth: ProTypes.object.isRequired,
  errors: ProTypes.object.isRequired

}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps, { registerUser })(withRouter(Register))