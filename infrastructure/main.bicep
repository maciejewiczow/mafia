@secure()
param swaPassword string
@secure()
param dbAdminPassword string
param dbAdminUsername string

param apiAccessTokenLifeSpan string = '00:20:00'

module database 'database.bicep' = {
  name: '${deployment().name}-mongo'
  params: {
    adminPassword: dbAdminPassword
    adminUsername: dbAdminUsername
  }
}

module functions 'functions.bicep' = {
  name: '${deployment().name}-functions'
  params: {
    appInsightsLocation: resourceGroup().location
  }
}

module api 'api.bicep' = {
  name: '${deployment().name}-api'
  params: {
    appServicePlanSku: 'F1'
    accessTokenLifeSpan: apiAccessTokenLifeSpan
    turnFunctionUrl: functions.outputs.url
    mongoDbConnectionString: database.outputs.connectionString
    mongoDbPassword: dbAdminPassword
    mongoDbUsername: dbAdminUsername
  }
  dependsOn: [
    functions
    database
  ]
}

module staticWebApp 'frontend.bicep' = {
  name: '${deployment().name}-frontend'
  params: {
    name: 'mafia-swa'
    password: swaPassword
    apiResourceId: api.outputs.appServiceId
    apiUrl: '${api.outputs.appServiceUrl}/api'
  }
  dependsOn: [
    api
  ]
}

output functionAppName string = functions.outputs.appName
output apiAppName string = api.outputs.appServiceName
output appUrl string = staticWebApp.outputs.appUrl
