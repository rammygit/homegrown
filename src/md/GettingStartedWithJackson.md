For quick how-to reference to get you started with Jackson Object Mapper.

```java
package checkparse;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 *
 */
public class DemoParse {

    public static void main(String args[]) throws Exception {
       
        parse(write());
    }

    /**
     *
     * @param json
     */
    private static void parse(byte[] json){
        ObjectMapper objectMapper = new ObjectMapper();

        String carJson =
                "{ \"brand\" : \"Mercedes\", \"doors\" : 5 }";

        try {
            Car car = objectMapper.readValue(json, Car.class);

            System.out.println("car brand = " + car.getBrand());
            System.out.println("car doors = " + car.getDoors());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     * @return
     * @throws Exception
     */
    private static byte[] write() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        Car car = new Car();        
        car.brand = "BMW";
        car.doors = 4;

       // String json = objectMapper.writeValueAsString(car);
        byte[] json = objectMapper.writeValueAsBytes(car);

        System.out.println(json);

        return json;
    }

    public static class Car {
        private String brand = null;
        private int doors = 0;

        public String getBrand() { return this.brand; }
        public void   setBrand(String brand){ this.brand = brand;}

        public int  getDoors() { return this.doors; }
        public void setDoors (int doors) { this.doors = doors; }
    }

}
```

The dependency to go with in pom.xml

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-core</artifactId>
  <version>{latest.version}</version>
</dependency>

<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-annotations</artifactId>
  <version>{latest.version}</version>
</dependency>

<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>{latest.version}</version>
</dependency>

```

This doesn't cover Jackson Annotation support and docs to go with. But few mostly used annotations in Jackson library.

```text
@JsonIgnore
@JsonAutoDetect
@JsonSetter
@JsonAnySetter
@JsonDeserialize
@JsonValue
@JsonSerialize
@JsonGetter
@JsonInclude
@JsonPropertyOrder
```

ref for details @ [Jackson-Annotations wiki](https://github.com/FasterXML/jackson-annotations/wiki/Jackson-Annotations)
