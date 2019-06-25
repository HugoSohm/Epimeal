module.exports = {
    apps: [{
        name: "api-app",
        script: "./src/App.js",
        instances: 4,
        exec_mode: "cluster"
    }]
}