import test from 'tape'
import React from 'react'
import { shallow } from 'enzyme'

import App from '../client/components/App'

test('<App />', t => {
  const expected = 'Harvestr'
  const wrapper = shallow(React.createElement(App))
  t.deepEqual(wrapper.text(), expected)
  t.end()
})
