@description('Cosmos DB account name')
param accountName string = 'mongodb-${uniqueString(resourceGroup().id)}'

@description('Location for the Cosmos DB account.')
var location = resourceGroup().location

@description('The primary replica region for the Cosmos DB account.')
param region string

@description('Specifies the MongoDB server version to use.')
@allowed([
  '3.2'
  '3.6'
  '4.0'
  '4.2'
])
param serverVersion string = '4.2'

@description('The name for the Mongo DB database')
param databaseName string

@description('Maximum autoscale throughput for the database shared with up to 25 collections')
@minValue(1000)
@maxValue(1000000)
param sharedAutoscaleMaxThroughput int = 1000

resource account 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' = {
  name: toLower(accountName)
  location: location
  kind: 'MongoDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Eventual'
    }
    locations: [
      {
        locationName: region
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
    enableAutomaticFailover: true
    apiProperties: {
      serverVersion: serverVersion
    }
    capabilities: [
      {
        name: 'DisableRateLimitingResponses'
      }
    ]
  }
  resource database 'mongodbDatabases@2022-05-15' = {
    name: databaseName
    properties: {
      resource: {
        id: databaseName
      }
      options: {
        autoscaleSettings: {
          maxThroughput: sharedAutoscaleMaxThroughput
        }
      }
    }
  }
}

#disable-next-line outputs-should-not-contain-secrets
output connectionString string = account.listConnectionStrings().connectionStrings[0].connectionString
