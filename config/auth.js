const hostApiUrl = 'https://caro-api-wnc.herokuapp.com';

module.exports = {
    'facebookAuth': {
        'clientID': '746985432393934',
        'clientSecret': 'a4703f641342b50d051093dcb8a884dd',
        'callbackURL': `${hostApiUrl}/user/login-facebook/callback`
    },
    'googleAuth': {
        'clientID': '1001676497241-vn4rjm0l9cg75l4301iuflfu1avu9l44.apps.googleusercontent.com',
        'clientSecret': 'i9TWeJu1FRBvK0wHcIW9acA7',
        'callbackURL': `${hostApiUrl}/user/login-google/callback`
    }
};