import React from 'react'
import { PropTypes, connect } from 'shasta'
// import classes from 'classnames'
import DataComponent from 'shasta-data-view'
import actions from 'core/actions'

@connect({
  me: 'me',
  orders: 'api.subsets.orders.data'
})
export default class OrdersView extends DataComponent {
  static displayName = 'OrdersView'
  static propTypes = {
    me: PropTypes.map.isRequired,
    orders: PropTypes.list
  }

  resolveData () {
    actions.api.orders.find({
      subset: 'orders',
      tail: true
    })
  }

  render() {
    if (!this.props.orders) return null
    console.log(this.props.orders.toJS())
    return (
      <div className='orders-view'>
      {
        this.props.orders.map((order) => {
          return (
            <div
              key={order.get('id')}
              className='order-item'>
              {order.get('id')}
            </div>
          )
        })
      }
      </div>
    )
  }
}
