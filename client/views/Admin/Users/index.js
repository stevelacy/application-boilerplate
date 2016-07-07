import React from 'react'
import { PropTypes, connect } from 'shasta'
// import classes from 'classnames'
import DataComponent from 'shasta-data-view'
import actions from 'core/actions'
import Title from 'components/Title'

@connect({
  me: 'me',
  users: 'api.subsets.users.data'
})
export default class AdminUsersComponent extends DataComponent {
  static displayName = 'AdminUsersComponent'
  static propTypes = {
    me: PropTypes.map.isRequired,
    users: PropTypes.list
  }

  resolveData () {
    actions.api.users.find({
      subset: 'users',
      tail: true
    })
  }

  render() {
    if (!this.props.users) return null
    return (
      <div className='admin-users-component block item-list'>
      <Title> Users </Title>
      <div className='hr' />
      {
        this.props.users.map((user) => {
          return (
            <div
              key={user.get('id')}
              className='item'>
              {user.get('first') + ' ' + user.get('last')}
            </div>
          )
        })
      }
      </div>
    )
  }
}
