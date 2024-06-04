function parseMultipleJSON(jsonStrings) {
  try {
    const results = [];

    const jsonArr = jsonStrings.split("\n");

    // Iterate over each JSON string
    for (let jsonString of jsonArr) {
      const customReviver = (key, value) => {
        // Check if the value is a string representing a number
        if (/^-?\d+(\.\d+)?$/.test(value)) {
          // If it's an integer, convert it to BigInt
          if (Number.isInteger(Number(value))) {
            return BigInt(value);
          }
          // If it's a floating-point number, parse it with arbitrary precision
          return parseFloat(value);
        }
        // If it's a string, return it as is
        return value;
      };

      // Parse the current JSON string using the custom reviver function
      const parsedObject = JSON.parse(jsonString, customReviver);
      results.push(parsedObject);
    }

    return results;
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    return null;
  }
}

const jsonString =
  '{"integer": "12345678901234567890", "float": "123.45678901234567890","name":"rahul","Email":"Testing"}';
const parsedObject = parseMultipleJSON(jsonString);
console.log(parsedObject);
