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
    sceneRoot.findByPath('**/planeTracker*/characters/*')
])
    .then(function (searchResult) {
        // exit if not models found
        if (searchResult.isEmpty) return;

        // get people in plane tracker
        const characters = searchResult[0];

        // number of people is number of persons + viewer
        const numberOfCharacters = characters.length + 1;

        // an angle between nearby persons
        const delta = 2 * Math.PI / numberOfCharacters;

        // circle radius is such that there is 0.5 m between nearby persons
        const length = 1;
        const radius = length * numberOfCharacters / (2 * Math.PI);

        // set models on a circle with radius
        for (let index = 0; index < characters.length; index++) {
            // get an angle for the next person
            const angle = (index + 1) * delta + Math.PI / 2;

            // get an x, x coordinates for the next person
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);

            // get the character
            const character = characters[index]

            // get the character's transform
            const characterTransform = character.transform;

            // rotate towards the center of a circle
            characterTransform.rotationY = 3 * Math.PI / 2 - angle;

            // set an x, z coordinates for the next person
            characterTransform.x = x;
            characterTransform.z = z - radius;
        }
    });