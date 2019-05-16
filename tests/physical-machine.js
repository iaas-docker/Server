// Import the dependencies for testing
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
const baseAPI = '/api/v1';
// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Physical Machine", () => {
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

  let ipAddressId;
  before(() => {
    return new Promise((resolve, reject) => {
      let fakeIp =  Math.floor(Math.random() * 255) +'.'+Math.floor(Math.random() * 255)+'.'+Math.floor(Math.random() * 255)+'.'+Math.floor(Math.random() * 255);
      chai.request(app)
        .post(baseAPI+'/ip-address/create')
        .set('content-type', 'application/json')
        .send({name:"Ip custom", ip : fakeIp ,gateway:"192.168.0.0",mask:"255.255.255.0"})
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          ipAddressId = res.body._id;
          resolve()
        });
    });
  });


  let fakeMac = generateFakeMac();

  describe("POST /physical-machine/create", () => {

    it("should create a physical machine", (done) => {
      chai.request(app)
        .post(baseAPI+'/physical-machine/create')
        .set('content-type', 'application/json')
        .send({
          name: "Machine 1",
          mac: fakeMac,
          cores: 4,
          ram: 8000,
          memory: 500000,
          freeCores: 80,
          freeRam: 6000,
          freeMemory: 400000,
          operatingSystem: "Ubuntu",
          ipAddressId: ipAddressId
        })
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });

    it("should fail as the mac there is another Physical machine with the same mac address", (done) => {
      chai.request(app)
        .post(baseAPI+'/physical-machine/create')
        .set('content-type', 'application/json')
        .send({
          name: "Machine 1",
          mac: fakeMac,
          cores: 4,
          ram: 8000,
          memory: 500000,
          freeCores: 80,
          freeRam: 6000,
          freeMemory: 400000,
          operatingSystem: "Ubuntu",
          ipAddressId: ipAddressId
        })
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          done();
        });
    });

    it("should fail as the ip address is already assigned", (done) => {
      chai.request(app)
        .post(baseAPI+'/physical-machine/create')
        .set('content-type', 'application/json')
        .send({
          name: "Machine 1",
          mac: generateFakeMac(),
          cores: 4,
          ram: 8000,
          memory: 500000,
          freeCores: 80,
          freeRam: 6000,
          freeMemory: 400000,
          operatingSystem: "Ubuntu",
          ipAddressId: ipAddressId
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

  describe("GET /physical-machine/list", () => {
    
    it("should list all physical machines", (done) => {
      chai.request(app)
        .get(baseAPI+'/physical-machine/list')
        .set('auth_token', authToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          for (let obj in res.data) {
            obj.should.be.an('object');
            obj.should.have.property('assignedRanges');
            obj.should.have.property('mac');
            obj.should.have.property('ipAddressId');
            obj.should.have.property('state');
          }
          done();
        });
    });

  });

});

function generateFakeMac() {
  return Math.floor(Math.random() * 9)+"B:12:CD:3"+Math.floor(Math.random() * 9)+":EF:7"+Math.floor(Math.random() * 9);
}