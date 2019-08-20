/* jshint node: true */
/* jshint esversion: 6 */

process.env.DEBUG = 'actions-on-google:*,request';


// NPM PACKAGES -------------------------------------
const functions = require('firebase-functions');
const request = require('request-promise');
const requestLoop = require('request-promise');

const {
    dialogflow,
    List,
    Carousel,
    Image,
    Suggestions} = require('actions-on-google');


// DIALOGFLOW INIT ----------------------------------
const app = dialogflow({
    debug: true,
    client_id: 'dialogflow-ykpjia@apigee-paylater.iam.gserviceaccount.com'
})

// STATIC VARIABLE DECLARATION ----------------------
const API_HOST = 'https://demo38-test.apigee.net'
const PAYLATER_BASE_PATH = '/paylater';
const PAYLATER_WT_BASE_PATH = '/paylater-walkthrough'
const API_VERSION = '/v1';
const PAYLATER_BASE_URL = PAYLATER_BASE_PATH + API_VERSION;
const PAYLATER_WT_BASE_URL = PAYLATER_WT_BASE_PATH + API_VERSION

const PATH_PRODUCTS = '/products'
const PATH_BANKS_LIST = '/banks'


const API_KEY = 't3YGmjt8xNMQJwtOT9c9Boc2zLfDXl99';

//const URL_USERINFO = 'https://www.googleapis.com/oauth2/v3/userinfo';


// Intents
const INTENT_WELCOME = 'Welcome Intent'

const INTENT_INTEREST_IN_PAYLATER = 'Interest in PayLater'
const INTENT_INTEREST_IN_PAYLATER_YES = 'Interest in PayLater - yes'
const INTENT_INTEREST_IN_PAYLATER_NO = 'Interest in PayLater - no'
const INTENT_HANDLE_PRODUCT_SELECTION = 'Handle Product Selection'


// UI Suggestions
const SUGGESTION_WHATS_PAYLATER = 'Do you support PayLater?'
const SUGGESTION_NEAREST_ATM = 'Nearest ATM'
const SUGGESTION_BYE = 'Bye'


// Responses

const RESP_INTRO_FIRST = 'Welcome back to the Apigee Bank assistant!'
const RESP_INTRO_RETURNING = 'Hi, I am your Apigee bank assistant!'
const RESP_PAYLATER_SUPPORT = 'Good you ask, indeed we do. Curious to see how it works?'
const RESP_PAYLATER_YES = 'Great, let\'s play through a scenario. Pick one of the products below:'
const RESP_PAYLATER_NO = 'Ok. '


const RESP_WHAT_CAN_I_DO = 'What can I do for you?'
const RESP_ANYTHING_ELSE = 'Anything else I can do for you?'
const RESP_BYE = 'Bye then!'





const INTENT_RECOMMENDATIONS = 'Recommendations';
const INTENT_WHAT_CAN_YOU_DO = 'What can you do';
const INTENT_END_CONVERSATION = 'Ending Conversation';
const INTENT_INTEREST_IN_RECOMMENDATION_NO = 'Recommendations - Interested in any product? No';
const INTENT_INTEREST_IN_RECOMMENDATION_YES = 'Recommendations - Interested in any product? Yes';
const INTENT_ADD_TO_CART_FROM_RECOMMENDATIONS = 'Check Product Exists and Add to Cart';


const SUGGESTION_YES = 'Yes';
const SUGGESTION_NO = 'No';
const SUGGESTION_RECOMMENDATIONS = 'Recommendations';
const SUGGESTION_ALLPRODUCTS = 'All products';
const SUGGESTION_CHANGECURRENCY = 'Change currency';

const CONTEXT_HANDLE_CHOICE = 'handle_choice';

const RESP_TO_RECOMMENDATIONS = "Here are some recommendations for you. ";
const RESP_TO_RECOMMENDATIONS_2 = "Are you interested in any of these products?";
const RESP_TO_END_CONVERSATION = 'Alright, speak soon. Bye!';
const RESP_ERROR = 'Sorry, there has been an error, could you try again please?';


// Configuration of Request Defaults ----------------

const req = request.defaults({
    baseUrl: API_HOST,
    headers: {
        apikey: API_KEY
    },
    json: true
})


app.intent(INTENT_WELCOME, (conv) => {
    console.log('Starting intent "' + INTENT_WELCOME + '" ...');
    //console.log('conv.user object: "' + JSON.stringify(conv.user) + '"');
    conv.contexts.set(CONTEXT_HANDLE_CHOICE, 1);
    if (conv.user.last.seen) {
        conv.ask(RESP_INTRO_RETURNING);
    } else {
        conv.ask(RESP_INTRO_FIRST);
    }
    conv.ask(RESP_WHAT_CAN_I_DO);
    conv.ask(new Suggestions([SUGGESTION_WHATS_PAYLATER, SUGGESTION_NEAREST_ATM, SUGGESTION_BYE]));
});


app.intent(INTENT_INTEREST_IN_PAYLATER, (conv) => {
    console.log('Starting intent "' + INTENT_INTEREST_IN_PAYLATER + '" ...');
    conv.ask(RESP_PAYLATER_SUPPORT);
    conv.ask(new Suggestions([SUGGESTION_YES, SUGGESTION_NO]));
});


app.intent(INTENT_INTEREST_IN_PAYLATER_YES, (conv) => {
    console.log('Starting intent "' + INTENT_INTEREST_IN_PAYLATER_YES + '" ...');
    conv.ask(RESP_PAYLATER_YES)
    var uri = PAYLATER_WT_BASE_URL + PATH_PRODUCTS
    return req.get({
        uri: uri
    }).then(respProducts => {
        console.log('Response from "' + uri + '": ' + JSON.stringify(respProducts));
        var itemsCompose = {};
        var noOfProducts = respProducts.length;
        console.log(noOfProducts);
        for (var j = 0; j < noOfProducts; j++) {
            try {
                var selection_key = respProducts[j].id;
                //console.log(selection_key);
                itemsCompose[selection_key] = {
                    synonyms: [], title: respProducts[j].name,
                    description: respProducts[j].description,
                    image: new Image({ url: respProducts[j].img_link, alt: respProducts[j].name })
                };
                console.log(JSON.stringify(itemsCompose));
            } catch (error) {
                console.log('Error when creating carousel list"): ' + error);
            }
        }
        conv.ask(new Carousel({
            items: itemsCompose
        }));
    }).catch(error => {
        console.log('Error ("' + uri + '"): ' + error);
        conv.ask(RESP_ERROR);
        return;
    });
});


app.intent(INTENT_INTEREST_IN_PAYLATER_NO, (conv) => {
    console.log('Starting intent "' + INTENT_INTEREST_IN_PAYLATER_NO + '" ...');
    conv.ask(RESP_PAYLATER_NO)
    conv.ask(RESP_ANYTHING_ELSE)
});



app.intent(INTENT_HANDLE_PRODUCT_SELECTION, (conv, params, option) => {
    console.log('Starting intent "' + INTENT_HANDLE_PRODUCT_SELECTION + '" ...');
    //conv.ask('all good, you have selected option: ' + option);
    var uri = PAYLATER_WT_BASE_URL + PATH_PRODUCTS + '/' + option
    return req.get({
        uri: uri
    }).then(respProduct => {
        console.log('Response from "' + uri + '": ' + JSON.stringify(respProduct));

        conv.ask('You\'ve selected the ' + respProduct.name + ', costing ' + respProduct.price + '£')
        conv.ask('At a merchant\'s site, you can now select PayLater. Then, choose our bank.')
    }).catch(error => {
        console.log('Error ("' + uri + '"): ' + error);
        conv.ask(RESP_ERROR);
        return;
    });


    // let response = 'You did not select any item';
    // if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    //     response = SELECTED_ITEM_RESPONSES[option];
    // }
    // conv.ask(response);
});


// app.intent('ask_for_sign_in', (conv) => {
//     console.log('in intent "ask_for_sign_in" and asking for sign in now ...');
//     conv.ask(new SignIn());
// });

// app.intent('ask_for_sign_in_confirmation', (conv, params, signin) => {
//     console.log('in intent "ask_for_sign_in_confirmation" now ...');
//     console.log('signin object: "' + JSON.stringify(signin) + '"');
//     if (signin.status !== 'OK') {
//         console.log('signin status not equal to OK  ...');
//         return conv.ask('You need to sign in before using the app.');
//     }
//     const access = conv.user.access.token;
//     console.log('access token is: "' + access + '"');
//     // possibly do something with access token
//     return conv.ask('Great! Thanks for signing in.');
// });



// app.intent(INTENT_WELCOME, (conv) => {
//     console.log('Starting intent "' + INTENT_WELCOME + '" ...');
//     //console.log('conv.user object: "' + JSON.stringify(conv.user) + '"');
//     conv.contexts.set(CONTEXT_HANDLE_CHOICE, 1);
//     if (conv.user.last.seen) {
//         conv.ask('Welcome back to the Apigee Bank assistant!');
//     } else {
//         conv.ask('Hi, I am your Apigee bank assistant!');
//     }
//     // return req.get({
//     //     uri: PATH_ADVERTISEMENTS
//     // }).then(body => {
//     //     console.log('Response from "' + PATH_ADVERTISEMENTS + '": ' + JSON.stringify(body));
//     //     var itemsCompose = {};
//     //     var arrayLength = body.ads.length;
//     //     for (var i = 0; i < arrayLength; i++) {
//     //         var productUri = body.ads[i].redirectUrl;
//     //         //console.log(productUri);
//     //         productUri = productUri.substr(1);
//     //         productUri = productUri.replace("/", "_");
//     //         var synonym = productUri.replace('_', ' ');
//     //         var synonym2 = synonym.replace('product', 'item');
//     //         itemsCompose[productUri] = {
//     //             synonyms: [
//     //                 synonym, synonym2
//     //             ], title: body.ads[i].text
//     //         };
//     //     }
//     //     console.log('arrayLength is: ' + arrayLength);
//     //     if (itemsCompose.length === 1){
//     //         console.log('as length is 1, adding a bogus item as a workaround');
//     //         itemsCompose['Super Swag'] = {
//     //             synonyms: [
//     //                 'Swagger', 'Swag Item'
//     //             ], title: 'Super Swag 22% off'
//     //         };
//     //     }

//     //     if (conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
//     //         conv.ask(new List({
//     //             title: 'Ads',
//     //             items: itemsCompose,
//     //         }));
//     //     }
//     //     conv.ask(new Suggestions([SUGGESTION_RECOMMENDATIONS, SUGGESTION_ALLPRODUCTS]));
//     //     return;
//     // }).catch(error => {
//     //     console.log('Error ("' + PATH_ADVERTISEMENTS + '"): ' + error);
//     //     conv.ask('Sorry, there has been an error, could you try again please?');
//     //     return;
//     // });

//     conv.ask('What\'s up?');
//     conv.ask(new Suggestions([SUGGESTION_WHATS_PAYLATER, SUGGESTION_NEAREST_ATM, SUGGESTION_BYE]));

// });


// app.intent(INTENT_HANDLE_CHOICE, (conv, params, option) => {
//     conv.ask('all good, you have selected option: ' + option);
// });

app.intent(INTENT_RECOMMENDATIONS, (conv) => {
    console.log('Starting intent "' + INTENT_RECOMMENDATIONS + '" ...');
    //conv.ask(new SignIn());
    //console.log('conv.user object: "' + JSON.stringify(conv.user) + '"');
    conv.ask(RESP_TO_RECOMMENDATIONS);
    var recommendationsFullPath = PATH_RECOMMENDATIONS + '/mike';
    return req.get({
        uri: recommendationsFullPath
    }).then(body => {
        console.log('Response from "' + recommendationsFullPath + '": ' + JSON.stringify(body));
        body = {
            "productIds": [
                "OLJCESPC7Z",
                "L9ECAV7KIM",
                "2ZYFJ3GM2N",
                "0PUK6V6EV0",
                "66VCHSJNUP"
            ]
        };
        var arrayLength = body.productIds.length;
        var ps = [];
        for (var i = 0; i < arrayLength; i++) {
            var fullPath = PATH_PRODUCTS + '/' + body.productIds[i];
            var get_product_details = {
                baseUrl: API_BASE_URL,
                uri: fullPath,
                headers: {
                    apikey: API_KEY
                },
                json: true
            };
            ps.push(requestLoop(get_product_details));
        }

        var recommendedProducts = [];

        return Promise.all(ps)
            .then((results) => {
                console.log(results); // Result of all resolve as an array
                respProducts = results;
                // do stuff, but note that only product IDs have been returned, so another API call loop required to get photos etc.
                var itemsCompose = {};
                var noOfProducts = respProducts.length;
                console.log(noOfProducts);
                for (var j = 0; j < noOfProducts; j++) {
                    try {
                        var selection_key = respProducts[j].id;
                        console.log(selection_key);
                        recommendedProducts.push(respProducts[j].name);
                        var fullImgUrl = 'http://35.239.88.203/' + respProducts[j].picture;
                        console.log(fullImgUrl);
                        itemsCompose[selection_key] = {
                            synonyms: [], title: respProducts[j].name,
                            description: respProducts[j].description,
                            image: new Image({ url: fullImgUrl, alt: respProducts[j].name })
                        };
                        console.log(JSON.stringify(itemsCompose));
                    } catch (error) {
                        console.log('Error when creating carousel list"): ' + error);
                    }
                }
                conv.ask(new Carousel({
                    items: itemsCompose
                }));
                console.log('conv object: ' + JSON.stringify(conv));
                conv.user.storage.recommendedProducts = recommendedProducts;
                console.log('verify that the storage is populated: ' + JSON.stringify(conv.user.storage));
                conv.ask(RESP_TO_RECOMMENDATIONS_2);
                conv.ask(new Suggestions([SUGGESTION_YES, SUGGESTION_NO]));
                return;
            }).catch(err => console.log(err));
    }).catch(error => {
        console.log('Error ("' + PATH_RECOMMENDATIONS + '"): ' + error);
        conv.ask(RESP_ERROR);
        return;
    });
});


app.intent(INTENT_INTEREST_IN_RECOMMENDATION_NO, (conv) => {
    conv.ask('Alright');
    conv.ask(new Suggestions([
        SUGGESTION_CLOSE_CONV]));
});

app.intent(INTENT_INTEREST_IN_RECOMMENDATION_YES, (conv) => {
    conv.ask('Great, and which one?');
    console.log('verify that the product list can be retrieved from storage (conv.user object): ' + JSON.stringify(conv.user));
    var recommendedProducts = conv.user.storage.recommendedProducts;
    //recommendedProducts = JSON.parse(recommendedProducts);
    console.log('recommendedProducts: ' + recommendedProducts);
    var arrayLength = recommendedProducts.length;
    console.log('arrayLength: ' + arrayLength);
    //var suggestions = [];
    for (var i = 0; i < arrayLength; i++) {
        conv.add(new Suggestions(recommendedProducts[i]));
    }
});


app.intent(INTENT_ADD_TO_CART_FROM_RECOMMENDATIONS, (conv, params) => {
    console.log(' ===== now adding to cart ======');
    console.log(' ===== conv: ' + JSON.stringify(conv));
    console.log(' ===== params: ' + JSON.stringify(params));
    console.log(' ===== options: ' + JSON.stringify(options));
    conv.ask('Alright, product has been added to your cart.');
    conv.ask(new Suggestions([
        SUGGESTION_RECOMMENDATIONS,
         SUGGESTION_CLOSE_CONV]));
});


app.intent(INTENT_END_CONVERSATION, (conv) => {
    conv.close(RESP_TO_END_CONVERSATION);
});


app.intent(INTENT_WHAT_CAN_YOU_DO, (conv) => {
    conv.ask('Have a look at the suggestions from your smartphone. You can ask me for suggested products, for example.');
    conv.ask(new Suggestions([
        SUGGESTION_RECOMMENDATIONS,
        SUGGESTION_ALLPRODUCTS,
        SUGGESTION_CHANGECURRENCY,
        SUGGESTION_CLOSE_CONV]));
});

// firebase deploy --only functions
exports.paylaterFulfillment = functions.region('europe-west1').https.onRequest(app);