@description('Name for the container group')
param name string = 'mongocontainergroup'

@description('Location for all resources.')
param location string = resourceGroup().location

@secure()
param databasePassword string
param databaseUsername string

@description('Port to open on the container and the public IP address.')
param port int = 27017

resource containerGroup 'Microsoft.ContainerInstance/containerGroups@2023-05-01' = {
  name: name
  location: location
  properties: {
    containers: [
      {
        name: name
        properties: {
          image: 'mongo:7.0.9'
          ports: [
            {
              port: port
              protocol: 'TCP'
            }
          ]
          environmentVariables: [
            { name: 'MONGO_INITDB_ROOT_USERNAME', value: databaseUsername }
            { name: 'MONGO_INITDB_ROOT_PASSWORD', secureValue: databasePassword }
          ]
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 2
            }
          }
        }
      }
    ]
    osType: 'Linux'
    restartPolicy: 'OnFailure'
    ipAddress: {
      type: 'Private'
      ports: [
        {
          port: port
          protocol: 'TCP'
        }
      ]
    }
  }
}

#disable-next-line outputs-should-not-contain-secrets
output connectionString string = 'mongodb://${databaseUsername}:${databasePassword}@${containerGroup.properties.ipAddress}:${port}/?readPreference=primary&ssl=true'
