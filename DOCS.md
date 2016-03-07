# JigSass Tools Mq
[![NPM version][npm-image]][npm-url]  [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]   

 > Easy peasy media queries. Based on [Kaelig's Sass-mq](https://github.com/sass-mq/sass-mq), 
 > with a few minor adjustments for JigSass

## Installation

Using npm (supports [eyeglass](https://github.com/sass-eyeglass/eyeglass)):

```sh
npm i -S jigsass-tools-mq
```

Or [download](https://raw.githubusercontent.com/TxHawks/jigsass-tools-mq/master/scss/index.scss)

## Usage
`scss/index.scss` is JigSass Tools Mq's importable file.

`@import 'path/to/jigsass-tools-mq/scss/index.scss';` should give you all you need.

### Overriding defaults

Override default named breakpoints with your own by defining the 
`jigsass-breakpoints` variable **before** `jigsass-mq` is imported:

Breakpoint names and values can and should be redefined to fit a
project design and the language used be the team working on it.
However, please keep in mind that **the JigSass framework depends
on a 0-sized length breakpoint being defined**, as it is internally
used to set up default values in several places.

```scss
// The `jigsass-mq` mixin will try and resolve values from 
// the `lengths` sub-map when evaluating the `$from` and 
// `$until` arguments. When evaluating the `$misc` argument, 
// it will try and resolve values from the `features` sub-map.
$jigsass-breakpoints: (
  lengths: (
    default: 0,
    tiny: 320px,
    small: 480px,
    meduim: 600px,
    large: 1024px,
    x-large: 1280px,
  ),

  features: (
    landscape: '(orientation: landscape)',
    partrait: '(orientation: portrait)',
    hidpi: '(-webkit-min-device-pixel-ratio: 1.3),
            (min-resolution: 120dpi),
            (min-resolution: 1.3dppx)',
  ),
);

@import 'path/to/jigsass-tools-mq/scss/index.scss';
```

### Basic usage

The `jigsass-mq` mixin takes optional arguments to generate `min-width`, `max-width`, media-type 
and miscellaneous media queries:

`$from`: min-width
`$until`: max-width (exclusive, value of named breakpoint - 1)
`$misc`: miscellaneous features, can take a list of multiple features.
`$media-type`: A media type, i.e `print`, `handheld`, `screen`, etc.

```scss
.responsive {
color: red;
  @include jigsass-mq($from: small, $misc: landscape '(min-color: 8)') {
    color: pink
  }
}
```
Will compile to:
```css
.responsive {
  color: red;
}

@media (min-width: 30em) and (orientation: landscape) and (min-color: 8) {
  .responsive {
    color: pink;
  }
}
```

**License:** MIT



[npm-image]: https://badge.fury.io/js/jigsass-tools-mq.svg
[npm-url]: https://npmjs.org/package/jigsass-tools-mq

[travis-image]: https://travis-ci.org/TxHawks/jigsass-tools-mq.svg?branch=master
[travis-url]: https://travis-ci.org/TxHawks/jigsass-tools-mq
[daviddm-image]: https://david-dm.org/TxHawks/jigsass-tools-mq.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/TxHawks/jigsass-tools-mq
