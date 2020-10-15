import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Bezier} from './Bezier';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import rootReducer from './Storage';

import './Style/index.css';

const store = createStore(rootReducer);

ReactDOM.render(
  <div className={'Field'}>
    <Provider store={store}>
      <React.StrictMode>
        <div className={'First'}>
          <App />
        </div>
        <div className={'Second'}>
          <Bezier />
        </div>
      </React.StrictMode>
    </Provider>
  </div>,
  document.getElementById('root'),
);

serviceWorker.unregister();
