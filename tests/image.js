// Import the dependencies for testing
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
const baseAPI = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Images", () => {
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

  let fakeTag =  Math.random().toString(36).substring(2, 15);

  describe("POST /image/create/docker", () => {
    it("should list all images", (done) => {
      chai.request(app)
        .post(baseAPI+'/image/create/docker')
        .set('content-type', 'application/json')
        .send({name:"Ubuntu custom",operatingSystem:"Ubuntu 14.04",tag: fakeTag,dockerImageId:"7e9fdd3cf120"})
        .set('auth_token', authToken)
        .end((err, res) => {
          console.log('File: image.js, Line 37', res.data);
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });

    it("should fail as there is already an image with the same tag", (done) => {
      chai.request(app)
        .post(baseAPI+'/image/create/docker')
        .set('content-type', 'application/json')
        .send({name:"Ubuntu custom",operatingSystem:"Ubuntu 14.04",tag: fakeTag,dockerImageId:"7e9fdd3cf120"})
        .set('auth_token', authToken)
        .end((err, res) => {
          console.log('File: image.js, Line 37', res.data);
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          done();
        });
    });

  });

  describe("GET /image/list", () => {
    it("should list all images", (done) => {
      chai.request(app)
        .get(baseAPI+'/image/list')
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          for (let obj in res.data) {
            obj.should.be.an('object');
            obj.should.have.property('type');
            obj.should.have.property('backedById');
            obj.should.have.property('backedBy');
            obj.backedBy.should.be.an('object');
            obj.backedBy.should.have.property('dockerImageId');
            obj.backedBy.should.have.property('tag');
            obj.backedBy.should.have.property('operatingSystem');
          }
          done();
        });
    });

  });

});