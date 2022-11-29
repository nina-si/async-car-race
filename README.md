# Asynchronous Cars Race

SPA-game to manage the collection of cars, operate their engines, visualize races and show statistics. This project helped me to get the hang of Fetch API and working with asynchronous requests. Simple backend is provided by [this mock-server](https://github.com/mikhama/async-race-api)

👉 [Check it out here](async-car-race.netlify.app)<br>
**Important:** As it takes some time for server to start, you might need to refresh a page, if there are no cars displayed.

## What does it do?

- You can choose a car and update its name and/or color.
- You can generate new random cars.
- You can start or stop a car engine.
- By clicking `Race` you launch a car race. Don't forget to reset cars before starting a new race!
- Server is used to randomize cars velocity and potential car breakdown.

![Car race](./async-race/src/assets/asynchronous%20race.gif)

## Technologies used:

- Typescript
- HTML, SCSS
- Webpack
- Eslint

## How to start locally

Navigate to the project folder:

### `cd .\async-race\`

Install dependencies:

### `npm install`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder.
