// Import the dependencies for testing
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
const baseAPI = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Ip Address", () => {
  let authToken;

  before(() => {
    return new Promise((resolve, reject) => {
      chai.request(app)
        .post(baseAPI+'/users/login')
        .set('content-type', 'application/json')
        //Ensure you create this user manually and that it is an admin user.
        .send({email: 'w@w.com', password: 'asdasdasd'})
        .then((res) => {
          res.should.have.status(200);
          res.text.should.have.lengthOf.above(10);
          authToken = res.text;
          resolve();
        });
    });
  });

  let fakeIp =  Math.floor(Math.random() * 255) +'.'+Math.floor(Math.random() * 255)+'.'+Math.floor(Math.random() * 255)+'.'+Math.floor(Math.random() * 255);

  describe("POST /ip-address/create", () => {
    it("should create an ip address", (done) => {
      chai.request(app)
        .post(baseAPI+'/ip-address/create')
        .set('content-type', 'application/json')
        .send({name:"Ip custom", ip : fakeIp ,gateway:"192.168.0.0",mask:"255.255.255.0"})
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });

    it("should fail as there the ip-address already exists", (done) => {
      chai.request(app)
        .post(baseAPI+'/ip-address/create')
        .set('content-type', 'application/json')
        .send({name:"Ip custom", ip : fakeIp,gateway:"192.168.0.0",mask:"255.255.255.0"})
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          done();
        });
    });

  });

  describe("GET /ip-address/list", () => {
    it("should list all images", (done) => {
      chai.request(app)
        .get(baseAPI+'/ip-address/list')
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          for (let obj in res.data) {
            obj.should.be.an('object');
            obj.should.have.property('_id');
            obj.should.have.property('ip');
            obj.should.have.property('mask');
            obj.backedBy.should.be.an('gateway');
            obj.backedBy.should.have.property('state');
          }
          done();
        });
    });

  });

});