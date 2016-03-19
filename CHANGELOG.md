# Jigsass Mq Changelog

## v1.4.0
Add `jigsass-mq-sort-length-breakpoints` function.

## v1.3.0
Add `jigsass-mq-get-breakpoint` function to check if a named breakpoint is defined.

## v1.2.5
Prepare for deprecation of `_get-default-breakpoint`.
Add `jigsass-get-default-breakpoint`, and make `_get-default-breakpoint` an 
alias to it.

Add a deprecation warning to `_get-default-breakpoint`.

Add tests for `jigsass-get-default-breakpoint`.

Update documentation.

## v1.2.4
Don't generate (max-width: 0) media queries

## v1.2.3
Fix a typo in name of static breakpoint

## v1.2.2
Fix a bug in `max-width` media queries

## v1.2.1
  - Fix bug which caused meaningless media queries to be outputted
  - Fix tests for meaningless media queries

## v1.2.0
Check for dependencies, but don't directly import them

## v1.1.0
Store the name of the currently active `min-width` breakpoint in 
`$jigsass-mq-active-breakpoint`
