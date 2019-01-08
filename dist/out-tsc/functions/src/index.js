"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.createUser = functions.firestore
    .document('foods/{foodId}')
    .onCreate(function (snap, context) {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    var newValue = snap.data();
    // access a particular field as you would any JS property
    var name = newValue.title;
    return snap.ref.set({
        name2: newValue.name + ' $'
    }, { merge: true });
    // perform desired operations ...
});
//# sourceMappingURL=index.js.map