import React from 'react'
import { Component, PropTypes, connect } from 'shasta'
import classes from 'classnames'

@connect({
  me: 'me'
})
export default class AccountView extends Component {
  static displayName = 'AccountView'
  static propTypes = {
    me: PropTypes.map.isRequired
  }
  static defaultState = {
    OrderData: []
  }
  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount () {
    if (!this.props.me.get('id')) {
      return this.context.router.push('/login')
    }
  }

  render() {
    return (
      <div className='home-view'>
      {
        this.state.OrderData.map((order) => {
          return (
            <div
              key={order.get('id')}
              onClick={() => this.setOrder(order)}
              style={{
                height: order.get('active') ? 500 : 50
              }}
              className={classes('order-row', {
                active: order.get('active')
              })}>
              {order.get('status')}
              {order.getIn(['user', 'data', 'profile', 'email'])}
            </div>
          )
        })
      }

      </div>
    )
  }
}
