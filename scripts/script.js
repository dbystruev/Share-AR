//
//  shareAR/scripts/script.js
//
//  Created by Denis Bystruev on 31.05.2020 (dbystruev@me.com)
//  Copyright © 2020 Denis Bystruev. All rights reserved.
//

// Add animation module for diamond animation
const Animation = require('Animation');

// Add diagnostics module for logging
const Diagnostics = require('Diagnostics');

// Add scene module to manipulate the objects
const Scene = require('Scene');
const sceneRoot = Scene.root;

// Get all character objects from the scene
// @ts-ignore
Promise.all([
    // @ts-ignore
    sceneRoot.findByPath('**/planeTracker*/characters/*'),
    // @ts-ignore
    sceneRoot.findFirst('origami_diamond')
])
    .then(function (searchResult) {
        // exit if no models are found
        if (!searchResult) return;

        // get characters in plane tracker
        const characters = searchResult[0];

        // number of characters is number of models + viewer
        const numberOfCharacters = characters.length + 1;

        // an angle between nearby persons
        const delta = 2 * Math.PI / numberOfCharacters;

        // circle radius is such that there is 1 m between nearby persons
        const length = 1;
        const radius = length * numberOfCharacters / (2 * Math.PI);

        // set models on a circle with radius
        for (let index = 0; index < characters.length; index++) {
            // get an angle for the next character
            const angle = (index + 1) * delta + Math.PI / 2;

            // get an x, z coordinates for the next character
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);

            // get the character
            const character = characters[index]

            // get the character's transform
            const characterTransform = character.transform;

            // face towards the center of a circle
            characterTransform.rotationY = 3 * Math.PI / 2 - angle;

            // place the character on the circle
            characterTransform.x = x;
            characterTransform.z = z - radius;
        }

        // setup dimamond animation driver parameters
        const diamondDriverParameters = {
            durationMilliseconds: 1000,
            loopCount: Infinity,
            mirror: true
        };

        // setup dimamond animation driver
        const diamondDriver = Animation.timeDriver(diamondDriverParameters);

        // start the diamond driver
        diamondDriver.start();

        // create diamond sampler for 0.5 m to 1 m
        const diamondSampler = Animation.samplers.easeInOutSine(0.5, 1);

        // create diamond animation
        const diamondAnimation = Animation.animate(diamondDriver, diamondSampler);

        // get the object for the diamond
        const diamond = searchResult[1];

        // get diamond's transform
        const diamondTransform = diamond.transform;

        // bind the animation to the diamond's height
        diamondTransform.y = diamondAnimation;
    });