import React from 'react'
import { Component, PropTypes } from 'shasta'
import { Link } from 'react-router'
import './index.sass'

export default class ListItems extends Component {
  static displayName = 'ListItems'
  static propTypes = {
    items: PropTypes.array
  }

  render() {
    return (
      <div className='list-items-component'>
        {
          this.props.items.map((item) => {
            return (
              <Link
                activeClassName='active'
                key={item.to}
                to={item.to}>
                <div
                  className='list-item'>
                  {item.name}
                </div>
              </Link>
            )
          })
        }
      </div>
    )
  }
}
