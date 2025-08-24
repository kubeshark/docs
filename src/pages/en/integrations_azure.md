---
title: Upload Files to Azure Blob Storage
description: Kubeshark enables you to generate files (e.g. PCAPs) and upload them to an immutable datastore (e.g. Azure Blob Storage).
layout: ../../layouts/MainLayout.astro
---

The Azure Blob Storage integration provides an immutable datastore option in case you want to export files outside of the K8s cluster.

You can read the [helper](/en/automation_helpers) section to learn more about the available Azure helpers.

The most common helper would be the `vendor.azure.put` helper that uploads a file using various authentication methods.

## Authentication Methods

The Azure integration supports multiple authentication methods:

### 1. Using Connection String
```js
vendor.azure.put(
  env.AZURE_CONTAINER_NAME,
  tarFile,
  "", // accountName (not needed with connection string)
  "", // accountKey (not needed with connection string)
  env.AZURE_CONNECTION_STRING
);
```

### 2. Using Account Name and Key
```js
vendor.azure.put(
  env.AZURE_CONTAINER_NAME,
  tarFile,
  env.AZURE_ACCOUNT_NAME,
  env.AZURE_ACCOUNT_KEY
);
```

### 3. Using Default Azure Credentials (Managed Identity)
```js
vendor.azure.put(
  env.AZURE_CONTAINER_NAME,
  tarFile,
  env.AZURE_ACCOUNT_NAME
);
```

## Configuration Examples

### Connection String Method
In either `config.yaml` or `values.yaml`, the environment variables should look like this:
```shell
scripting:
  env:
    AZURE_CONTAINER_NAME: <container-name>
    AZURE_CONNECTION_STRING: "DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net"
```

### Account Name and Key Method
```shell
scripting:
  env:
    AZURE_CONTAINER_NAME: <container-name>
    AZURE_ACCOUNT_NAME: <storage-account-name>
    AZURE_ACCOUNT_KEY: <storage-account-key>
```

### Managed Identity Method
```shell
scripting:
  env:
    AZURE_CONTAINER_NAME: <container-name>
    AZURE_ACCOUNT_NAME: <storage-account-name>
```

## Function Signature

The `vendor.azure.put` function accepts the following parameters:

- `containerName` (string, required): The name of the Azure Blob Storage container
- `path` (string, required): The local file path to upload
- `accountName` (string, optional): The Azure storage account name
- `accountKey` (string, optional): The Azure storage account key
- `connectionString` (string, optional): The Azure storage connection string

## Return Value

The function returns the blob URL of the uploaded file:
```
https://<account-name>.blob.core.windows.net/<container-name>/<node>_<ip>/<filename>
```

## Notes

- Files are automatically prefixed with the node name and IP address for organization
- The function automatically detects the content type of the uploaded file
- When using managed identity, ensure your cluster has the appropriate Azure identity configuration
- The container must exist before uploading files to it