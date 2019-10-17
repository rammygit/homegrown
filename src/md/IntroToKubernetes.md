**Credits Due :** this is **From: Nigel Poulton. “The Kubernetes Book.** and **Kubernetes in action** and **kubernetes up and running** book notes together. These 
are recommended buys.

- Big Picture View 
- Masters
- Nodes 
- Pods
- Services
- Deployments

Kubernetes - An Orchestrator for Microservice App. 

## Premise/UseCase

There are multiple [`microservice`](https://martinfowler.com/articles/microservices.html) apps each running in its own container. But these individual microservices will need to talk to each other and each have its own job to do. Each service will have its own configurations and number of instances it need to run. Every service need to be scaled up and down.  So here is where Kubernetes ( which is usually mentioned as K8 )  comes into play. 

## Infrastructure
K8 has a master ( is incharge of worker nodes ) and nodes ( many nodes or workers which do the work ) . 

Master makes the decision which node to do the work. It is the controller. 

This master and multiple nodes make up **K8 cluster**

Then we have a deployment object , which is a configuration file which has instructions for the master to implement using the worker nodes.  You can think of Deployment as a high level requirement which the master or manager will implement using the worker or team member :) Best Analogy I can come up with.

![service_k8](/img/k8-big-picture.png)

## Master

Kubernetes is platform agnostic. It runs on Linux, but not opinionated underlying platform. Multi-master HA is doable and complex. 

Keep the Master is free of workload. It is clean that way.


### Apiserver  

- Entrypoint for master. It is the component we talk to the master. 
- It exposes API REST based. 
- It consumes JSON.

### Cluster Store 

- Persistence Storage. 
- Uses etcd. Open source key-value store. NoSQL DB. It is distributable. 
- It is the "source of truth" for cluster. 

### Controller Manager

- Node Controller 
- Endpoint Controller
- Namespace Controller and many more. 
- All managed by the Controller manager. 
- They are in tight loop and keeps watching for the failure and reports. 
- Helps maintaining desired state. 

### Kube-scheduler

- Watches apiserver for new pods
- Assign work to the nodes. 
- It does many more work. We will look later. 

APIServer is the only component that master exposes to the outside world. 

Kubectl is the command issuer to the APIServer in the master component. 

## Nodes 

- It is the unimportant but does all the work. It does what the master says. If it fails it gets swapped off. 

### Kubelet 

- It is the node. 
- It register the node with the cluster. 
- Watches apiserver
- Instiantias the pods.
- Reports back to master.
- Exposes :10255 let you inspect the kubelet. 

### Container Engine

- Responsible for the pulling images 
- Start/ Stop Container. 
- Usually Docker. 

### Kube-proxy

- Network brain of node
- Makes sure every node gets a unique ip. One IP per pod. 
- If a single pod runs multiple container, then all the containers will share the single IP. 
- Does lightweight load-balancing. 
- Service is a way of hiding multiple nodes behind one service. 


## Desired State 

How the workflow of K8 looks like internally. 

- We declare the desired state of an application/microservice in a config file. ( JSON or YAML )
- We post it to APiServer ( in master ) using Kubectl on port 443.
- K8 will store this state in its key-value store of the cluster.
- K8 will inspects the config to figure out the controller it has to send the command to. 
- K8 will then send the workload to nodes in the cluster.
- K8 will deploys the application.
- K8 will do monitoring forever loops to make sure cluster remains in the desired state. 

## Nodes 

- K8 will run the container within the pod. 
- You can run multiple container within a pod. 
- you can mount and set up namespaces and network stack. 
- All container share the pod resource. 
- Tight coupling can stay within pod. Side car container. 
- Unit of scaling in K8 is pod. 
- Pods are atomic. Pod is not available until everything is up within it. 
- Pod Lifecyle
	- pending -> running -> failed.

### Deploying Pods 

- Usually via higher level objects. 
- Using replication controller , etc

## Services 

![service_k8](/img/K8_service.png)

- When pods are scaled up and down or when they fail, each new pod assumes totally new unique IP. 
- so we have other pods talk to a "SERVICE"
- Service will have a unique IP and DNS.
- Service will manage nodes. 
	- It will know when nodes spring up or fail. It will register the nodes within it. 
- Higher level abstraction for lower level pods. 
- Services will send traffic only to healthy pod. 
- 
- Way a pod belongs to a service is via "LABEL"

### Labels

- Each pods gets Labels
- Service selects pods based on Labels and load balances between them.

![service-labels](/img/k8-service-labels-replicasets.png)


## Pod Theory 

- Pod is the atomic unit of deployment and scaling. 
- Multiple containers can share a single pod. 
- All the containers will share the network resources, IP, and all the resource. 
- If you want to access different container, you do that with port number of the containers deployed in that pod exposes.


## Container -> Pod -> ReplicaSets -> Deployments



## Services 

- REST Object in K8 API
- Its an abstraction.
- To connect to pod replica. 
- Service IP does not change. It is in for-front of pod replicas. 
- Service does load-balance access to pods.
- Client just connects to Service. 
- Service will send traffic to healthy pod.
- It has 
	- Virtual IP
	- DNS
	- Port
- When you create Service, you create Endpoint Object. 
- As pod come and go, Endpoint gets updated.
- Pods are tied to service through 'LABELS'

### Service Discovery ( Need to be Updated )

- DNS based.
- Environment Variables. 

### Service Type

- **ClusterIP**: Stable internal cluster IP. Default.
- **NodePort**: Exposes the app outside of the cluster by adding a cluster-wide port on top of clusterIP.
- **LoadBalancer**: Integrates nodeport with cloud-based load balancers.

```yaml
# svc.yml

apiVersion: v1
kind: Service
metadata:
  labels:
    run: myapp-service
  name: myapp-service
spec:
  ports:
  - port: 9000
    protocol: TCP
    targetPort: 9000
  selector:
    run: myapp-service
  sessionAffinity: None
  type: NodePort

```


```bash

Kubectl describe pods | grep app
 # selector part of svc should match with the pod. 

# create the service
Kubectl create -f svc.yml

# now lets see the created service.
Kubectl describe svc myapp-service

# we can see the endpoint 
Kubectl get ep my app-service

# describe the endpoint
Kubectl describe ep myapp-service

```

## Deployments

- Helps in rolling update & rollbacks. 
- They are high-level objects in Kubernetes API 
- Deployments are defined in a declarative way
- Deployments manage replica sets. ( replica sets manage pods ) 

```yml
# deployment.yml

apiVersion: apps/v1beta2
kind: Deployment
metadata:
  name: myapp-service
spec:
  replicas: 10
  selector:
    matchLabels:
      app: myapp-service
  minReadySeconds: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    metadata:
      labels:
        app: myapp-service
    spec:
      containers:
      - name: myapp-service
        image: localhost:5000/myimage:latest
        ports:
        - containerPort: 8080 
```

Kind - field to tell kind of objects. This will send to Deployment Controller.

```bash
Kubectl create deployment -f deployment.yml
```

```bash

# to see deploy details 
Kubectl get deploy hello-deploy

# more details on deployment
Kubectl describe deploy hello-deploy

# replica sets are automatically created when we create deployment

kubectl get rs 

```


We create service to access the application from an IP or DNS. 

**Service: its wrapper for pods access, see above for details**

```bash
# svc.yml is your declarative file you create with what you # want.  see above for sample svc.yml file.

kubectl create svc svc.yml
```

### Rolling Updates 

- To perform rolling updates, we need to update **spec.template.spec.containers.** section to reference new image.

```yml
spec:
  replicas: 10
  selector:
    matchLabels:
      run: hello-deploy
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
    type: RollingUpdate
```

- since we have max surge as 1 and desired replicas is 10, we will never have more than 11 pods in the app during update process. 

```bash

# we can monitor rollout status 
kubectl rollout status deployment hello-deploy

#Excerpt From: Nigel Poulton. “The Kubernetes Book.”
```



















