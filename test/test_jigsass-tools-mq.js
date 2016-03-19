'use strict';

/* global assert, fs, path, Sassaby,  */

describe('jigsass-tools-mq', () => {
  const file = path.resolve(__dirname, 'helpers/importer.scss');
  const sassaby = new Sassaby(file);

  describe('_jigsass-mq-px2em [function]', () => {
    describe('Invalid values', () => {
      it('Throws an error when `$px` is not a number', () => {
        assert.throws(() => {
          sassaby.func('_jigsass-mq-px2em').calledWithArgs('string');
        });
      });

      describe('Non convertible length units', () => {
        it('Throws an error when `$px` is defined in rem',() => {
          assert.throws(() => {
            sassaby.func('_jigsass-mq-px2em').calledWithArgs('1rem');
          });
        });

        it('Throw an error when `$px` is defined in vw',() => {
          assert.throws(() => {
            sassaby.func('_jigsass-mq-px2em').calledWithArgs('1vw');
          });
        });

        it('Throw an error when `$px` is defined in vh',() => {
          assert.throws(() => {
            sassaby.func('_jigsass-mq-px2em').calledWithArgs('1vh');
          });
        });

        it('Throw an error when `$px` is defined in percents',() => {
          assert.throws(() => {
            sassaby.func('_jigsass-mq-px2em').calledWithArgs('1%');
          });
        });
      });
    });

    describe('Conversions', () => {
      it('Converts unitless numbers into pixels', () => {
        sassaby.func('_jigsass-mq-px2em').calledWithArgs('24', '$supress-warnings: true').equals('1.5em');
      });

      it('Convert pixel values to ems', () => {
        sassaby.func('_jigsass-mq-px2em').calledWithArgs('24px').equals('1.5em');
      });

      it('Does not transform em values.', () => {
        sassaby.func('_jigsass-mq-px2em').calledWithArgs('3em', '24px').equals('3em');
      });
    });
  });

  describe('jigsass-mq-get-breakpoint-width [function]', () => {
    it('Gets breakpoint width from default map', () => {
      sassaby.func('jigsass-mq-get-breakpoint-width')
        .calledWithArgs('tiny')
        .equals('320px');
    });
    it('Gets breakpoint width from a custom map', () => {
      sassaby.func('jigsass-mq-get-breakpoint-width')
        .calledWithArgs('phone', '$alt-bps')
        .equals('320px');
    });
  });


  describe('jigsass-mq-sort-length-breakpoints [function]', () => {
    const sassaby = new Sassaby(file, {
      variables: {
        'jigsass-breakpoints': '(' +
          'lengths: (' +
            'large: 2400px, ' +
            'small: 320px, ' +
            'medium: 620px, ' +
          '),' +
          'features: (' +
            'landscape: (orientation: landscape), ' +
          ')' +
        ')',
        'bps': '(' +
          'lengths: (' +
            'large: 1400px, ' +
            'small: 320px, ' +
            'medium: 620px, ' +
          '),' +
          'features: (' +
            'landscape: (orientation: landscape), ' +
          ')' +
        ')'
      }
    })

    it('Gets breakpoint width from default map', () => {
      sassaby.func('inspect')
        .calledWithArgs('jigsass-mq-sort-length-breakpoints()')
        .equals('(small:320px,medium:620px,large:2400px)');
    });

    it('Gets breakpoint width from a custom map', () => {
      sassaby.func('inspect')
        .calledWithArgs('jigsass-mq-sort-length-breakpoints(map-get($bps, lengths))')
        .equals('(small:320px,medium:620px,large:1400px)');
    });

    it('Throws when one of the keys\' value is not a number' , () => {
      assert.throws(
        () => {
          sassaby.func('inspect')
            .calledWithArgs('jigsass-mq-sort-length-breakpoints($bps)')
        },
        /jigsass-mq-sort-length-breakpoints: Length breakpoints must resolve to numbers, but `lengths` is `\(large: 1400px, small: 320px, medium: 620px\)`, which is a `map`/
      );
    });
  });

  describe('jigsass-mq-breakpoint-defined [function]', () => {
    it('Returns true if a length breakpoint is defined', () => {
      sassaby.func('jigsass-mq-breakpoint-defined')
        .calledWithArgs('small')
        .isTrue();
    });

    it('Returns true if a misc feature breakpoint is defined', () => {
      sassaby.func('jigsass-mq-breakpoint-defined')
        .calledWithArgs('landscape')
        .isTrue();
    });

    it('Returns false if a breakpoint is not defined', () => {
      sassaby.func('jigsass-mq-breakpoint-defined')
        .calledWithArgs('bogus')
        .isFalse();
    });
  });

  describe('jigsass-get-default-breakpoint [function]', () => {
    it('Gets the default breakpoint', () => {
      sassaby.func('jigsass-get-default-breakpoint')
        .calledWithArgs('')
        .equals('default')
    });
  });

  describe('jigsass-mq [mixin]', () => {
    it('Changes the media type', () => {
      sassaby.standaloneMixin('jigsass-mq')
        .calledWithBlockAndArgs(
          '.test{ color: red; }',
          '$media-type: print'
        )
        .createsMediaQuery('print');
    });

    describe('Active breakpoint declaration', () => {
      it('Declares a named min-width breakpoint correctly', () => {
        sassaby.includedMixin('test-active-bp')
          .calledWithArgs('$from: tiny')
          .equals('active-before:default;active-after:default}@media(min-width:20em){.test{active-during:tiny}');
      });

      it('Does not declare a non-named min-width breakpoint correctly', () => {
        sassaby.includedMixin('test-active-bp')
          .calledWithArgs('$from: 320px')
          .equals('active-before:default;active-after:default}@media(min-width:20em){.test{active-during:default}');
      });
      it('Does not declare a named max-width breakpoint correctly', () => {
        sassaby.includedMixin('test-active-bp')
          .calledWithArgs('$until: tiny')
          .equals('active-before:default;active-after:default}@media(max-width:19.99em){.test{active-during:default}');
      });
      it('Does not declare a non-named max-width breakpoint correctly', () => {
        sassaby.includedMixin('test-active-bp')
          .calledWithArgs('$until: tiny')
          .equals('active-before:default;active-after:default}@media(max-width:19.99em){.test{active-during:default}');
      });
    });

    describe('Single condition', () => {
      it('Creates a min-width media query from a named length breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$from: tiny'
          )
          .createsMediaQuery('(min-width: 20em)');
      });

      it('Creates a min-width media query from a number', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$from: 320px'
          )
          .createsMediaQuery('(min-width: 20em)');
      });

      it('Creates a max-width media query from a named length breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$until: tiny'
          )
          .createsMediaQuery('(max-width: 19.99em)');
      });

      it('Creates a max-width media query from a number', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$until: 320px'
          )
          .createsMediaQuery('(max-width: 20em)');
      });

      it('Creates custom media query from a named feature breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$misc: landscape'
          )
          .createsMediaQuery('(orientation: landscape)');
      });

      it('Doesn\'t create meaningless min-width media query from a number', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$from: 0'
          )
          .equals('.test{color:red}');
      });

      it('Doesn\'t create meaningless min-width media query from a named breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$from: default'
          )
          .equals('.test{color:red}');
      });

      it('Doesn\'t create meaningless max-width media query from a named breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$until: default'
          )
          .equals('.test{color:red}');
      });
    });

    describe('Multiple conditions', () => {
      it('Creates a min and max-width media queries from named breakpoints', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$from: tiny, $until: small'
          )
          .createsMediaQuery('(min-width: 20em) and (max-width: 29.99em)');
      });
      it('Creates a min-width and misc media queries from named breakpoints', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$from: tiny, $misc: landscape'
          )
          .createsMediaQuery('(min-width: 20em) and (orientation: landscape)');
      });
      it('Creates multiple misc media queries', () => {
        sassaby.standaloneMixin('jigsass-mq')
          .calledWithBlockAndArgs(
            '.test{ color: red; }',
            '$misc: landscape "(min-color: 8)"'
          )
          .createsMediaQuery('(orientation: landscape) and (min-color: 8)');
      });
    });
  });

  describe('jigsass-mq-tweakpoints [mixin]', () => {
    describe('Extends the $jigsass-breakpoints', () => {
      it('Creates a new length breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
          .calledWithBlockAndArgs(
            '@include jigsass-mq(phone) {.test{ color: red; }}',
            '$tweakpoints: $alt-bps'
          )
          .createsMediaQuery('(min-width: 20em)');
      });
      it('Keeps existing length breakpoints', () => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
          .calledWithBlockAndArgs(
            '@include jigsass-mq(tiny) {.test{ color: red; }}',
            '$tweakpoints: $alt-bps'
          )
          .createsMediaQuery('(min-width: 20em)');
      });

      it('Creates a new feature breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
          .calledWithBlockAndArgs(
            '@include jigsass-mq($misc: 8bit) {.test{ color: red; }}',
            '$tweakpoints: $alt-bps'
          )
          .createsMediaQuery('(min-color: 8)');
      });
      it('Keeps existing feature breakpoints', () => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
          .calledWithBlockAndArgs(
            '@include jigsass-mq($misc: landscape) {.test{ color: red; }}',
            '$tweakpoints: $alt-bps'
          )
          .createsMediaQuery('(orientation: landscape)');
      });
    });

    describe('Can overwrite $jigsass-breakpoints', () => {
      it('Creates a new length breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
          .calledWithBlockAndArgs(
            '@include jigsass-mq(phone) {.test{ color: red; }}',
            '$tweakpoints: $alt-bps, $overwrite: true'
          )
          .createsMediaQuery('(min-width: 20em)');
      });

      it('Can overwrites existing length breakpoints', () => {
        // This raises a warning that is visible in test output.
        assert.throws(() => {
          sassaby.standaloneMixin('jigsass-mq-tweakpoints')
            .calledWithBlockAndArgs(
              '@include jigsass-mq(tiny) {.test{ color: red; }}',
              '$tweakpoints: $alt-bps, $overwrite: true'
            )
        });
      });

      it('Creates a new feature breakpoint', () => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
          .calledWithBlockAndArgs(
            '@include jigsass-mq($misc: 8bit) {.test{ color: red; }}',
            '$tweakpoints: $alt-bps, $overwrite: true'
          )
          .createsMediaQuery('(min-color: 8)');
      });
      it('Can overwrite existing feature breakpoints', () => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
          .calledWithBlockAndArgs(
            '@include jigsass-mq($misc: landscape) {.test{ color: red; }}',
            '$tweakpoints: $alt-bps, $overwrite: true'
          )
          .doesNotCreateMediaQuery('(orientation: landscape)');
      });
    });

    it('Extends only the default lengths breakpoints map', () => {
      sassaby.standaloneMixin('jigsass-mq-tweakpoints')
        .calledWithBlockAndArgs(
          '@include jigsass-mq(phone) {.test{ color: red; }}',
          '$length-tweakpoints: map-get($alt-bps, lengths)'
        )
        .createsMediaQuery('(min-width: 20em)');
    });

    it('Extends only the default features breakpoints map', () => {
      sassaby.standaloneMixin('jigsass-mq-tweakpoints')
        .calledWithBlockAndArgs(
          '@include jigsass-mq($misc: 8bit) {.test{ color: red; }}',
          '$feature-tweakpoints: map-get($alt-bps, features)'
        )
        .createsMediaQuery('(min-color: 8)');
    });

    it('Can overwrite the default lengths breakpoints map', () => {
      // This raises a warning that is visible in test output.
      assert.throws(() => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
        .calledWithBlockAndArgs(
          '@include jigsass-mq(small) {.test{ color: red; }}',
          '$length-tweakpoints: map-get($alt-bps, lengths), $overwrite: true'
        )
      });
    });

    it('Can overwrite the default features breakpoints map', () => {
      // This raises a warning that is visible in test output.
      assert.throws(() => {
        sassaby.standaloneMixin('jigsass-mq-tweakpoints')
        .calledWithBlockAndArgs(
          '@include jigsass-mq(landscape) {.test{ color: red; }}',
          '$feature-tweakpoints: map-get($alt-bps, features), $overwrite: true'
        )
      });
    });
  });
});
