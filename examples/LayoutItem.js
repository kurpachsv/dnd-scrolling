import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import {
    DragSource,
    DropTarget,
} from 'react-dnd';

const dragSourceCollect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
});

const itemSource = {
    beginDrag(props) {
        return {
            id: props.id,
            originalIndex: props.findItem(props.id).index,
        };
    },
};

const itemTarget = {
    hover(props, monitor) {
        const {id: draggedId} = monitor.getItem();
        const {id: overId} = props;

        if (draggedId !== overId) {
            const {index: overIndex} = props.findItem(overId);
            props.moveItem(draggedId, overIndex);
        }
    },
};

const dropTargetCollect = (connect) => {
    return {
        connectDropTarget: connect.dropTarget(),
    };
};

class LayoutItem extends React.PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
        findItem: PropTypes.func.isRequired,
        moveItem: PropTypes.func.isRequired,
    };
    static defaultProps = {};
    state = {};

    render() {
        const {connectDragSource, connectDropTarget} = this.props;
        return connectDragSource(
            connectDropTarget(
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    margin: '20px',
                    width: '200px',
                    height: '250px',
                    backgroundColor: '#00a39e',
                    border: '8px dotted #000000',
                    fontSize: '18px',
                }}>
                    {this.props.id}
                </div>
            )
        );
    }
}

export default _.flow(
    DragSource('LayoutItem', itemSource, dragSourceCollect),
    DropTarget('LayoutItem', itemTarget, dropTargetCollect)
)(LayoutItem);