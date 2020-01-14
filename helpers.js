const hbs = require('hbs');

hbs.registerHelper('if_presentando', function(presentacion, options) {
  if(presentacion === true) {
    return options.fn(this);
  }
  return options.inverse(this);
});