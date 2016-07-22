import React from 'react'
import { PropTypes, connect } from 'shasta'
// import classes from 'classnames'
import DataComponent from 'shasta-data-view'
import actions from 'core/actions'
import Title from 'components/Title'
import InfiniteScroll from 'react-infinite'
import NewProduct from './NewProduct'
import './index.sass'

@connect({
  me: 'me',
  productcategories: 'api.subsets.productcategories.data',
  products: 'api.subsets.products.data'
})
export default class AdminProductsComponent extends DataComponent {
  static displayName = 'AdminProductsComponent'
  static propTypes = {
    me: PropTypes.map.isRequired,
    productcategories: PropTypes.list,
    products: PropTypes.list
  }

  static defaultState = {
    containerHeight: window.innerHeight - 200
  }

  static defaultProps = {
    elementHeight: 50
  }

  resolveData () {
    actions.api.productcategories.find({
      subset: 'productcategories'
    })
    actions.api.productsources.find({
      subset: 'products'
    })
  }

  render() {
    if (!this.props.products) return null
    return (
      <div className='admin-products-component block item-list'>
      <Title> Products </Title>
      <div className='hr' />
      <NewProduct productcategories={this.props.productcategories} />

      <InfiniteScroll
        className='list-component'
        containerHeight={this.state.containerHeight}
        infiniteLoadBeginEdgeOffset={250}
        elementHeight={this.props.elementHeight}>
        {
          this.props.products.map((item) => {
            return (
              <div
                style={{ height: this.props.elementHeight }}
                key={item.get('id')}
                className='list-item'>
                <img className='image' src={item.get('image')} />
                {item.get('name')}
              </div>
            )
          })
        }

      </InfiniteScroll>
      </div>
    )
  }
}
