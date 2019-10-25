# API-Gateway
API-Gateway acts as the single entrypoint into the system.


### Installation
1. Install the dependencies by running `$ npm install`.
1. Make sure the Rabbitmq is running.
1. Rename/Copy .env.dist file as .env and alter the config values with actual ones.
1. 
    - On development env, start the server by running `$ npm run dev` from the root of the project.
    - On prod env, start the server by running `$ npm run start` from the root of the project.


### Functionalities

  - Healthcheck of gateway itself:
    **URL:** `0.0.0.0:3003/pingself`
    **Method:** GET

  - Healthcheck of services:
    **URL:** `0.0.0.0:3003/ping`
    **Method:** GET

  - Get product list as guest
    **URL:** `0.0.0.0:3003/v1/products`
    **Method:** GET

  - Get product list as user
    **URL:** `0.0.0.0:3003/v1/products/${userId}`
    **Method:** GET

  - Get user basket:
    **URL:** `0.0.0.0:3003/v1/basket/${userId}`
    **Method:** GET

  - Add product to user basket:
    **URL:** `0.0.0.0:3003/v1/basket/${userId}/${productId}`
    **Method:** PUT

  - Add product to user basket:
    **URL:** `0.0.0.0:3003/v1/basket/${userId}/${productId}`
    **Method:** DELETE
