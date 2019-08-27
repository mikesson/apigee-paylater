/* jshint node: true */
/* jshint esversion: 6 */

process.env.DEBUG = 'actions-on-google:*,request';


// NPM PACKAGES -------------------------------------
const functions = require('firebase-functions');
const request = require('request-promise');
const requestLoop = require('request-promise');
const requestOIDC = require('request-promise');

const {
    dialogflow,
    List,
    Carousel,
    Image,
    SignIn,
    BasicCard,
    Table,
    Suggestions } = require('actions-on-google');


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
const PATH_BANKS = '/banks'


const API_KEY = 't3YGmjt8xNMQJwtOT9c9Boc2zLfDXl99';
const CONSUMER_ID = '12345'

const URL_USERINFO = 'https://www.googleapis.com/oauth2/v3/userinfo';


// Intents
const INTENT_WELCOME = 'Welcome Intent'

const INTENT_INTEREST_IN_PAYLATER = 'Interest in PayLater'
const INTENT_INTEREST_IN_PAYLATER_YES = 'Interest in PayLater - yes'
const INTENT_INTEREST_IN_PAYLATER_NO = 'Interest in PayLater - no'
const INTENT_HANDLE_PRODUCT_SELECTION = 'Handle Product Selection'
const INTENT_HANDLE_BANK_SELECTION = 'Handle Bank Selection'
const INTENT_GET_SIGNIN = "Get SignIn"
const INTENT_GET_UPFRONT_PAYMENT = 'Get Loan Upfront Payment'
const INTENT_END_CONVERSATION = 'End Conversation'
const INTENT_WHAT_CAN_YOU_DO = 'What can yo do'
const INTENT_LOAN_ACCEPTED = 'Loan Payment Accept'
const INTENT_LOAN_DENIED = 'Load Payment Denied'

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


const SUGGESTION_YES = 'Yes';
const SUGGESTION_NO = 'No';

const SUGGESTION_100 = '100'
const SUGGESTION_200 = '200'
const SUGGESTION_400 = '400'

const CONTEXT_HANDLE_CHOICE = 'handle_choice';

const RESP_TO_END_CONVERSATION = 'Speak soon. Bye!';
const RESP_ERROR = 'Sorry, there has been an error, could you try again please?';


// Configuration of Request Defaults ----------------

const req = request.defaults({
    baseUrl: API_HOST,
    headers: {
        apikey: API_KEY
    },
    json: true
})


const reqOIDC = requestOIDC.defaults({
    baseUrl: URL_USERINFO,
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
    var uri = PAYLATER_WT_BASE_URL + PATH_PRODUCTS + '/' + option
    var uri2 = PAYLATER_WT_BASE_URL + PATH_BANKS
    return req.get({
        uri: uri
    }).then(respProduct => {
        console.log('Response from "' + uri + '": ' + JSON.stringify(respProduct));
        conv.ask('You\'ve selected the ' + respProduct.name + ', costing ' + respProduct.price + '£. ')
        conv.ask('At a merchant\'s site, you can now select PayLater. Then, choose our bank.')

        // setting context
        var parameters = {'selectedProductName':respProduct.name}
        conv.contexts.set('productname-context', 5, parameters);
        parameters = {'selectedProductPrice' : respProduct.price}
        conv.contexts.set('productprice-context', 5, parameters);
        

        //second request
        return req.get({
            uri: uri2
        }).then(respBanks => {
            console.log('Response from "' + uri2 + '": ' + JSON.stringify(respBanks));
            var itemsCompose = {};
            var noOfBanks = respBanks.length;
            console.log(noOfBanks);
            for (var j = 0; j < noOfBanks; j++) {
                try {
                    var selection_key = respBanks[j].id;
                    itemsCompose[selection_key] = {
                        synonyms: [], title: respBanks[j].name,
                        description: respBanks[j].description,
                        image: new Image({ url: respBanks[j].img_link, alt: respBanks[j].name })
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
    }).catch(error => {
        console.log('Error ("' + uri + '"): ' + error);
        conv.ask(RESP_ERROR);
        return;
    });
});


app.intent(INTENT_HANDLE_BANK_SELECTION, (conv, params, option) => {
    console.log('Starting intent "' + INTENT_HANDLE_BANK_SELECTION + '" ...');
    conv.ask('Just checking if you are logged in already ...');
    conv.ask(new SignIn('To approve the merchant\'s consent request'));
    conv.ask(new Suggestions([SUGGESTION_YES, SUGGESTION_NO]));
});


app.intent(INTENT_GET_SIGNIN, (conv, input, signin) => {
    console.log('Starting intent "' + INTENT_GET_SIGNIN + '" ...');
    console.log('signin object: "' + JSON.stringify(signin) + '"');
    if (signin.status !== 'OK') {
        console.log('signin NOT equal to "yes", starting signin now  ...');
        console.log('just checking - conv object is: "' + JSON.stringify(conv) + '"');
        conv.ask(`I won't be able to continue with the walkthrough without login, what do you want to do next?`)
    } else {
        const access = conv.user.access.token;
        console.log('access token is: "' + access + '"');
        var authHeader = 'Bearer ' + access;
        // call userinfo now to get name
        return reqOIDC.get({
            uri: '',
            headers: {
                'Authorization': authHeader
            }
        }).then(body => {
            userName = body.given_name;
            console.log('Response from "' + URL_USERINFO + '": ' + JSON.stringify(body));
            userName = body.given_name; // store userName
            var response = "Thanks " + body.given_name + ", we can now approve the merchant\'s consent request."
            //conv.ask(' !helas 2! ');
            conv.ask(response);
            conv.ask(new BasicCard({
                text: '',
                title: 'Approved Merchant',
                image: new Image({
                    url: 'https://cdn.pixabay.com/photo/2017/01/13/01/22/ok-1976099_960_720.png',
                    alt: 'consent granted',
                }),
                display: 'CROPPED',
            }));
            conv.ask('As part or Pay Later, how much are you willing to pay upfront?');
            conv.ask(new Suggestions([SUGGESTION_100, SUGGESTION_200, SUGGESTION_400]));
            return;
        }).catch(error => {
            console.log('Error when calling ' + URL_USERINFO + ': ' + error);
            conv.ask('There has been an issue with your account, please login again.');
            conv.ask(new SignIn());
            return;
        })
    }
});

app.intent(INTENT_GET_UPFRONT_PAYMENT, (conv, input) => {
    console.log('Starting intent "' + INTENT_GET_UPFRONT_PAYMENT + '" ...');
    console.log('input object: "' + JSON.stringify(input) + '"');
    var num = input.number
    console.log('number is: "' + num + '"');
    var productPrice = conv.contexts.get('productprice-context').parameters['selectedProductPrice'];
    var productName = conv.contexts.get('productname-context').parameters['selectedProductName'];
    var loanRequest = {
        "consumer_consent_resource_identification": "CC0001",
        "principal_amount": {
            "currency": "GBP",
            "Amount": productPrice
        },
        "purpose": {
            "description": productName
        },
        "up_front_payment": {
            "amount": num,
            "currency": "GBP"
        }
    }
    var uri = PAYLATER_BASE_URL + '/' + CONSUMER_ID + '/loan/offer'
    return req.post({
        uri: uri,
        body: loanRequest
    }).then(respLoanOffer => {
        console.log('Response from "' + uri + '": ' + JSON.stringify(respLoanOffer));
        var offerText = 'Based on an initial payment of ' + num + ', here\'s a suggested loan offer:\n'
        var interestRate = respLoanOffer.loan_offers[0].interest_rate[0].rate + '%'
        var validUntil = respLoanOffer.loan_offers[0].validity_date.date_time.to_date_time
        var totalLoanCost = respLoanOffer.loan_offers[0].total_loan_cost.amount
        var loanDetails = 'Interest rate: ' + interestRate + ' \nValid until:  ' + validUntil + '  \nTotal loan cost:  ' + totalLoanCost
        var response = offerText + loanDetails
        conv.ask(loanDetails)

        var tranchesInList = []
        var tranchesList = respLoanOffer.loan_offers[0].tranche
        for(let i = 0; i < tranchesList.length; i++){
            tranchesInList[i] = [tranchesList[i].principal_amount.amount, tranchesList[i].interest_amount.amount, tranchesList[i].due_date]
         }

        conv.ask(new Table({
            title: 'Instalments',
            dividers: true,
            columns: ['Amount', 'Interest', 'Due'],
            rows: tranchesInList,
          }));
        conv.ask('Do you accept this loan offer?')
        conv.ask(new Suggestions([SUGGESTION_YES, SUGGESTION_NO]));
    }).catch(error => {
        console.log('Error ("' + uri + '"): ' + error);
        conv.ask(RESP_ERROR);
        return;
    });
});


app.intent(INTENT_LOAN_ACCEPTED, (conv) => {
    console.log('Starting intent "' + INTENT_LOAN_ACCEPTED + '" ...');
    var productName = conv.contexts.get('productname-context').parameters['selectedProductName'];
    conv.ask('Ok, that\'s it! The ' + productName + ' is now yours, the merchant receives the funds, and we got you covered!' )
    conv.close(RESP_TO_END_CONVERSATION);
});


app.intent(INTENT_LOAN_DENIED, (conv) => {
    console.log('Starting intent "' + INTENT_LOAN_DENIED + '" ...');
    conv.ask('Fair enough! Now you know how Pay Later works, be sure to watch out for it when shopping next time.' )
    conv.close(RESP_TO_END_CONVERSATION);
});


app.intent(INTENT_END_CONVERSATION, (conv) => {
    conv.close(RESP_TO_END_CONVERSATION);
});


// app.intent(INTENT_WHAT_CAN_YOU_DO, (conv) => {
//     conv.ask('Have a look at the suggestions from your smartphone. You can walkthrough our new Pay Later feature, for example.');
//     conv.ask(new Suggestions([
//         SUGGESTION_RECOMMENDATIONS,
//         SUGGESTION_ALLPRODUCTS,
//         SUGGESTION_CHANGECURRENCY,
//         SUGGESTION_CLOSE_CONV]));
// });

// firebase deploy --only functions
exports.paylaterFulfillment = functions.region('europe-west1').https.onRequest(app);