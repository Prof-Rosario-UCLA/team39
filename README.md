# Team 39


## CountryGUESSR
A fact based country guessing game! Can you guess them all?

## Deployment

```
cd my-app
gloud app deploy --version1
```

## REST API

Two endpoints are available via the routes/api folder from SvelteKit
```
/api/countries

/api/facts

/api/facts?cca3=[cca3]
```

/api/countries takes no parameters and returns 195 independent countries and associated information about them. This call uses https://restcountries.com/v3.1/independent?status=true under the hood.

/api/facts returns country facts from the NeonDB datbase. If no parameters are specified all facts are returned. Takes 1 parameter cca3 which is a unique 3 letter country identifier that every country has.

