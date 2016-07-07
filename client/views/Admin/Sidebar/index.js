import React from 'react'
import { Component, PropTypes } from 'shasta'
import request from 'superagent'
import { Icon } from 'react-fa'
import Title from 'components/Title'
import ListItems from './ListItems'
import './index.sass'

export default class SidebarView extends Component {
  static displayName = 'SidebarView'
  static propTypes = {
    me: PropTypes.map.isRequired
  }
  static contextTypes = {
    router: PropTypes.object
  }

  logout () {
    request
      .delete('/auth/logout')
      .end(() => window.location = '/')
  }

  render() {
    if (!this.props.me) return null
    return (
      <div className='sidebar-component'>
        <div className='header'>
          <Title> {this.props.me.get('first')} </Title>
        </div>
        <ListItems items={[
          {
            to: '/admin/orders',
            name: 'Orders'
          },
          {
            to: '/admin/users',
            name: 'Users'
          }
        ]} />
        <div className='footer'>
          <button
            onClick={this.logout}
            className='button logout'>
              <Icon name='sign-out' />
            </button>
        </div>
      </div>
    )
  }
}

