import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

export default (speed = 80) => (WrappedComponent) => {
    return class extends React.Component {
        static propTypes = {
            speed: PropTypes.number,
        };
        static defaultProps = {
            speed,
        };

        currentY = 0;

        getScrollY = (clientY) => {
            const sign = Math.sign(clientY - this.currentY);
            return Math.round(sign * this.props.speed);
        };

        updateScrolling = throttle((e) => {
            window.scrollBy(0, this.getScrollY(e.clientY));
            this.currentY = e.clientY;
        }, 50);

        componentDidMount() {
            window.document.body.addEventListener('dragover', this.updateScrolling);
        }

        componentWillUnmount() {
            window.document.body.removeEventListener('dragover', this.updateScrolling);
        }

        render() {
            const {
                speed, // ignore decorator's props
                ...props
            } = this.props;
            return <WrappedComponent {...props} />;
        }
    };
};
