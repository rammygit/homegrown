---
PageTitle: Maven Profile Override
LinkTitle: How to Override Maven Profiles
Date: 09/01/2019
Author: Ramkumar

---

## Maven Profile Override

Recently I came across this use case where we have a parent pom and child project which points to the parent POM in its pom.xml. We all assume the obvious here, that you should be able to override anything defined in the parent POM. But it turns out that it is the not the case. 

If you have defined a profile in the parent's POM, it cannot be overriden without having to duplicate the code/profile back in the child and overwrite the <configuration> etc. Since in my case I wanted to override the sonar coverage plugin which was defined in the parent in the child. 

what do I want to override ? Exclusions. There are certain folders / packages that I dont want to be tracked as part of the code coverage. DTO , Entities need not be covered. This was affecting the needed code base coverage percentage & adding noise to the metrics. 


### Solution: 

We decided we should not deuplicate the code present in Parent POM. so how to go about this. we were using `Jacoco-maven-plugin` , look for the [source code](https://github.com/jacoco/jacoco/tree/master/jacoco-maven-plugin) here. we wanted to pass the exclusion as a property to the parent POM from child. easy-peasy. but it didnt turn out to be as usual :) 

#### Problem we had with this solution 

If you look at how plugin allows us to specify the exclusions from the doc [here](https://www.eclemma.org/jacoco/trunk/doc/maven.html)

```xml

<configuration>
    <excludes>
        <exclude>**/*Config.*</exclude>
        <exclude>**/*Dev.*</exclude>
    </excludes>
</configuration>

```

It allows to specify them as individual <exclude> within the <excludes> , its API doc shows setExcludes(List<String> exclude) , it accepts List<String>. But this is adding the complexity to the solution we wanted to have, where we want to pass as a single property back from child to the parent POM. 

In our case of microservices, each microservice can have its own exlcusions and want to passed on to the parent POM on its build time 

so when we run , 

```bash

mvn -P <profileName> clean install 



```

This should execute the unit test and run the coverage report excluding the passed in property. But as you see above, this is not possible as it passing in as multiple <exclude> in the configuration. 

so I ended up digging into the maven plugin [source code](https://github.com/jacoco/jacoco/tree/master/jacoco-maven-plugin).Here you find FileFilter.java

```java

/**
 * A file filter using includes/excludes patterns.
 */
public class FileFilter {
....


  private String buildPattern(final List<String> patterns,
			final String defaultPattern) {
		String pattern = defaultPattern;
		if (CollectionUtils.isNotEmpty(patterns)) {
			pattern = StringUtils.join(patterns.iterator(), ",");
		}
		return pattern;
  } 

}

	
``` 
 

Here I find the build pattern accepts ','(comma ) separated string patterns. So I ended up having property declared in parent POM as below. 

```xml
<properties>
 <excludes.pattern>**/config/*</excludes.pattern>
</properties>

....

                          <plugin>
│                             <groupId>org.jacoco</groupId>
│                             <artifactId>jacoco-maven-plugin</artifactId>
│                             <version>${plugin-version}</version>
│                             <configuration>
│                                <excludes>
│                                  <exclude>${excludes.pattern}</exclude>
│                                </excludes>
│                             </configuration>
│                         </plugin>



```

and then in your child POM 

```xml

<properties>
	<excludes.pattern>**/path/*,**/path1/*,...</excludes.pattern>
</properties>

```


This is not documented but will come handy if you want to pass this as a single property.


Hope you find this useful !!