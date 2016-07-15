import React from 'react'
import { PropTypes, Component } from 'shasta'
import actions from 'core/actions'
import classes from 'classnames'
import moment from 'moment'
import { Icon } from 'react-fa'
import { Map } from 'immutable'

export default class ProductItem extends Component {
  static displayName = 'ProductItem'
  static defaultState = {
    dirty: false,
    item: Map()
  }
  static propTypes = {
    item: PropTypes.map,
    toggleActiveItem: PropTypes.func,
    resolveData: PropTypes.func,
    activeElementHeight: PropTypes.number,
    elementHeight: PropTypes.number
  }

  componentWillMount () {
    this.setState({item: this.props.item})
  }

  componentWillReceiveProps ({ item }) {
    if (this.state.item.get('active')) item = item.set('active', true)
    this.setState({ item })
  }

  saveItem () {
    actions.api.orders.updateById({
      subset: `order-${this.props.item.get('id')}`,
      params: {
        id: this.props.item.get('id')
      },
      body: this.state.item.toJS()
    })
    this.setState({dirty: false})
  }

  deleteItem () {
    if(confirm('are you sure you want to delete this order?')) {
      actions.api.orders.deleteById({
        params: {
          id: this.props.item.get('id')
        }
      })
      setTimeout(() => {
        this.props.resolveData()
      }, 500)
    }
  }

  toggleActiveItem () {
    let { item } = this.state
    this.setState({item: item.set('active', !this.state.item.get('active'))}, () =>
      this.props.toggleActiveItem(item)
    )
  }

  handleInput (e) {
    let { item } = this.state
    let obj = {
      dirty: true,
      item: item.set(e.target.name, e.target.value)
    }
    this.setState(obj)
  }

  handleKeyDown (e) {
    if (e.keyCode !== 13) return
    this.saveItem()
  }

  render () {
    const { item } = this.state
    return (
      <div
        style={{
          height: item.get('active') ? this.props.activeElementHeight :
            this.props.elementHeight
        }}
        className='list-item'>
        <button
          onClick={() => this.toggleActiveItem()}
          className='button row blue narrow'>
          <Icon name='expand' />
          </button>
        <div
          onClick={() => this.toggleActiveItem()}
          className='row input'>
          {`${item.getIn(['user', 'first'])} ${item.getIn(['user', 'last'])}`}
        </div>
        <div className='row input'>
          {item.getIn(['user', 'phone'])}
        </div>
        <div className='row input'>
          {moment(new Date(item.get('created'))).format(' MM DD YYYY - hh:mm')}
        </div>

        <div className='row narrow'>
          <button
            className={classes('button blue', {
              green: this.state.dirty
            })}
            onClick={this.saveItem}>
            save
            </button>
        </div>
        <div className='row narrow'>
          <button
            className={classes('button red')}
            onClick={this.deleteItem}>
            X
            </button>
        </div>
      </div>
    )
  }
}
