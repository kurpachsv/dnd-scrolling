import React from 'react';
import {storiesOf} from '@storybook/react';
import PageWithScroll from '../examples/PageWithScroll';

storiesOf('Examples', module)
    .add('with scrolling', () => (
        <PageWithScroll />
    )); 