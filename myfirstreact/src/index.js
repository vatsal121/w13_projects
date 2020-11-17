import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
class Header extends React.Component {
  render() {
    return (<p>This is the Header component</p>)
  }
}
class Footer extends React.Component {
  render() {
    return (<p>This is the Footer component</p>)
  }
}
class Page extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <p>Hello World !</p>
        <Footer />
      </div>
    )
  }
}
ReactDOM.render(<Page />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
