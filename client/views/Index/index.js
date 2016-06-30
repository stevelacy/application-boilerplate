import React from 'react'
import { Component, PropTypes, connect } from 'shasta'
import classes from 'classnames'

@connect({
  me: 'me'
})
export default class HomeView extends Component {
  static displayName = 'HomeView'
  static propTypes = {
    me: PropTypes.map.isRequired
  }
  static defaultState = {
    OrderData: []
  }

  componentDidMount () {
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
