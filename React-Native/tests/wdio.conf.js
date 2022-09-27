exports.config = {
    port: 4723,
    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 1,
    capabilities: [{    
        maxInstances: 1,
        platformName: 'Android',
        platformVersion: '11',
        deviceName: 'SM-G970U1',
        app: '/home/mykhailo/workspace/kuky/kuky2/android/app/build/outputs/apk/debug/app-debug.apk',
        automationName: 'UiAutomator2'
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 1,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
