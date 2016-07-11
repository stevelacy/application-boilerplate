import React from 'react'
import { PropTypes, connect, Component } from 'shasta'
// import classes from 'classnames'
import actions from 'core/actions'
import config from 'config'
import Title from 'components/Title'

@connect({
  me: 'me'
})
export default class AdminOrdersComponent extends Component {
  static displayName = 'AdminOrderProductComponent'
  static propTypes = {
    me: PropTypes.map.isRequired,
    item: PropTypes.map
  }

  render() {
    if (!this.props.orders) return null
    return (
      <div className='item'>
      <Title> Orders </Title>
      <div className='hr' />
      {
        this.props.orders.map((order) => {
          return (
            <div
              key={order.get('id')}
              className='item'>
              {order.get('id')}
            </div>
          )
        })
      }
      </div>
    )
  }
}
