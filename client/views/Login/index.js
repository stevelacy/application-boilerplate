import React from 'react'
import { Component, PropTypes, connect } from 'shasta'
import DocumentMeta from 'react-document-meta'
import classes from 'classnames'
import request from 'superagent'
import Title from 'components/Title'
import actions from 'core/actions'
import './index.sass'

@connect({
  me: 'me'
})
export default class LoginView extends Component {
  static displayName = 'LoginView'
  static propTypes = {
    me: PropTypes.map.isRequired
  }
  static defaultState = {
    email: '',
    password: '',
    errors: {
      email: null,
      password: null
    },
    valid: false
  }
  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount () {
    return
    // if (this.props.me && this.props.me.get('id')) {
    //   this.props.history.push(`/user/${this.props.me.get('id')}`)
    // }
  }

  handleInput (e) {
    let obj = {}
    obj[e.target.name] = e.target.value
    if (this.state.email.length > 4 && this.state.email.length > 3) {
      obj.valid = true
    }
    this.setState(obj)
  }

  handleSubmit (e, opts) {
    e.preventDefault()
    console.log(this.state)
    // validate here
    request
      .post('/auth/local/start')
      .send({
        email: this.state.email,
        password: this.state.password,
        register: opts && opts.register
      })
      .end((err, res) => {
        console.log(err, res)
        // check status code + error message
        if (err) return this.setState({error: err})
        actions.me.set(res.body.me)
        this.context.router.push('/account')
      })
  }

  render() {
    return (
      <div className='login-view'>
        <DocumentMeta title='Login' />
        <form className='login-form' onSubmit={(e) => this.handleSubmit(e)}>
          <Title className='title' uppercase> Login </Title>
          <input
            type='email'
            name='email'
            value={this.state.email}
            onChange={(e) => this.handleInput(e)}
            placeholder='Email'
            className={classes('input', {
              error: this.state.errors.email
            })} />

          <input
            type='password'
            name='password'
            value={this.state.password}
            onChange={(e) => this.handleInput(e)}
            placeholder='Password'
            className={classes('input', {
              error: this.state.errors.email
            })} />

          <button
            onClick={(e) => this.handleSubmit(e)}
            className={classes('button', {
              green: this.state.valid
            })}>
              LOGIN
          </button>

          <button
            onClick={(e) => this.handleSubmit(e, {register: true})}
            className={classes('button', {
              green: this.state.valid
            })}>
              REGISTER
          </button>
        </form>
      </div>
    )
  }
}
