# Oren Query [![Build Status](https://travis-ci.org/bookyacom/oren-query.svg?branch=master)](https://travis-ci.org/bookyacom/oren-query)

> Simple ORM for Oriento with find, create, update and delete of document, edge and vertex

## Quickstart

    let Query = require('oren-query');

    let query = new Query(db /* .. this is orientjs .. */);

    query
      .raw('SELECT * FROM Users WHERE email = %s').param('soggie@gmail.com')
      .go()
      .then(function (rs) {
        console.log(rs);
      })
      .catch(function (err) {
        console.log(err);
      });

## Using the query builder

