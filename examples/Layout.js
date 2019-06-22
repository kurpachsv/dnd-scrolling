import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import LayoutItem from './LayoutItem';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import withScrolling from '../src';

const ScrollingContainer = withScrolling('div');

class Layout extends React.PureComponent {
    static propTypes = {
        items: PropTypes.array.isRequired,
        findItem: PropTypes.func.isRequired,
        moveItem: PropTypes.func.isRequired,
    };
    static defaultProps = {};
    state = {};
    
    render() {
        return (
            <ScrollingContainer>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }}>
                    {this.props.items.map((el, index) => {
                        return (
                            <LayoutItem 
                                key={el}
                                id={el}
                                moveItem={this.props.moveItem}
                                findItem={this.props.findItem}
                            />
                        )
                    })}
                </div>
            </ScrollingContainer>
        )
    }
}

export default DragDropContext(HTML5Backend)(Layout);