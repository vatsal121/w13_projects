import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Offices from './Offices';

import SelectList from "./SelectList";

import Header from './Header';
import Footer from './Footer'
import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// const provinces = [{ code: 'QC', name: 'Quebec' }, { code: 'ON', name: 'Ontario' }, { code: 'NB', name: 'New-Brunswick' }]

// const countries = [{ code: 'CA', name: 'Canada' }, { code: 'US', name: 'USA' }, { code: 'IN', name: 'India' }, { code: 'MX', name: 'Mexixo' }]

class Page extends React.Component {
  render() {
    return (
      <div>
        <Header companyName="Office Demo by " authorName="Vatsal Chauhan" />
        {/* <p>Hello World !</p>
        <SelectList list={provinces} />
        <SelectList list={countries} /> */}
        <Offices />
        <Footer authorName="Vatsal Chauhan" />
      </div>
    )
  }
}
ReactDOM.render(<Page />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
