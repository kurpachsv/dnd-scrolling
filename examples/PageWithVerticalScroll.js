import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import update from 'immutability-helper';

import Layout from './Layout';

class PageWithVerticalScroll extends React.PureComponent {
    static propTypes = {};
    static defaultProps = {};
    state = {
        items: _.times(100),
    };

    moveItem = (id, atIndex) => {
        const {item, index} = this.findItem(id);

        this.setState(update(this.state, {
            items: {
                $splice: [
                    [index, 1],
                    [atIndex, 0, item],
                ],
            },
        }));
    };

    findItem = (id) => {
        const {items} = this.state;
        const item = id;

        return {
            item,
            index: items.indexOf(item),
        };
    };

    render() {
        return (
            <Layout 
                items={this.state.items}
                findItem={this.findItem}
                moveItem={this.moveItem}
            />
        );
    }
}

export default PageWithVerticalScroll;
