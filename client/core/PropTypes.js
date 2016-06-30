import { PropTypes as ReactPropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'

const PropTypes = {
  ...ImmutablePropTypes,
  ...ReactPropTypes
}
export default PropTypes
