import React from 'react';
import './header.css'

class Header extends React.Component {
    render() {
        let { companyName, authorName } = this.props;
        return (
            <nav className="navbar navbar-light bg-light">
                <span className="navbar-brand mb-0 h1 text-center">{companyName} <i className="text-info">{authorName}</i></span>
            </nav>
        )
    }
}

export default Header;