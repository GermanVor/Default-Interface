import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {MainField} from './Components/MainField';
import rootReducer from './Storage';

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <div className="Fourth_lab">
                <MainField />
            </div>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root'),
);

serviceWorker.unregister();
