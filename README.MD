# Server module

This is the server module in charge of handling user requests and of running the docker registry and registry authentication service (Portus).

## Installation

Install [docker-compose](https://docs.docker.com/install/) and [Docker](https://docs.docker.com/install/).

Generate a portus.ctr and portus.key signed by a CA that is trusted by all the possible host machines. Place both files on  the server/compose/secrets directory.

Define a .env file on the server/compose/.env path containing the following:
```bash
MACHINE_FQDN=//Fully qualified domain name of your machine
SECRET_KEY_BASE=//Secret base key, any long and randomly generated hexa string will suffice, e.g. b494a25faa8d22e430e843e220e424e10ac84d2ce0e64231f5b636d21251eb6d267adb042ad5884cbff0f3891bcf911bdf8abb3ce719849ccda9a4889249e5c2
PORTUS_PASSWORD=//Define a service password
DATABASE_PASSWORD=//Define a Database password
```


Start the Docker registry and Portus authentication by running:
```bash
cd compose
docker-compose up
```

Generate a [Portus application token](http://port.us.org/features/application_tokens.html) to be used on the server for API communication:
1. Go to http://FQDN
2. Sign up
3. Click on the left users tab
4. Create a new user, make it an admin user.
5. Enter to the new user profile, create the application token there.

Use the package manager [npm](https://www.npmjs.com/get-npm) to install all the project dependencies (base path):

```bash
npm install
```

Define a .env file at the server/.env path containing the following:

```bash
GOOGLE_APPLICATION_CREDENTIALS = //Path to your firebase service credentials, see https://firebase.google.com/docs/admin/setup
FIREBASE_CLIENT_API_KEY = //Your firebase client API, see https://firebase.google.com/docs/web/setup
MONGO_URL = //Complete Mongo URL with credentials included. E.G. mongodb://admin:passwd@ds147436.mlab.com:47436/database_name
PORTUS_ADMIN_TOKEN = //Portus app token previously generated, must be on the following format: user:token
PORTUS_BASE_URL = //Define as: https://FQDN
AWS_ACCESS_KEY = //AWS access key
AWS_ACCESS_SECRET = //AWS secret
QUEUE_BASE_URL = //SQS FIFO queue base url. E.g. https://sqs.sa-east-1.amazonaws.com/916245701249/
WORKER_QUEUE = //Worker queue name
```
## Usage

Start the server by running:
```bash
npm start
```

See an example of all requests by looking at the postman collection available at the [postman_collection/ directory](https://github.com/iaas-docker/Server/tree/master/postman_collection)
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)