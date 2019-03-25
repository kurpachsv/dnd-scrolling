import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

export default (
    speed = 60,
    threshold = 100,
    noScrollAreaHeight = 600
) => (WrappedComponent) => {
    return class extends React.Component {
        static propTypes = {
            speed: PropTypes.number,
            threshold: PropTypes.number,
            noScrollAreaHeight: PropTypes.number,
        };
        static defaultProps = {
            speed,
            threshold,
            noScrollAreaHeight,
        };

        currentY = 0;

        getNoScrollAreaHeight() {
            return this.props.noScrollAreaHeight || window.innerHeight;
        }

        getScrollY = (clientY) => {
            const sign = Math.sign(clientY - this.currentY);
            return Math.round(sign * this.props.speed);
        };

        updateScrolling = throttle((e) => {
            if (e.clientY <= this.props.threshold ||
                e.clientY >= this.getNoScrollAreaHeight() - this.props.threshold) {
                window.scrollBy(0, this.getScrollY(e.clientY));
                this.currentY = e.clientY;
            }
        }, 50);

        componentDidMount() {
            window.document.body.addEventListener('dragover', this.updateScrolling);
        }

        componentWillUnmount() {
            window.document.body.removeEventListener('dragover', this.updateScrolling);
        }

        render() {
            const {
                // ignore decorator's props
                speed,
                threshold,
                boxHeight,
                ...props
            } = this.props;
            return <WrappedComponent {...props} />;
        }
    };
};
