import * as React from 'react';
import * as ReactDOM from 'react-dom'

import {Memo} from './memo.component';

// Render a simple React h1 component into the body.
let element = document.createElement('div');
document.getElementsByTagName('body')[0].appendChild(element);
ReactDOM.render(<Memo></Memo>, element);
