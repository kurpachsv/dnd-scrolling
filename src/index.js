import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import raf from 'raf';
import {DndContext} from 'react-dnd';
import hoist from 'hoist-non-react-statics';

const DEFAULT_SPEED = 60;
const DEFAULT_AREA_HEIGHT = 600;
const DEFAULT_THRESHOLD = 100;
const TIMEOUT = 100;

function calcScale(threshold, startY, endY, point) {
    const inBox = point.y >= startY && point.y <= startY + endY;
    if (inBox) {
        if (point.y < startY + threshold) {
            return (point.y - startY - threshold) / threshold;
        }
        if (point.y > (startY + endY - threshold)) {
            return -(startY + endY - point.y - threshold) / threshold;
        }
    }
    return 0;
}

function getCoords(e) {
    return {
        x: e.clientX,
        y: e.clientY,
    };
}

export function createScrollingComponent(WrappedComponent) {
    class ScrollingComponent extends React.Component {
        static propTypes = {
            speed: PropTypes.number,
            area: PropTypes.number,
            threshold: PropTypes.number,
        };
        static defaultProps = {
            speed: DEFAULT_SPEED,
            area: DEFAULT_AREA_HEIGHT,
            threshold: DEFAULT_THRESHOLD,
        };

        state = {};

        scale = 0;
        dragging = false;

        updateScrolling = throttle((e) => {
            if (!this.dragging) {
                return;
            }

            const coords = getCoords(e);
            this.scale = calcScale(this.props.threshold, 0, this.props.area, coords);

            if (this.scale === 0) {
                this.stopScrolling();
                return;
            }

            if (!this.frame && this.scale) {
                this.startScrolling();
            }
        }, TIMEOUT);

        startScrolling() {
            const tick = () => {
                const {scale} = this;
                const {speed} = this.props;

                window.scrollBy(0, speed * scale);

                this.frame = raf(tick);
            };

            tick();
        }

        stopScrolling() {
            this.scale = 0;
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

            const {dragDropManager} = this.props;
            this.clearMonitorSubscription = dragDropManager
                .getMonitor()
                .subscribeToStateChange(() => this.handleMonitorChange());
        }

        componentWillUnmount() {
            window.document.body.removeEventListener('dragover', this.updateScrolling);

            this.clearMonitorSubscription();
        }

        render() {
            const {
                speed,
                area,
                dragDropManager,
                threshold,
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
