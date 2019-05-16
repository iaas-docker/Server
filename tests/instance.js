// Import the dependencies for testing
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
const baseAPI = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Instances", () => {
  let authToken, instanceId;

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

  let imageId;
  before(() => {
    return new Promise((resolve, reject) => {
      let fakeIp =  Math.floor(Math.random() * 255) +'.'+Math.floor(Math.random() * 255)+'.'+Math.floor(Math.random() * 255)+'.'+Math.floor(Math.random() * 255);
      chai.request(app)
        .post(baseAPI+'/image/create/docker')
        .set('content-type', 'application/json')
        .send({name:"Ubuntu custom",operatingSystem:"Ubuntu 14.04",tag: Math.random().toString(36).substring(2, 15),dockerImageId:"7e9fdd3cf120"})
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          imageId = res.body._id;
          resolve();
        });
    });
  });

  describe("POST /instance/create-group", () => {

    it("Create an instance group", (done) => {
      chai.request(app)
        .post(baseAPI+'/instance/create-group')
        .set('content-type', 'application/json')
        .send({
          name: "Group 1",
          instances: [
            {
              name: "I1",
              cores: 1,
              ram: 500,
              memory: 1000,
              imageId: imageId
            }
          ]
        })
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name');
          res.body.should.have.property('instances');
          res.body.instances.should.be.an('array');
          res.body.instances.forEach(obj => {
            obj.should.be.an('object');
            obj.should.have.property('imageId');
            obj.should.have.property('userId');
            obj.should.have.property('instanceGroupId');
            obj.should.have.property('baseImageId');
            obj.baseImageId.should.equal(obj.imageId);
            obj.should.have.property('state');
            obj.state.should.equal('creating');
          });
          done();
        });
    });

    it("should fail as there is no image with that ID", (done) => {
      chai.request(app)
        .post(baseAPI+'/instance/create-group')
        .set('content-type', 'application/json')
        .send({
          name: "Group 1",
          instances: [
            {
              name: "I1",
              cores: 1,
              ram: 500,
              memory: 1000,
              imageId: '5cd8f0f7b455344f69bc48e8'
            }
          ]
        })
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          done();
        });
    });

  });


  describe("GET /instance/list", () => {

    it("should list all instances", (done) => {
      chai.request(app)
        .get(baseAPI+'/instance/list')
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('instance_groups');
          res.body.instance_groups.forEach(instanceGroup => {
            instanceGroup.should.be.an('object');
            instanceGroup.should.have.property('_id');
            instanceGroup.should.have.property('name');
            instanceGroup.should.have.property('userId');
            instanceGroup.should.have.property('instances');
            instanceGroup.instances.should.be.an('array');
            instanceGroup.instances.forEach(inst => {
              inst.should.have.property('_id');
              instanceId = inst._id;
              inst.should.have.property('imageId');
              inst.should.have.property('userId');
              inst.should.have.property('instanceGroupId');
              inst.should.have.property('baseImageId');
              inst.should.have.property('state');
              inst.should.have.property('physicalMachine');
            });
          });
          done();
        });
    });

  });

  describe("GET /instance/:id", () => {

    it("should list all instances", (done) => {
      chai.request(app)
        .get(baseAPI+'/instance/'+instanceId)
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('imageId');
          res.body.should.have.property('userId');
          res.body.should.have.property('instanceGroupId');
          res.body.should.have.property('baseImageId');
          res.body.should.have.property('state');
          res.body.should.have.property('physicalMachine');
          done();
        });
    });

    it("should fail as the instance doesn't exist", (done) => {
      chai.request(app)
        .get(baseAPI+'/instance/'+instanceId.slice(0, instanceId.length-2)+'dd')
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          done();
        });
    });

  });

});