import React, { Component } from 'react';
import Search from './Search';
import Sort from './Sort';

class Control extends Component {
      render() {
            return (
                    <div>
                        {/* search*/}
                        <Search onSearch = { this.props.onSearch }/>
                        {/*Sort*/}
                        <Sort />
                    </div>
            );
      }
}

export default Control;
