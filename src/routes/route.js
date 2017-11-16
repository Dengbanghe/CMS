export default {
    path: '/',
    indexRoute: {
        getComponent(nextState, cb) {
            require.ensure([], (require) => {
                cb(null, require('../containers/Home'))
            }, 'Home')
        },
    },
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../containers/App'))
        }, 'App')
    },
    childRoutes: [
        {
            path: '/index',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/Home'))
                }, 'Home')
            }
        },{
            path: '/foo',
            // onEnter: (_, replaceState) => replaceState(null, "/404")
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/Foo'))
                }, 'Foo')
            }
        },{
            path: '/region',
            // onEnter: (_, replaceState) => replaceState(null, "/404")
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/regicodeMgmt'))
                }, 'Region')
            }
        },{
            path: '/404',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/404'))
                }, 'NotFoundPage')
            }
        }, {
            path: '*',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/404'))
                }, 'NotFoundPage')
            }
        }

    ]
}