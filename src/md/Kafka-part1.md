---
PageTitle: Intro to Kafka - Part 1
Date: 10/01/2019
Author: Ramkumar
---
Distributed commit log or Distributed streaming platform(recently).

## Basic outline and Big Picture  

 [Read this for message concepts](https://medium.com/@madhur25/meaning-of-at-least-once-at-most-once-and-exactly-once-delivery-10e477fafe16)
 
 [How do you choose the number of topics and partitions](https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/)
    
![Image of Kafka General](/img/kafka_general_new.png)



### Message  

- unit of data in kafka. 
- Array of bytes
- Can have an optional - key.
- Keys are used for writing to partitions in controlled manner.
- Messages are written in batches. Batching done for efficiency.

### Schemas 

JSON or XML are ease, but lack type handling and compatibility between schema versions. 

To solve , Apache Avro is recommended.

### Topics and Partitions

- More like a table or folder. 
- Topics are further broken down to partitions. 
- Topics are append-only. 
- Read in order from beginning to end. 
- Ordering guaranteed only within a partition and not within a topic. 
- Single partition cannot be split across multiple brokers.

### Producers 

- Producers creates new messages to write to a specific topic.

- By default producers dont care which partition of a topic the   message gets written to, messages will be partitioned evenly. 

- We can write to specific partition using message key and partitioner will map to particular partition using the hash of the key.

### Consumers

- Consumer reads messages in the order the message was produced from one or more topic.
- Consumer keeps track of messages read by offset. 
- Each message has an offset. Offset is incremented as messages arrive.

### Consumer group 

- One or more consumers reading from a topic. 
- Group assures each partition is read by a only one consumer, this is called ownership.
- If a single consumer fails, other consumers will take over the partition and read from them.

### Brokers

- A single kafka server is a broker.

- single broker can handle millions of message based on the hardware.

- Brokers can work in a cluster. One broker will serve as controller from the farm of kafka brokers.

- Broker which administer the cluster is the leader. 

- A partition can be replicated to other brokers so if one broker fails, other broker can take over.
- Replication works only within the single cluster and not between the cluster.
- To replicate between cluster, Mirrormaker is a tool part of kafka is used.

### Retention policy

Unlike MQ, each broker can be configured with certain retention period. It can vary from hours to days based on the use-case.


## Producer 

Producer record - will contain 
	
- 	Topic - mandatory
- 	Partition
- 	key 
- 	Value - this is our Message  & mandatory.

#### Partitioner

If partition is specified in the producer record, partitioner does nothing. 

If not, partitioner will chose the partition for us, usually based on the key in the producer record. 

#### RecordMetaData

Is the response from Broker If the message is written to kafka successfully.

It contains,
- Topic
- Partition
- Record offset.

Error is returned if writing to kafka fails. ( retry does happen before sending out an error )

### Producer Config

**Bootstrap.servers** , is a list of brokers for producer to connect to with host:port. Recommended setting of 2 brokers for fail-overs.

**Key.serializer**, class which is used to serialize the keys of the record/message we write to kafka broker. 

**value.serializer**, class which used to serialize the value. 

**P.S** - we need to serialize as kafka brokers expect byte arrays for keys and value.

```java
Map<String, Object> props = new HashMap<>();
props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "broker1:9092,broker2:9092");
props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);      
props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
```

Complete list of producer configs are present here. 

[producer config list](http://kafka.apache.org/documentation.html#producerconfigs)


Few configs for reliability, memory use and performance. Finding right balance. 

```java
Map<String, Object> configProps = new HashMap<>();
configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
// basically expects the leader replica received the
// message before considering the message received successfully by the broker.
// if this config value is all, then all the replicas will receive the message
// before the message is considered received successfully.
configProps.put(ProducerConfig.ACKS_CONFIG,1);
// for low volume usage.
// update this based on hardware config review.
configProps.put(ProducerConfig.BUFFER_MEMORY_CONFIG,40960);
//default has no compression enabled. has low cpu overhead than other option of gzip or lz4.
configProps.put(ProducerConfig.COMPRESSION_TYPE_CONFIG,"snappy");
//no,of retries on transient errors returned by broker. "e.g leader partition not available"
configProps.put(ProducerConfig.RETRIES_CONFIG,3);
//delay between the retries, in ms.
// default 100 ms. this is for transient errors from broker.
configProps.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG,300);
// 100kb mem alloc for batching to same partition.
configProps.put(ProducerConfig.BATCH_SIZE_CONFIG,100);
// per client basis producer for the client identification for logging and metrics.
configProps.put(ProducerConfig.CLIENT_ID_CONFIG,"CLIENTID");
// Max message size we can send to broker. recommended to match broker's config "message.max.bytes"
// max a broker can accept.
configProps.put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG,500);
```


### Partitions

- Message produced without a key, will be written to any of the  available partition using a round-robin algorithm.

- If we want to have a certain set of messages written to same partition, we can use key and Kafka uses Hash and makes it possible write to same partition. 

- Key to partition mapping is valid only until the no.of partition does not change. 

- Always choose enough partition and don't change them later.

#### Custom Partitioner

Kafka has a default partitoner, but we can create a custom partitioner if we want to. 

Will Need to implement Partitioner interface. 

> public class CustomPartitioner implements Partitioner 


## Consumers

One that reads the message off the broker from a specific topic and partition. 

### Consumer groups 

- When multiple consumers subscribed to same topic and belong in same consumer group, each consumer will receive message from diff subset of partition.

- If Topic has 4 partitions and consumer group 1 has 1 consumer, then all the messages from all the partitions will be read the consumer 1 from CG1 

- kafka scales horizontally by adding more consumers to the consumer group. So if we have more consumers in CG ( consumer group ) than partition, some consumers will be idle without receiving any messages. 

- We can have multiple consumer groups ( CG )

- If we add new consumer group CG2, CG2 receives all messages from same topic independent of CG1. 

#### Partition Rebalance. 

- Adding new consumer to the group or consumer crashing and leaving the group , reading the messages from partition ownership will be changed. 

- This ensures high-availability.

- Rebalance will create a small window of unavailability. 

- Consumers will lose state on rebalancing. 

- First consumer to join the CG will become a group leader.


### Consumer Config

- 3 mandatory configuration are required at the consumer end. 

	- Bootstrap.servers
	- key.deserializer
	- value.deserializer

- 4th property that is not mandatory but highly used is 
group.id - specifies consumer group the consumer belongs to.

- We can create consumer without a group but we always go with a group for scalability. 

```java
props.put("bootstrap.servers", "broker1:9092,broker2:9092");
props.put("group.id", "MoneyCounter");
props.put("key.deserializer",
  "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer",
  "org.apache.kafka.common.serialization.JSONDeserializer")
```

#### Poll loop

- Consumers infinitely loop to read the messages from subscribed topics. 

- Single consumer can subscribe to multiple topics. 

> ConsumerRecord records = consumer.poll(100);

- Here we poll every 100 ms. 

### Consumer Configuration for fine tuning.

```java
Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,bootstrapAddress);
        props.put(ConsumerConfig.GROUP_ID_CONFIG,groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,JSONDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        //minimum amount of bytes before fetching the message from the broker.
        props.put(ConsumerConfig.FETCH_MIN_BYTES_CONFIG,1024 * 1024);
        props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG,
                "org.apache.kafka.clients.consumer.RoundRobinAssignor");
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG,1);
```


### Commit and Offsets

- Consumer Poll() for reading records.

- Consumer use offset (position) to track their current position in each partition.

- Updating the current position or offset is called commit. 

#### Process of commit

- Consumer produces a message to broker at _consumer_offsets topic with current position for each partition. 
- When any crash or new consumer joins, rebalance will trigger, after rebalance consumers will be handed a new partition.
- After a rebalance, consumer will read from the last committed offset. 

##### Edge Case. 

- If committed offset < last offset processed by consumer, messages in-between will be processed twice. 
- If committed offset > last offset processed by consumer, all the messages in-between will be missed.

#### AutoCommit

enable.auto.commit = true. , every 5 sec (default) consumer will commit the largest offset it received from poll() operation. 
Config option , auto.commit.interval.ms can be set to anything apart from the default.

##### Cons of auto commit 

If rebalance happens within the specified time interval of auto commit, we might end up duplicating the message processing.

#### Commit Manually

Set enable.auto.commit = false, then we have 2 options to commit 

CommitSync() - will commit the latest offset returned by poll() and will fail if commit was not successful.

commitSync() will retry as much as possible before throwing error on failure. 

##### cons of sync commit

Consumer is blocked until the commit action responds. So throughput will suffer.

##### Commit Asynchronously

consumer.commitAsync() - doesnt get blocked for the response from broker from the commit request.

##### cons of async commit

- It will not retry
- Commit order will not be maintained with the async retry.
- To maintain the right order in async commit, is to increase a seq num. 

// code goes in here to show this pattern. 


#### TO make sure the commit is successful.

- We combine sync and async commits.
- when everything is fine, use commitAsync().
- when we are closing and no next commit, use commitSync() as it will retry until it succeeds.

### Rebalancing Listeners

We can take certain actions in consumer when there is a rebalanced trigger happened due to partition added or consumer crashes. 

#### ConsumerRebalanceListener 

It has 2 methods we can implement. 

- onPartitionRevoked(Collection<TopicPartition> partitions)
	- called before rebalancing starts.
	- called after consumer stopped consuming messages
	- so we want to commit messages here, so next consumer will know where to start. 

- onPartitionAssigned(Collection<TopicPartition> partitions)
	- called after partitions have been assigned to the broker. 
	- called before consumer starts consuming messages. 

### Consuming records from specific offset.

- we use seek() to update the position on the partition for the consumer. 
- we can use seekToBeginning() and seekToEnd()
- we can write the offset to external store like noSQL or DB.
- we can seek from particular offset for a partition 
	- consumer.seek(partition, offset);
- seek() will only update the position, so the next poll() called, we retrieve message from the offset. 


To continue on Part 2 .... 






















