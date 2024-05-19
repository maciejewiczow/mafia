@secure()
param swaPassword string
param location string = resourceGroup().location
param apiAccessTokenLifeSpan string = '00:20:00'

@secure()
param mongoDbConnectionString string

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${deployment().name}-appinsigts'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}

module functions 'functions.bicep' = {
  name: '${deployment().name}-functions'
  params: {
    appInsightsKey: applicationInsights.properties.InstrumentationKey
  }
}

module api 'api.bicep' = {
  name: '${deployment().name}-api'
  params: {
    appServicePlanSku: 'F1'
    accessTokenLifeSpan: apiAccessTokenLifeSpan
    turnFunctionUrl: functions.outputs.url
    mongoDbConnectionString: mongoDbConnectionString
    appInsightsKey: applicationInsights.properties.InstrumentationKey
    appInsigtsConnnectionString: applicationInsights.properties.ConnectionString
  }
  dependsOn: [
    functions
  ]
}

module staticWebApp 'frontend.bicep' = {
  name: '${deployment().name}-frontend'
  params: {
    name: 'mafia-swa'
    password: swaPassword
    apiResourceId: api.outputs.appServiceId
    appInsightsConnectionString: applicationInsights.properties.ConnectionString
    appInsightsId: applicationInsights.id
    appInsightsInstrumentationKey: applicationInsights.properties.InstrumentationKey
  }
  dependsOn: [
    api
  ]
}

output functionAppName string = functions.outputs.appName
output apiAppName string = api.outputs.appServiceName
output appUrl string = staticWebApp.outputs.appUrl
output frontendDeploySecret string = staticWebApp.outputs.deploySecret
