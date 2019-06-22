import React from 'react';
import {storiesOf} from '@storybook/react';
import PageWithVerticalScroll from '../examples/PageWithVerticalScroll';

storiesOf('PageWithVerticalScroll', module)
    .add('with Vertical Scrolling', () => (
        <PageWithVerticalScroll />
    )); 