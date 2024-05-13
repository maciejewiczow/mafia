@description('Generate unique String for resource names')
var uniqueFullRGString = uniqueString(resourceGroup().id)

@description('Short unique name based on RG name')
var uniqueRGString = take(uniqueFullRGString, 4)

@description('Resource group location')
param location string = resourceGroup().location

@description('Azure Tenant Id')
var azureTenantId = tenant().tenantId

@description('App Service Plan SKU')
param appServicePlanSku string = 'F1'

param accessTokenLifeSpan string = '00:20:00'

param turnFunctionUrl string

param mongoDbConnectionString string
param appInsightsKey string
param appInsigtsConnnectionString string

@description('App Service Plan name')
var appServicePlanName = 'App-${uniqueRGString}'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
  }
  properties: {
    reserved: true
  }
  kind: 'linux'
}

resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: appServicePlanName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|3.1'
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

resource appServiceConfig 'Microsoft.Web/sites/config@2023-12-01' = {
  parent: appService
  name: 'appsettings'
  properties: {
    TenantId: azureTenantId
    AccessToken__LifeSpan: accessTokenLifeSpan
    AccessToken__Signature: guid(resourceGroup().id, deployment().name, 'access-token')
    RefreshToken__Signature: guid(resourceGroup().id, deployment().name, 'refresh-token')
    TurnFunction__BaseAddress: turnFunctionUrl
    TurnFunction__FunctionKey: ''
    TurnFunction__CallbackTokenSignature: guid(resourceGroup().id, deployment().name, 'turn-function-token')
    TurnFunction__CallbackUrl: 'https://${appService.properties.defaultHostName}/api/TurnCallback'
    ConnectionStrings__Mongo__Base: mongoDbConnectionString
    APPINSIGHTS_INSTRUMENTATIONKEY: appInsightsKey
    APPLICATIONINSIGHTS_CONNECTION_STRING: appInsigtsConnnectionString
  }
}

output appServiceId string = appService.id
output appServiceUrl string = appService.properties.defaultHostName
output appServiceName string = appService.name
