[![npm version](https://badge.fury.io/js/%40kurpachsv%2Fdnd-scrolling.svg)](https://badge.fury.io/js/%40kurpachsv%2Fdnd-scrolling)


# @kurpachsv/dnd-scrolling

Simple decorator which allow to scroll window in dnd dragging.

## Usage

```bash
npm i --save @kurpachsv/dnd-scrolling
```

```javascript
import allowScrolling from '@kurpachsv/dnd-scrolling';
```

And you can use this decorator in your component. For example:

```javascript
@allowScrolling(80)
class App extends React.Component {
    render() {}
}
```

`80` - it is a speed of scrolling.

## License

[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Copyright (c) Sergei Kurpach, 2019
