

if (Meteor.isServer) {

    var Api = new Restivus({
        useDefaultAuth: false,
        prettyJson: true
    });

    // Get, Post, Put, Delete

    Api.addRoute('users/:email', { authRequire: false }, {
        
        delete: function () {

            var user = Meteor.users.findOne({
                'emails.address': this.urlParams.email
            });

            if (user) {
                Meteor.users.remove(user._id);

                return {
                    message: 'ok'
                }
            } else {
                return {
                    statusCode: 404,
                    body: { message: 'nok' }
                }
            }
        }


    } )

    Api.addRoute('users', { authRequire: false }, {

        get: function () {
            return {
                statusCode: 200,
                body: { message: 'API no ar....' }
            }
        },

        post: function () {

            var Future = require('fibers/future');
            var future = new Future();

            var body = this.request.body;
            var response;

            var user = {
                email: body.email,
                password: body.password,
                profile: { name: body.name }
            }

            Meteor.call('saveAccount', user, function (err, res) {
                if (err) {
                    future.return({
                        statusCode: 404,
                        body: { message: err.reason }
                    })
                } else {
                    console.log('tudo certo aqui.')
                    future.return({
                        statusCode: 200
                    });
                }
            })

            return future.wait(response);
        }


    })


}