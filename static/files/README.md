Put documents here.

Anything in this folder is published as-is at `/files/...` and gets a browsable
listing at `/browse/...`. Sub-folders are fine and nest to any depth.

Names are checked at build time, and an unusable one stops the build rather
than being quietly skipped:

  Folders  start with a letter or digit, then letters, digits, spaces,
           and . - _
  Files    start with a letter or digit, then letters, digits, spaces,
           and . - _ ( ) ' ,

Accents and non-Latin scripts are fine anywhere -- `café`, `报告`. What is not
allowed is punctuation that means something in a URL (# ? % & = +) or that
renders deceptively. Folders are stricter than files because a folder name
becomes part of a route, where SvelteKit reads [ ] ( ) and a leading + as
syntax.

This README is not shown in the listing.
