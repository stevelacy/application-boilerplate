import React from 'react'
import { PropTypes, connect } from 'shasta'
// import classes from 'classnames'
import DataComponent from 'shasta-data-view'
import actions from 'core/actions'
import Title from 'components/Title'
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
    name: '',
    categoryId: '',
    description: '',
    gender: '',
    sku: '',
    image: '',
    enabled: true
  }

  // componentWillUnmount () {
  //   clearInterval(this.refetch)
  // }

  resolveData () {
    actions.api.productcategories.find({
      subset: 'productcategories'
    })
    actions.api.productsources.find({
      subset: 'products'
    })
  }

  handleInput (e) {
    let obj = {}
    obj[e.target.name] = e.target.value
    this.setState(obj)
  }

  handleSave () {
    actions.api.productsources.create({
      subset: 'product',
      body: this.state
    })
  }

  renderNewProduct () {
    return (
      <div className='new-product'>
        <input
          name='name'
          className='input'
          value={this.state.name}
          placeholder='product name'
          onChange={this.handleInput} />
        <input
          name='description'
          className='input'
          value={this.state.description}
          placeholder='product description'
          onChange={this.handleInput} />
        <input
          name='sku'
          className='input'
          value={this.state.sku}
          placeholder='product sku'
          onChange={this.handleInput} />
        <input
          name='image'
          className='input'
          value={this.state.image}
          placeholder='product image url'
          onChange={this.handleInput} />

        <select
          className='input'
          name='categoryId'
          onChange={this.handleInput}
          value={this.state.categoryId}>
          <option value='' disabled> choose category </option>
          {
            this.props.productcategories.map((item) => {
              return (
                <option
                  key={item.get('id')}
                  value={item.get('id')}>
                  {item.get('name') + '/' + item.get('category')}
                </option>
              )
            })
          }
          </select>

        <select
          className='input'
          name='gender'
          onChange={this.handleInput}
          value={this.state.gender}>
          <option value='' disabled> choose gender </option>
          <option value='female'> female </option>
          <option value='male'> male </option>
          <option value='male/female'> both </option>
        </select>
        <button
          className='button green'
          onClick={this.handleSave}>
          SAVE
          </button>
      </div>
    )
  }

  render() {
    if (!this.props.products) return null
    return (
      <div className='admin-products-component block item-list'>
      <Title> Products </Title>
      <div className='hr' />
      {this.renderNewProduct()}
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
