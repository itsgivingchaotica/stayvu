# StayVue

CodePath WEB103 Final Project

Designed and developed by: Saoirse Siobhan Ebert and Hafeefa Sulttan

🔗 Link to deployed app:

## About

### Description and Purpose

StayVue is your ultimate travel companion, seamlessly merging the world of accommodations with an exclusive rewards program, connecting you to local businesses for a personalized and unforgettable travel experience. Whether you're a wanderlust-filled traveler or an enthusiastic host, StayVue is combination of exceptional stays and rewards that make travel memories even more rewarding. Travelers can experience unique accommodation experiences, write reviews and share their own experiences and earn points in return. The more you travel, the more you earn. Collect points on each stay, each review, and through a referral program. A user can redeem their earned points for discounts on future bookings, exclusive deals, and gift cards for local businesses. Additionally, users will get personalized recommendation and stay connected to local businesses, which means that the app's mission extends to not only providing awesome travel arrangements but supporting the businesses in which the accomodation is near. Users can communicate with hosts for a seamless booking process and personalized travel guidance, the hosts can show their trust value with verified identities and properties.

### Inspiration

StayVue's mission goes beyond just booking accommodations; it's about enriching travel experience by connecting you to the heart and soul of your destination—its local businesses. StayVue is a gateway to immersive travel, rewards, and connections with local communities. Airbnb and other accomodations apps are a huge inspiration for this capstone, but extending the mission in this way is a huge factor into creating a culture of giving back to those communities and the folks who live there.

## Tech Stack

Frontend: React, Redux, TailwindCSS, Axios

Backend: NodeJS, Express, PostgreSQL, Passport.js

## Features

### Listings 

- [x] Users can browse the many listings offered at StayVue through our hosts.

<div>
<img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjIzdjZyc28weW1uaTF2dzcwNXY1djAzd3E3Z2FxeWMzdXd3aTRpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/FfQy2CUE9ofGXafJEx/giphy.gif' title='View Listings' width='' alt='View Listings' />
</div>

### User Authenticated Login

Users can login into their account so as to view and book listings, as well as continue to put up listings

<div>
<img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmZvOGxsemt4enFtZHYyZDJobjBpamNqNjE4NWpzbnJhYjRjcGdtcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bDXdjRPl4xiYkErEkE/giphy.gif' title='User Login' width='' alt='User Login' />
</div>

### User Authenticated Registration

Users can register for an account to begin booking and putting up listings

<div>
<img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd25vZnB3aXZ2N2o0azM4b3hybzh2cmdjbXN0YzhicnZoZnhiNWIxaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AepHP6yzZ245qUtLgb/giphy.gif' title='User Registration' width='' alt='User Registration' />
</div>

### Accommodation Search

Users can search for accommodations based on location, dates, and preferences.

<div>
<img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjE2dnpzYjUwY2d5N3VzdTA3b2lmOGl2ZGFicWtqa2JxZWtvZTFqMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AaoAssB4OHLrAcIhZG/giphy.gif' title='Accomodtion Search' width='' alt='Accomodation Search' />
</div>

### Property Listing Management

Hosts can create and manage property listings with descriptions, photos, and pricing.

<div>
<img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDYyY3RmMmFtM2t0ZWJlNG5qM2pmdnZwNHM3Z3ljejYzODEyMDVocCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9VjQe4JSWdv4syXEjv/giphy.gif' title='Property Listing Management' width='' alt='Property Listing Management' />
</div>

### Profile Creation

Users can complete their profile and add more information, including profile picture

<div>
<img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemkwaGdjNTdsN3U4M3FlN3RkeWJ0bjQxM2t5MWdqZjFxazEydXludCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Dc75V3zS3S7geNNNLF/giphy.gif' title='Profile Creation' width='' alt='Profile Creation' />
</div>

### View Policies

Users can view and understand policies set in place for Stayvue hosts and travelers.

<div>
<img src='https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmJ3aHh0MHU4dXkxZ2h5ZXo1dG05ejdwemVyZWFyOGxvY3k4MmVteSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/elgPiZOcIROLlV015c/giphy.gif' title='View Policies' width='' alt='View Policies' />
</div>

<!-- Replace this with whatever GIF tool you used! -->
GIFs created with <a href="https://gifcap.dev/">Gifcap</a> </h3>

## Installation Instructions

This project was bootstrapped with [Vite](https://github.com/vitejs/vite).

In the project's client and server directories, you can run:

### `npm install`

This will install all necessary dependencies.

In addition to this, you must input your own API keys in a .env.local file that looks like this in server:

<pre><code>PGDATABASE=""
PGHOST=""
PGPASSWORD=""
PGPORT=
PGUSER=""
DATABASE_URL=""
CLIENT_SECRET=""
PROD_CLIENT_URL=""
DEV_CLIENT_URL="http://localhost:5173"
PROD_SERVER_URL=""
DEV_SERVER_URL="http://localhost:3001"</code></pre>

and like this in the client:

<pre><code>VITE_FRONTEND_URL='http://localhost:5173'
VITE_BACKEND_URL='http://localhost:3001'
VITE_SERVER_URL=""</code></pre>

### `npm start`

Runs the app's server in the development mode.
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

### 'npm run dev'

From client directory, to explore nd appliction's user interface and front-end logic in development mode.

The page will reload when you make changes.
You may also see any lint errors in the console.

[instructions go here]
