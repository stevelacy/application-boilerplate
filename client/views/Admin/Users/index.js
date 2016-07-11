import React from 'react'
import { PropTypes, connect } from 'shasta'
import DataComponent from 'shasta-data-view'
import InfiniteScroll from 'react-infinite'
import actions from 'core/actions'
import config from 'config'
// import classes from 'classnames'
import Title from 'components/Title'
import Item from './Item'
import './index.sass'

@connect({
  me: 'me',
  users: 'api.subsets.users.data'
})
export default class AdminUsersComponent extends DataComponent {
  static displayName = 'AdminUsersComponent'
  static propTypes = {
    me: PropTypes.map.isRequired,
    users: PropTypes.list,
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
    if (this.props.users) {
      this.setState({items: this.props.users})
    }
    this.refetch = setInterval(() => {
      this.resolveData()
    }, config.intervals.FETCH_USERS)
  }

  componentWillReceiveProps (props) {
    this.setState({items: props.users})
  }

  componentWillUnmount () {
    clearInterval(this.refetch)
  }

  resolveData () {
    actions.api.users.find({
      subset: 'users'
    })
  }

  handleInfiniteLoad () {
    // set limit and next + fetch new data
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
      <div className='admin-users-component block item-list'>
      <Title> Users </Title>
      <div className='hr' />
      <div className='list-item'>
        <div className='row header narrow'> expand </div>
        <div className='row header'> first </div>
        <div className='row header'> last </div>
        <div className='row header'> phone </div>
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
