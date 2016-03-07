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

The `jigsass-mq` mixin stores the currently active `min-width` breakpoint in the 
`$jigsass-mq-active-breakpoint` variable, which is available to the `@content` during the 
execution of of the mixin.

When not in the context of a media query, `$jigsass-mq-active-breakpoint` is set to
the zero-width length breakpoint.

** The full documentation is available at 
[https://txhawks.github.io/jigsass-tools-mq/](https://txhawks.github.io/jigsass-tools-mq/)
or locally in the `sassdoc` directory. **


## Documention

#### Sass

Documentation of JigSass Tools Mq's Sass features is generated by [SassDoc](http://sassdoc.com).

Run `gulp serve:sassdoc` to fire up a live server serving the documentation.

To generate documentation from annotation in the source code, run `gulp sass:doc`.

To disable the generation of sass documentation, create an empty `noSassDoc`
file at the root jigsass-tools-mq directory.

## Development

It is a best practice for JigSass modules to *not* automatically generate css on `@import`, but 
rather have to user explicitly enable the generation of specific styles from the module.

Contributions in the form of pull-requests, issues, bug reports, etc. are welcome.
Please feel free to fork, hack or modify JigSass Tools Mq in any way you see fit.

#### Writing documentation

Good documentation is crucial for scalability and maintainability. When writing your module,
please do make sure that both its Sass functionality (functions, mixins, 
variables and placeholder selectors), as well as the CSS it generates (selectors, 
concepts, usage exmples, etc.) are well documented.

As mentioned above, the Sass is documented using SassDoc 
([Documention](http://sassdoc.com/annotations/)).

#### Running tests
`gulp lint` will, well, lint the contents scss files in the `scss` directory.

`gulp test` with run module's test using Mocha and Sassaby.

`gulp tdd` will watch both the Sass files and the test specs for changes, and will
run tests automatically upon them.

#### Writing tests

JigSass Tools Mq tests are written using [Sassaby](https://github.com/ryanbahniuk/sassaby)
and Mocha. Spec files are located in the `test` directory.

Mocha allows us to place a call to `before()` in the root of any test file and it 
will be run once, before all the other tests in every `test_*.js` file. 
We can also `require()` files and assign them to the global object to make them 
available to all `test_*.js` files. 

jigsass-tools-mq uses a file called `helper.js` can be used to set up mocha 
globals requires and `before()`.

In addition to Sassaby's testing functions, jigsass-tools-mq makes a few Sass
functions available to the test suite, for use inside Sassaby tests:

<dl>
  <dt>jig-var-equals($value, $var) -> {boolean}<dt>
  <dd>
		Check if a variable equals a value.<br />
		<strong>$value</strong> {*}: A value to compare the value of $var to.<br />
		<strong>$var</strong> {*}: The variable to test<br />
	</dd>
  <dt>jig-var-type-is($type, $var) -> {boolean}<dt>
  <dd>
		Check if a variable is of a certain type.<br />
		<strong>$type</strong> {string}: A type to compare with the type of $var.<br />
		<strong>$var</strong> {*}: The variable to test<br />
	</dd>
  <dt>jig-map-key-equals($value, $map, $keys...) -> {boolean}<dt>
  <dd>
		Check if a map's key is assigned a cerain value.<br />
		<strong>$value</strong> {*}:  A value to compare the value of a key in $map with.<br />
		<strong>$map</strong> {map}: The map to test.<br />
		<strong>$keys... </strong> {arglist}: A recursive chain of keys.<br />
	</dd>
  <dt>jig-map-key-type-is($type, $map, keys...) -> {boolean}<dt>
  <dd>
		Check if a map's key is of a certain type<br />
		<strong>$type</strong> {string}: A type to compare with the type of $var.<br />
		<strong>$map</strong> {map}: The map to test.<br />
		<strong>$keys... </strong> {arglist}: A recursive chain of keys.<br />
	</dd>
</dl>


## File structure
```bash
┬ ./
│
├─┬ scss/ 
│ └─ index.scss # The module's importable file.
│
├── sassdoc/    # Generated documentation 
│               # of the module's sass features
│
└─┬─ test/
  │
  ├─┬ helpers/
  │ │
  │ ├── importer.scss       # Used for easilty importing tested scss files
  │ │
  │ └── _test_helpers.scss  # JigSass's assertion helpers,
  │                         # for use inside Sassaby tests.
  │                         
  ├── helper.js              # Used for defining global `before()`
  │                          # functions and requiring modules.
  │                         
  └── test_jigsass-tools-mq  # Specs. Mocha will automatically 
                             # run all javascript files located
                             # in the `test` directory.
```

**License:** MIT



[npm-image]: https://badge.fury.io/js/jigsass-tools-mq.svg
[npm-url]: https://npmjs.org/package/jigsass-tools-mq

[travis-image]: https://travis-ci.org/TxHawks/jigsass-tools-mq.svg?branch=master
[travis-url]: https://travis-ci.org/TxHawks/jigsass-tools-mq
[daviddm-image]: https://david-dm.org/TxHawks/jigsass-tools-mq.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/TxHawks/jigsass-tools-mq
