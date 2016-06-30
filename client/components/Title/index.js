import React from 'react'
import { PropTypes, Component } from 'shasta'
import classNames from 'classnames'
import './index.sass'

export class Title extends Component {
  static displayName = 'Title'
  static propTypes = {
    className: PropTypes.string,
    uppercase: PropTypes.bool
  }
  render() {
    const ourClass = classNames('title-component', this.props.className, {
      uppercase: this.props.uppercase
    })
    return <div {...this.props} className={ourClass} />
  }
}

export default Title
