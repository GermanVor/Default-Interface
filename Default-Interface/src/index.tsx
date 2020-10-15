import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import rootReducer from './Storage';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode></React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
