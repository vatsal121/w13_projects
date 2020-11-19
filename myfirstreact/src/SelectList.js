import React from 'react'

class SelectList extends React.Component {

    render() {
        let { list } = this.props;
        return (
            <select>
                {list && list.map(item => {
                    return (<option key={item.code} value={item.code}>{item.name}</option>)
                })}
            </select>
        )
    }
}

export default SelectList;