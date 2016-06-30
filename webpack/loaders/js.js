import path from 'path'
import { babel } from '../../package'

export default [
  {
    test: /\.jsx?$/,
    include: path.resolve(__dirname, '../../client'),
    loader: 'babel',
    query: {
      cacheDirectory: true,
      plugins: babel.plugins,
      presets: babel.presets,
      env: {
        development: {
          plugins: [
            [ 'react-transform', {
              // omit HMR plugin by default and _only_ load in hot mode
              transforms: [ {
                transform: 'react-transform-catch-errors',
                imports: [ 'react', 'redbox-react' ]
              } ]
            } ]
          ]
        }
      }
    }
  }
]
