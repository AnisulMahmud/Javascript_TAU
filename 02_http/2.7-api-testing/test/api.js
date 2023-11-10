// See https://www.npmjs.com/package/chai
const chai = require('chai');
// See https://www.npmjs.com/package/chai-http
const chaiHttp = require('chai-http');
// Your server implementation
const server = require('../index.js');
// Using 'should' style, see: https://www.chaijs.com/guide/styles/#should
const should = chai.should();
const fs = require('fs');

// Read the files that the server responses should be equal to
const index = fs.readFileSync('index.html').toString();
const homer = fs.readFileSync('homer.html').toString();
const bradbury = fs.readFileSync('bradbury.html').toString();

// Tell Chai to use the chai-http middleware (or plugin in Chai's own vocabulary)
chai.use(chaiHttp);

describe('Going through the routes', () => {
  /*
   * Test GET random route, should get an empty 404 response
   */
  describe('GET random path', () => {
    it('it should receive a 404 response', (done) => {
      chai.request(server)
        .get('/just_an_example_random_path_to_get_a_404')
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eql('');
          done();
        });
    });
  });

  /*
   * Test the / route, should get index.html
   */
  describe('GET / path', () => {
    it('it should GET the index.html', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          res.text.should.be.eql(index);
          done();
        });
    });
  });

  /*
   * Test the /homer route, should receive homer.html
   */
  describe('GET /homer path', () => {
    // TODO modify the it statement to use the function that has been 
    // commented out below.
    // You also need to uncomment the needed parts.
    // As the result the status of the test should go from 'pending' to 'passing'
    // Even thou just leaving the function inside <em>end</em> method will pass,
    //  you must write the tests as described in the TODO inside the end method.
    it('it should GET the homer.html', (done) => {
         chai.request(server)
             .get('/homer')
            .end((err, res) => {
                // TODO: test that 
                res.should.have.status(200);
                res.should.be.html;
                res.text.should.be.eql(homer)
                  done();
             });

            });
  });

  /*
   * Test the /bradbury route, should receive bradbury.html
   */
  describe('GET /bradbury path', () => {

    it('it should GET the bradbury.html', (done) => {
      chai.request(server)
          .get('/bradbury')
         .end((err, res) => {
             // TODO: test that 
             res.should.have.status(200);
             res.should.be.html;
             res.text.should.be.eql(bradbury)
               done();
          });

         });
});


});