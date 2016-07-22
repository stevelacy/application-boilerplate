import React from 'react'
import { PropTypes, Component } from 'shasta'
// import classes from 'classnames'
import actions from 'core/actions'
import './index.sass'

export default class AdminNewProduct extends Component {
  static displayName = 'AdminProductsComponent'
  static propTypes = {
    productcategories: PropTypes.list
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

  render () {
    if (!this.props.productcategories) return null
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
          className='button green uppercase'
          onClick={this.handleSave}>
          create
          </button>
      </div>
    )
  }
}
