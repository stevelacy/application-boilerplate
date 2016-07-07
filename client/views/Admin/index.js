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
    children: PropTypes.node
  }
  static defaultState = {
    OrderData: []
  }
  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount () {
    if (!this.props.me.get('id') || this.props.me.get('role') !== 'admin') {
      return this.context.router.push('/account')
    }
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
