const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
    .react() // <--- Enable React
    .sass('resources/css/app.scss', 'public/css');