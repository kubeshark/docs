# EKS Persistent Storage

## Get EKS Cluster VPC  Subnets

### Pick the name of existing cluster

where EFS and Kubeshark to be deployed

```
aws eks list-clusters --query "clusters[]" --output text
```

and save for further usage

#### Get its node group names

```
aws eks list-nodegroups --cluster-name <picked cluster name> --query "nodegroups[]" --output text
```

and save them for further usage

#### Get its subnets

By subsequently calling for picked cluster and each its node group gotten above

```
aws eks describe-nodegroup --query "nodegroup.subnets[]" --output text --cluster-name <picked cluster name>  --nodegroup-name <node group name>
```

and save them for further usage

### Or create new cluster

```
eksctl create cluster --name my-kubeshark-dev-eks-cluster --nodegroup-name my-kubeshark-dev-eks-nodegroup-minimal --node-type m3.medium --nodes 2  --nodes-min 0 --nodes-max 2 --node-volume-size 10
```

#### Get its `subnets`

```
aws eks describe-nodegroup --query "nodegroup.subnets[]" --output text --cluster-name my-kubeshark-dev-eks-cluster  --nodegroup-name my-kubeshark-dev-eks-nodegroup-minimal
```

and save them for further usage



## Create and configure EFS

### Create dedicated security group 

to do not affect any existing security

```
aws ec2 create-security-group --query GroupId --output text --group-name MyEfsMountableFromEverywhereSecurityGroup --description "Opens inbound EFS/NFS port to be accessible from every host in subnet" 
```

and save its output (which is purely `GroupId` value) for further usage

#### Open inbound (ingress) NFS/EFS port `2049`

using above `GroupId`

```
aws ec2 authorize-security-group-ingress --group-id <GroupId> --protocol tcp --port 2049 --cidr 0.0.0.0/0
```

### Create filesystem

```
aws efs create-file-system  --query "FileSystemId" --output text
```

and save its output (which is purely `FileSystemId` value) for further usage

#### Make it accessible (mountable) for each cluster node

subsequently for each `subnet` gotten and saved above call all below

##### Create mount target

```
aws efs create-mount-target --query "MountTargetId" --output text --file-system-id <FileSystemId> --subnet-id <subnet> --security-groups <GroupId>
```

and save its output (which is purely `MountTargetId` value) for further usage

### Make EFS available on the cluster

#### Deploy the Amazon EFS CSI driver

```
kubectl apply -k "github.com/kubernetes-sigs/aws-efs-csi-driver/deploy/kubernetes/overlays/stable/ecr/?ref=release-1.3"
```

#### Create `StorageClass`

##### Create a file named e.g. `efs-sc.yaml` with the following content:

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: efs-sc
provisioner: efs.csi.aws.com
```

##### Deploy it

```
kubectl apply -f efs-sc.yaml
```

## Install/update Kubeshark

using `FileSystemId` value gotten and saved above

```
helm uninstall kubeshark
helm install kubeshark kubeshark/kubeshark --set tap.fileSystemIdAndPath=FileSystemId -f ./helm-chart/values-efs.yaml
```
