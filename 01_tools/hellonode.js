const _ = require("lodash");
const ver = _.VERSION;
//console.log(ver);



var array = [ 'hello', 'goodbye', 'alpha', 'omega', 'edge', 'node'];
console.log(hithere.apply(this, array)) ;



function hithere(){
    let a= (_.head(array)  );
    let b= (_.last(array)  );

    let c= b.concat(" and ", a);

    return c;

}

module.exports = hithere;
