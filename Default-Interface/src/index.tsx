import React from 'react';
import ReactDOM from 'react-dom';
import {Bezier} from './Bezier';
import {Y_Projection} from './Components/Y_Projection';
import {D3_Canvas} from './Components/D3_View';
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
          <Y_Projection />
          <D3_Canvas />
        </div>
      </React.StrictMode>
    </Provider>
  </div>,
  document.getElementById('root'),
);

serviceWorker.unregister();
