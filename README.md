# AWS Amplify Angular Material Starter Kit
Fork or clone this repo to get a starter app for using [AWS Amplify](https://aws-amplify.github.io/) with pre-built UI using [Angular Material](https://material.angular.io/).

This is very much a work-in-progress and labor of love, and any pull requests will gladly be reviewed.

## Setup
[Sign up for an AWS account and install the AWS Amplify CLI](https://aws-amplify.github.io/docs/)
* `npm install -g @aws-amplify/cli`
* `amplify configure`

Initialize your Amplify project:
* `amplify init`

Add authentication to your Amplify project:
* `amplify add auth`
* `amplify push`

Run the project locally:
* `ng serve`

Navigate to [http://localhost:4200](http://localhost:4200).
![Landing Page](/images/landing-page.png)

Using the menu on the right, select `Sign In`.
![Sign In](/images/sign-in.png)

You can view and use the basic Angular Material Sign In UI component. The component is also located at this path: [http://localhost:4200/auth/sign-in](http://localhost:4200/auth/sign-in).
![Sign In Component](/images/sign-in-component.png)

## Project Structure
The project folder structure adheres to a typical Angular project.

Under the `src` folder, you'll find the `app` folder which contains the majority of the code for the starter kit.

Currently the only UI component in progress is an Authenticator. 

### Authenticator Structure
The authenticator includes a `module`, a `router`, an injectable `guard`, and a `service`. Each component within the `authenticator` has a route prefixed with `/auth`, i.e. `/auth/sign-in` for the `sign-in` component. To work with the routes, see `src/app/authenticator/authenticator-routing.module.ts`.

#### `src/app/authenticator/authenticator`

The base component for the authenticator, includes links to all other authenticator components.
![Auth Component](/images/auth-component.png)

#### `src/app/authenticator/sign-in`

The component for sign in functionality. The `authenticator` base component shows this by default. Immediately following `sign-in` is `confirm-sign-in`, allowing you to complete MFA sign in.

#### `src/app/authenticator/sign-out`

The component used to display UI for when a user signs out. 
![Sign Out Component](/images/auth-sign-out.png)

#### `src/app/authenticator/sign-up`

This component uses a linear stepper with validation checks for certain fields. Immediately following `sign-up` is the `confirm-sign-up` component.
![Sign Up Component](/images/auth-sign-up.png)

#### `src/app/authenticator/forgot-password`

This component uses a linear stepper with validation checks for certain fields. Immediately following `sign-up` is the `confirm-sign-up` component.
![Sign Up Component](/images/auth-sign-up.png)

