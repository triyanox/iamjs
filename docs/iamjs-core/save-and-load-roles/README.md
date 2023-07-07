# Save and load roles

These `Role` instance methods provide flexibility and interoperability in working with role instances, allowing you to easily convert between different representations while maintaining the core role data and behavior.

1. `toObject()`: Converts the role instance to a plain JavaScript object representation.
2. `fromObject(object: Object)`: Creates a new role instance from a plain JavaScript object representation.
3. `toJSON()`: Converts the role instance to a JSON string representation.
4. `fromJSON(json: string)`: Creates a new role instance from a JSON string representation.

These methods provide convenient ways to serialize and deserialize role instances, allowing you to store or transmit role data in different formats (such as objects or JSON strings) and recreate role instances from those formats when needed.

By using `toObject` and `fromObject`, you can convert a role instance to a plain object and recreate a role instance from that object, respectively. This can be useful when you want to store or transmit the role data as a plain JavaScript object.

Similarly, `toJSON` and `fromJSON` enable you to convert a role instance to a JSON string and create a role instance from that JSON string, respectively. This can be helpful when you need to serialize the role data for storage, transmission, or interoperability with other systems that expect JSON-formatted data.
