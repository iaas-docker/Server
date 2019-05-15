// Import the dependencies for testing
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
const baseAPI = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();
let authToken;

describe("Users", () => {

  let fakeMail =  Math.random().toString(36).substring(2, 15) +'@u.com';

  describe("POST /users/signup", () => {

    it("should create an user", (done) => {
      chai.request(app)
        .post(baseAPI+'/users/signup')
        .send({email: fakeMail,password:"asdasdasd",name:"fake user"})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('firebaseId');
          res.body.should.have.property('portusToken');
          res.body.should.have.property('_id');
          done();
        });
    });

    it("should throw an error as the user already exists", (done) => {
      chai.request(app)
        .post(baseAPI+'/users/signup')
        .send({email: fakeMail,password:"asdasdasd",name:"fake user"})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });

  });

  describe("POST /users/login", () => {

    it("should login successfully", (done) => {
      chai.request(app)
        .post(baseAPI+'/users/login')
        .set('content-type', 'application/json')
        .send({email: fakeMail, password: 'asdasdasd'})
        .then((res) => {
          res.should.have.status(200);
          res.text.should.have.lengthOf.above(10);
          done();
        });
    });

    it("should throw an error as the password is wrong", (done) => {
      chai.request(app)
        .post(baseAPI+'/users/login')
        .set('content-type', 'application/json')
        .send({email: fakeMail, password: 'poipoipoi'})
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });

  });
});