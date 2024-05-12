param name string
param location string = resourceGroup().location
@secure()
param password string
param apiResourceId string

resource frontend 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: null
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
}

output appUrl string = 'https://${frontend.properties.defaultHostname}'
