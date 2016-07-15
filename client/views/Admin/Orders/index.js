import React from 'react'
import { PropTypes, connect } from 'shasta'
// import classes from 'classnames'
import DataComponent from 'shasta-data-view'
import actions from 'core/actions'
import config from 'config'
import InfiniteScroll from 'react-infinite'
import Item from './Item'
import Title from 'components/Title'

@connect({
  me: 'me',
  orders: 'api.subsets.orders.data'
})
export default class AdminOrdersComponent extends DataComponent {
  static displayName = 'AdminOrdersComponent'
  static propTypes = {
    me: PropTypes.map.isRequired,
    orders: PropTypes.list,
    elementHeight: PropTypes.number
  }

  static defaultState = {
    containerHeight: window.innerHeight - 200,
    items: null
  }

  static defaultProps = {
    elementHeight: 40,
    activeElementHeight: 200
  }

  componentDidMount () {
    if (this.props.orders) {
      this.setState({items: this.props.orders})
    }
    this.refetch = setInterval(() => {
      this.resolveData()
    }, config.intervals.FETCH_USERS)
  }

  componentWillReceiveProps (props) {
    this.setState({items: props.orders})
  }

  componentWillUnmount () {
    clearInterval(this.refetch)
  }

  resolveData () {
    actions.api.orders.find({
      subset: 'orders'
    })
  }

  toggleActiveItem (item) {
    this.setState({
      items: this.state.items.map((i) => {
        if (i.get('id') === item.get('id'))
          return i.set('active', !i.get('active'))
        return i
      })
    })
  }

  render() {
    if (!this.state.items) return null
    return (
      <div className='admin-orders-component block item-list'>
      <Title> Orders </Title>
      <div className='hr' />
      <div className='list-item'>
        <div className='row header narrow'> expand </div>
        <div className='row header'> user's name </div>
        <div className='row header'> phone </div>
        <div className='row header'> date </div>
        <div className='row header narrow'> save </div>
        <div className='row header narrow'> delete </div>
      </div>

      <InfiniteScroll
        className='list-component'
        containerHeight={this.state.containerHeight}
        infiniteLoadBeginEdgeOffset={250}
        onInfiniteLoad={this.handleInfiniteLoad}
        elementHeight={this.state.items.map((v) => v.active ? this.props.activeElementHeight : this.props.elementHeight).toJS()}>
        {
          this.state.items.map((item) => {
            return (
              <Item
                item={item}
                key={item.get('id')}
                activeElementHeight={this.props.activeElementHeight}
                elementHeight={this.props.elementHeight}
                toggleActiveItem={this.toggleActiveItem} />
            )
          })
        }
      </InfiniteScroll>
      </div>
    )
  }
}
