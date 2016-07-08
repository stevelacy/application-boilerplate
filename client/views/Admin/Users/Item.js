import React from 'react'
import { PropTypes, Component } from 'shasta'
import actions from 'core/actions'
import classes from 'classnames'
import { Map } from 'immutable'
import './index.sass'

export default class UserItem extends Component {
  static displayName = 'UserItem'
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

  saveItem () {
    actions.api.users.updateById({
      subset: `user-${this.props.item.get('id')}`,
      params: {
        id: this.props.item.get('id')
      },
      body: this.state.item.toJS()
    })
    this.setState({dirty: false})
  }

  deleteItem () {
    if(confirm('are you sure you want to delete this user?')) {
      actions.api.users.deleteById({
        params: {
          id: this.props.item.get('id')
        }
      })
      setTimeout(() => {
        this.props.resolveData()
      }, 500)
    }
  }

  handleInput (e) {
    let { item } = this.state
    let obj = {
      dirty: true,
      item: item.set(e.target.name, e.target.value)
    }
    this.setState(obj)
  }

  render () {
    const { item } = this.state
    return (
      <div
        onClick={() => this.props.toggleActiveItem(item)}
        style={{
          height: item.get('active') ? this.props.activeElementHeight :
            this.props.elementHeight
        }}
        className='list-item'>
        <input
          name='first'
          defaultValue={item.get('first')}
          onChange={this.handleInput}
          className='row input' />

        <input
          name='last'
          defaultValue={item.get('last')}
          onChange={this.handleInput}
          className='row input' />

        <div className='row'>
          {item.get('phone')}
        </div>
        <div className='row'>
          <button
            className={classes('button blue', {
              green: this.state.dirty
            })}
            onClick={() => this.saveItem()}>
            save
            </button>
        </div>
      </div>
    )
  }
}
