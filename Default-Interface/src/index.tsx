import React from 'react';
import ReactDOM from 'react-dom';
import {Bezier} from './Bezier';
import {YProjection} from './Components/YProjection';
import {D3Canvas} from './Components/D3View';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import './Style/index.css';
import rootReducer from './Storage';

const store = createStore(rootReducer);

ReactDOM.render(
  <div className={'Field'}>
    <Provider store={store}>
      <React.StrictMode>
        <div className={'Second'}>
          <Bezier />
          <YProjection />
          <D3Canvas />
        </div>
      </React.StrictMode>
    </Provider>
  </div>,
  document.getElementById('root'),
);

serviceWorker.unregister();
