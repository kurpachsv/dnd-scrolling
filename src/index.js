import React from 'react';
import _ from 'lodash';

export default () => (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.currentY = 0;
        }

        getScrollY(clientY) {
            const sign = Math.sign(clientY - this.currentY);
            return Math.round(sign * 80);
        }

        updateScrolling = _.throttle((e) => {
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
            return <WrappedComponent {...this.props} />;
        }
    };
};
