# Typescript Boilerplate

A starting point for creating static websites with typescript.

Based on [Boilerplate](https://github.com/jadnco/static-boilerplate) by [Jaden Dessureault](https://github.com/jadnco)

Features:
* Typescript
* Sass/SCSS
* Handlebars templating
* ES6 minification & bundling
* Live injection/reload with BrowserSync 

### Getting Started

Clone the repo using `git clone` or by clicking the *Download ZIP* button to the right.

```sh
git clone https://github.com/konsorten/static-boilerplate-ts.git
```

Navigate to the directory to where it was cloned.

```sh
cd boilerplate-ts
```

Install all dependencies using yarn:

```sh
yarn install
```

Run the default Gulp task to get started:

```sh
gulp
```

BrowserSync will automagically inject any changes you make to the stylesheets. You can view the website at one of the given access URLs:

```sh
[BS] Access URLs:
 ----------------------------------
       Local: http://localhost:3000
    External: http://10.0.X.XX:3000
 ----------------------------------
```

If you are working within a GitHub repo you can deploy your project, at any time, to a `gh-pages` branch by running:

```sh
gulp deploy
```

### Credits

- Based on [Boilerplate](https://github.com/jadnco/static-boilerplate) by [Jaden Dessureault](https://github.com/jadnco)
- Responsive grid from [Skeleton](http://getskeleton.com) by [Dave Gamache](https://github.com/dhg)

