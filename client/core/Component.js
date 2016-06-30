import { Component as ReactComponent } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

function bindClass (c) {
  return Object.getOwnPropertyNames(c.constructor.prototype)
    .filter((prop) => typeof c[prop] === 'function' && prop !== 'constructor')
    .forEach((method) => c[method] = c[method].bind(c))
}

export default class Component extends ReactComponent {
  static defaultState = {}
  constructor () {
    super (...arguments)
    this.state = {
      ...this.constructor.defaultState,
      ...this.state
    }
    bindClass(this)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }
}
