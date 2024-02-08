---

title: Using AWS EFS as a Persistent Volume
description: Guide on utilizing EFS as a persistent volume
layout: ../../layouts/MainLayout.astro
---

Mount an EFS volume in RWX mode by using a filesystem ID and mountpoints across all subnets in all node groups. Ensure you have an EFS storage class name. Follow the [instructions below](/en/efs#tldr---configure-an-efs-volume) for provisioning.

## Prerequisites

- EFS storage class named: `efs-sc`
- Filesystem ID: `<filesystem-id>`

## Use in Kubeshark

Configure the following to utilize the persistent volume:

```yaml
tap:
  persistentStorage:    true
  storageClass:         efs-sc                    # prerequisite
  storageLimit:         5Gi                       # An example
  fileSystemIdAndPath:  <filesystem-id>           # Prerequisite
```

## TL;DR - Configure an EFS Volume

### Prerequisites

Prepare the following information:
- Cluster region:     `<cluster-region>`
- Node group subnets: `<subnet-id>`
- EKS cluster VPC-ID: `<cluster-vpc-id>`

### Create a Dedicated Security Group 

```shell
aws ec2 create-security-group \
--query GroupId \
--output text \
--group-name MyEfsMountableFromEverywhereSecurityGroup \
--description "Opens inbound EFS/NFS port to be accessible from every host in subnet" \
--region <cluster-region> \      # Prerequisite
--vpc-id <cluster-vpc-id>        # Prerequisite
```
Save the group ID for the following command: `<security-group-id>`.

### Open Inbound (Ingress) NFS/EFS port `2049`

Authorize ingress on port 2049 for the security group created above in your cluster region.

```shell
aws ec2 authorize-security-group-ingress \
--group-id <security-group-id>  \   # From the previous command
--protocol tcp \
--port 2049 \
--cidr 0.0.0.0/0 \
--region <cluster-region>           # Prerequisite
```

### Create Filesystem

Create a file system in your cluster region and note the filesystem ID.

```shell
aws efs create-file-system  \
--query "FileSystemId" \
--output text \
--region <cluster-region>          # Prerequisite  
```
Save the filesystem ID for the following command: `<filesystem-id>`.

### Create Mount-points in Each Subnet

For each subnet across all node groups, create mount targets to provide all pods access to the file system. Use the filesystem ID and security group ID from the previous steps.

```shell
aws efs create-mount-target \
--query "MountTargetId" \
--output text 
--file-system-id <filesystem-id> \      # From previous command
--subnet-id <subnet-id> \               # Prerequisite
--security-groups <security-group-id> \ # From previous command
--region <cluster-region>               # Prerequisite
```

### EKS specific

#### Deploy the Amazon EFS CSI driver

Deploy the Amazon EFS CSI driver using the stable ECR release.

```shell
kubectl apply -k "github.com/kubernetes-sigs/aws-efs-csi-driver/deploy/kubernetes/overlays/stable/ecr/?ref=release-1.3"
```

###  OpenShift only

#### STS cluster only

##### Create IAM role for EFS CSI Driver Operator

###### Create IAM role trust/assume policy

To allow assume this IAM role by the current IAM account

Get **IAM account ID** and save for further usage:

```shell
aws sts get-caller-identity \
  --query Account \
  --output text
```

Get **IAM OIDC (OpenID Connect) provider** and save for further usage omitting `https://` at the beginning and `%` at the end:

```shell
oc get authentication.config.openshift.io cluster \
  -o jsonpath='{.spec.serviceAccountIssuer}'
```

Create file `TrustPolicy.json` with below content, replacing `<IAM ACCOUNT ID>` and `<IAM OIDC PROVIDER>` with above outputs appropriately:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<IAM ACCOUNT ID>:oidc-provider/<IAM OIDC PROVIDER>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_PROVIDER}:sub": [
            "system:serviceaccount:openshift-cluster-csi-drivers:aws-efs-csi-driver-operator",
            "system:serviceaccount:openshift-cluster-csi-drivers:aws-efs-csi-driver-controller-sa"
          ]
        }
      }
    }
  ]
}
```

Create IAM role using above file and replacing `<CLUSTER NAME`> with the name of the current cluster
```shell 
aws iam create-role \
  --role-name "<CLUSTER NAME>-aws-efs-csi-operator" \
  --assume-role-policy-document file://TrustPolicy.json \
  --query "Role.Arn" --output text
```

Save its output which is **`ARN`** of new created **IAM role** for further usage

###### Create IAM policy

Create file named `efs-policy.json` with below content

```json
efs-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "elasticfilesystem:DescribeAccessPoints",
        "elasticfilesystem:DescribeFileSystems",
        "elasticfilesystem:DescribeMountTargets",
        "elasticfilesystem:TagResource",
        "ec2:DescribeAvailabilityZones"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "elasticfilesystem:CreateAccessPoint"
      ],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:RequestTag/efs.csi.aws.com/cluster": "true"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": "elasticfilesystem:DeleteAccessPoint",
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/efs.csi.aws.com/cluster": "true"
        }
      }
    }
  ]
}
```

Create IAM policy using above file and replacing `<CLUSTER NAME`> with the name of the current cluster:

```shell
aws iam create-policy --policy-name "<CLUSTER NAME>-rosa-efs-csi" \
   --policy-document file://efs-policy.json \
   --query 'Policy.Arn' \
   --output text
```

Save its output which is **`ARN`** of new created **IAM policy**  forbelow use

###### Attach IAM policy to the role

Call below while replacing `<CLUSTER NAME>` and `<IAM POLICY ARN>` with ones gotten above

```shell
aws iam attach-role-policy \
   --role-name "<CLUSTER NAME>-aws-efs-csi-operator" \
   --policy-arn <IAM POLICY ARN>
```

##### Create `Secret`

Create file `efs-secret.yaml` with below content while replacing `<ROLE ARN>`  with one gotten above

```yaml
apiVersion: v1
kind: Secret
metadata:
 name: aws-efs-cloud-credentials
 namespace: openshift-cluster-csi-drivers
stringData:
  credentials: |-
    [default]
    sts_regional_endpoints = regional
    role_arn = <ROLE ARN> 
    web_identity_token_file = /var/run/secrets/openshift/serviceaccount/token
```

Deploy it:

```shell
oc apply -f efs-secret.yaml
```



####  Subscribe to the Operator

Create a file named efs-operator.yaml with below content

```yaml
apiVersion: operators.coreos.com/v1
kind: OperatorGroup
metadata:
  generateName: openshift-cluster-csi-drivers-
  namespace: openshift-cluster-csi-drivers
---
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  labels:
    operators.coreos.com/aws-efs-csi-driver-operator.openshift-cluster-csi-drivers: ""
  name: aws-efs-csi-driver-operator
  namespace: openshift-cluster-csi-drivers
spec:
  channel: stable
  installPlanApproval: Automatic
  name: aws-efs-csi-driver-operator
  source: redhat-operators
  sourceNamespace: openshift-marketplace
```

Deploy it:

```shell
oc create -f efs-operator.yaml
```

Check its status:

```shell
oc describe operator aws-efs-csi-driver-operator
```

####  Installing the AWS EFS CSI Driver

Create a file named efs-driver.yaml with below content

```yaml
apiVersion: operator.openshift.io/v1
kind: ClusterCSIDriver
metadata:
    name: efs.csi.aws.com
spec:
  managementState: Managed
```

Deploy it:

```shell
oc apply -f efs-driver.yaml 
```

Check its status:

```shell
oc describe clustercsidriver ebs.csi.aws.com
```

### Create a `StorageClass`

Create a file named `efs-sc.yaml` with either of below content (depending from your infrastructure and cluster configuration/requirements)  and deploy it using kubectl.

#### Dynamically provisioned

Simpler and suitable in most cases. Kubehark and all other persistent volume claims with specified below storage class will be provisioned to the automatically created unique directory on the EFS with specified below file system ID 

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass         
metadata:
  name: efs-sc # Any arbitrary name can be chosen
provisioner: efs.csi.aws.com
parameters:   
  provisioningMode: efs-ap
  directoryPerms: "700"
  fileSystemId: <FileSystemId> # From previous command
```

#### Statically provisioned

In this case EFS file system ID should be specified during Kubeshark deployment (e.g. via `--set` in Helm). Can be helpful e.g. if some infrastructure has requirement (e.g. defined by organization) to use only some directory pre-created specially for Kubeshark with specific permissions on the EFS file system which is used for other EFS persistent volume claims as well

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: efs-sc
provisioner: efs.csi.aws.com
```
Deploy it:

```yaml
kubectl apply -f efs-sc.yaml
```