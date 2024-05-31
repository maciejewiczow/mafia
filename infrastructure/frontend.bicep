param name string
param location string = resourceGroup().location
@secure()
param password string
param apiResourceId string
param functionsResourceId string
param appInsightsId string
param appInsightsInstrumentationKey string
param appInsightsConnectionString string

resource frontend 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: {
    'hidden-link: /app-insights-resource-id': appInsightsId
    'hidden-link: /app-insights-instrumentation-key': appInsightsInstrumentationKey
    'hidden-link: /app-insights-conn-string': appInsightsConnectionString
  }
  sku: {
    name: 'Standard'
    size: 'Standard'
  }
  properties: {
    buildProperties: {
      outputLocation: './WebClient/build'
      skipGithubActionWorkflowGeneration: true
    }
  }
  resource defaultAuth 'basicAuth@2022-09-01' = {
    name: 'default'
    properties: {
      applicableEnvironmentsMode: 'AllEnvironments'
      password: password
      environments: null
      secretUrl: null
    }
  }
  resource backend 'linkedBackends@2023-12-01' = {
    name: 'my-backend'
    properties: {
      backendResourceId: apiResourceId
      region: location
    }
  }

  resource functions 'linkedBackends@2023-12-01' = {
    name: 'functions-backend'
    properties: {
      backendResourceId: functionsResourceId
      region: location
    }
  }
}

output appUrl string = 'https://${frontend.properties.defaultHostname}'
#disable-next-line outputs-should-not-contain-secrets
output deploySecret string = frontend.listSecrets().properties.apiKey
