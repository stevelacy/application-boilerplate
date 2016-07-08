import React from 'react'
import { Component, PropTypes, connect } from 'shasta'
import DocumentMeta from 'react-document-meta'
import Sidebar from './Sidebar'
import './index.sass'

@connect({
  me: 'me'
})
export default class AdminView extends Component {
  static displayName = 'AdminView'
  static propTypes = {
    me: PropTypes.map.isRequired,
    children: PropTypes.node,
    location: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount () {
    if (!this.props.me.get('id') || this.props.me.get('role') !== 'admin') {
      return this.context.router.push('/account')
    }
    if (this.props.location.pathname === 'admin')
      this.context.router.push('/admin/orders')
  }

  render() {
    return (
      <div className='admin-view'>
        <DocumentMeta title='Admin' />
        <Sidebar me={this.props.me} />
        <div className='content-pane'>
          {this.props.children}
        </div>

      </div>
    )
  }
}
