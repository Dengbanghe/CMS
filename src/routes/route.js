export default [{
    path: '/',
    indexRoute: {
        getComponent(nextState, cb) {
            require.ensure([], (require) => {
                cb(null, require('../containers/Login'))
            }, 'Home')
        },
    },
}, {
    path: '/api',
    indexRoute: {
        getComponent(nextState, cb) {
            require.ensure([], (require) => {
                cb(null, require('../containers/API'))
            }, 'API')
        },
    },
},{
    path: '/home',
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
            path: '/dept',
            // onEnter: (_, replaceState) => replaceState(null, "/404")
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/Dept'))
                }, 'Dept')
            }
        },{
            path: '/post',
            // onEnter: (_, replaceState) => replaceState(null, "/404")
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/Post'))
                }, 'Post')
            }
        }, {
            path: '/role',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/Role'))
                }, 'Role')
            }
        },{
            path: '/menu',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/Menu'))
                }, 'Menu')
            }
        },{
            path: '/region',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/regicodeMgmt'))
                }, 'Region')
            }
        },{
            path: '/loanType',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/LoanType'))
                }, 'LoanType')
            }
        },{
            path: '/loanTermRate',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/LoanTermAndRate'))
                }, 'LoanTermAndRate')
            }
        },{
            path: '/repayMethod',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/RepayMethod'))
                }, 'RepayMethod')
            }
        },{
            path: '/bank',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/bank'))
                }, 'Bank')
            }
        },{
            path: '/user',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/user'))
                }, 'User')
            }
        },{
            path: '/loanApply',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/loanApply'))
                }, 'loanApply')
            }
        },{
            path: '/loanAssess',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/loanAssess'))
                }, 'loanAssess')
            }
        },{
            path: '/loanConfirm',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {
                    cb(null, require('../containers/loanConfirm'))
                }, 'loanConfirm')
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
}]