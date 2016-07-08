import React from 'react'
import { PropTypes, connect } from 'shasta'
// import classes from 'classnames'
import DataComponent from 'shasta-data-view'
import actions from 'core/actions'
import Title from 'components/Title'

@connect({
  me: 'me',
  products: 'api.subsets.products.data'
})
export default class AdminProductsComponent extends DataComponent {
  static displayName = 'AdminProductsComponent'
  static propTypes = {
    me: PropTypes.map.isRequired,
    products: PropTypes.list
  }

  componentWillUnmount () {
    clearInterval(this.refetch)
  }

  resolveData () {
    actions.api.productcategories.find({
      subset: 'products'
    })
  }

  render() {
    if (!this.props.products) return null
    return (
      <div className='admin-products-component block item-list'>
      <Title> Products </Title>
      <div className='hr' />
      {
        this.props.products.map((order) => {
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
