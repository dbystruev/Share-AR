//
//  shareAR/scripts/script.js
//
//  Created by Denis Bystruev on 31.05.2020 (dbystruev@me.com)
//  Copyright © 2020 Denis Bystruev. All rights reserved.
//

// Add diagnostics module for logging
const Diagnostics = require('Diagnostics');

// Load the scene
const Scene = require('Scene');
const sceneRoot = Scene.root;

// Get all person objects from the scene
// @ts-ignore
Promise.all([
    // @ts-ignore
    sceneRoot.findByPath('**/planeTracker*/people/person*')
])
    .then(function (searchResult) {
        // exit if not models found
        if (searchResult.isEmpty) return;

        // get people in plane tracker
        const people = searchResult[0];

        // number of people is number of persons + viewer
        const numberOfPeople = people.length + 1;

        // an angle between nearby persons
        const delta = 2 * Math.PI / numberOfPeople;

        // circle radius is such that there is 1 m between nearby persons
        const radius = numberOfPeople / 2;

        // set models on a circle with radius
        for (let index = 0; index < people.length; index++) {
            // get an angle for the next person
            const angle = (index + 1) * delta + Math.PI / 2;

            // get an x, x coordinates for the next person
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);

            // set an x, z coordinates for the next person
            const personTransform = people[index].transform;
            personTransform.rotationY =  3 * Math.PI / 2 - angle;
            personTransform.x = x;
            personTransform.z = z - radius;
        }
    });