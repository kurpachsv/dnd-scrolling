import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import raf from 'raf';
import {DndContext} from 'react-dnd';
import hoist from 'hoist-non-react-statics';

function createStrength(threshold = 100) {
    return function defaultVerticalStrength({
        y, h,
    }, point) {
        const buffer = Math.min(h / 2, threshold);
        const inBox = point.y >= y && point.y <= y + h;
        if (inBox) {
            if (point.y < y + buffer) {
                return (point.y - y - buffer) / buffer;
            }
            if (point.y > (y + h - buffer)) {
                return -(y + h - point.y - buffer) / buffer;
            }
        }
        return 0;
    };
}

const defaultVerticalStrength = createStrength();

function getCoords(e) {
    if (e.type === 'touchmove') {
        return {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
    }
    return {x: e.clientX, y: e.clientY};
}

export function createScrollingComponent(WrappedComponent) {
    class ScrollingComponent extends React.Component {
        static propTypes = {
            speed: PropTypes.number,
            noScrollingAreaHeight: PropTypes.number,
        };
        static defaultProps = {
            speed: 60,
            noScrollingAreaHeight: 600,
        };

        scaleY = 0;
        dragging = false;

        updateScrolling = throttle((e) => {
            if (!this.dragging) {
                return;
            }

            const coords = getCoords(e);
            const box = {
                y: 0, h: this.props.noScrollingAreaHeight,
            };
            this.scaleY = defaultVerticalStrength(box, coords);

            if (this.scaleY === 0) {
                this.stopScrolling();
                return;
            }

            if (!this.frame && this.scaleY) {
                this.startScrolling();
            }
        }, 100, {trailing: false});

        startScrolling() {
            const tick = () => {
                const {scaleY} = this;
                const {speed} = this.props;

                window.scrollBy(0, speed * scaleY);

                this.frame = raf(tick);
            };

            tick();
        }

        stopScrolling() {
            this.scaleY = 0;
            if (this.frame) {
                raf.cancel(this.frame);
                this.frame = null;
            }
        }

        handleMonitorChange() {
            const {dragDropManager} = this.props;
            const isDragging = dragDropManager
                .getMonitor()
                .isDragging();

            if (!this.dragging && isDragging) {
                this.dragging = true;
            } else if (this.dragging && !isDragging) {
                this.dragging = false;
                this.stopScrolling();
            }
        }

        componentDidMount() {
            window.document.body.addEventListener('dragover', this.updateScrolling);
            window.document.body.addEventListener('touchmove', this.updateScrolling);

            const {dragDropManager} = this.props;
            this.clearMonitorSubscription = dragDropManager
                .getMonitor()
                .subscribeToStateChange(() => this.handleMonitorChange());
        }

        componentWillUnmount() {
            window.document.body.removeEventListener('dragover', this.updateScrolling);
            window.document.body.removeEventListener('touchmove', this.updateScrolling);

            this.clearMonitorSubscription();
        }

        render() {
            const {
                // ignore decorator's props
                speed,
                noScrollingAreaHeight,
                dragDropManager,
                ...props
            } = this.props;
            return <WrappedComponent {...props} />;
        }
    }
    return hoist(ScrollingComponent, WrappedComponent);
}

export default function createScrollingComponentWithConsumer(WrappedComponent) {
    const ScrollingComponent = createScrollingComponent(WrappedComponent);
    return props => (
        <DndContext.Consumer>
            {({dragDropManager}) => (
                dragDropManager === undefined
                    ? null
                    : <ScrollingComponent {...props} dragDropManager={dragDropManager} />
            )}
        </DndContext.Consumer>
    );
}
