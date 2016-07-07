import React from 'react'
import { PropTypes, connect } from 'shasta'
// import classes from 'classnames'
import DataComponent from 'shasta-data-view'
import actions from 'core/actions'
import config from 'config'
import Title from 'components/Title'

@connect({
  me: 'me',
  orders: 'api.subsets.orders.data'
})
export default class AdminOrdersComponent extends DataComponent {
  static displayName = 'AdminOrdersComponent'
  static propTypes = {
    me: PropTypes.map.isRequired,
    orders: PropTypes.list
  }

  componentDidMount () {
    this.refetch = setInterval(() => {
      this.resolveData()
    }, config.intervals.FETCH_ORDERS)
  }

  componentWillUnmount () {
    clearInterval(this.refetch)
  }

  resolveData () {
    actions.api.orders.find({
      subset: 'orders'
    })
  }

  render() {
    if (!this.props.orders) return null
    return (
      <div className='admin-orders-component block item-list'>
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
