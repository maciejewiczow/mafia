@secure()
param swaPassword string
param location string = resourceGroup().location
param apiAccessTokenLifeSpan string = '00:20:00'

module database 'database.bicep' = {
  name: '${deployment().name}-mongo'
  params: {
    databaseName: 'mafia'
    region: location
  }
}

module functions 'functions.bicep' = {
  name: '${deployment().name}-functions'
  params: {
    appInsightsLocation: location
  }
}

module api 'api.bicep' = {
  name: '${deployment().name}-api'
  params: {
    appServicePlanSku: 'F1'
    accessTokenLifeSpan: apiAccessTokenLifeSpan
    turnFunctionUrl: functions.outputs.url
    mongoDbConnectionString: database.outputs.connectionString
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
  }
  dependsOn: [
    api
  ]
}

output functionAppName string = functions.outputs.appName
output apiAppName string = api.outputs.appServiceName
output appUrl string = staticWebApp.outputs.appUrl
output apiUrl string = '${api.outputs.appServiceUrl}/api'
