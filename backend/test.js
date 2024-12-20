/**
 * Extracts the first valid JSON object from text that may contain markdown code blocks
 * @param {string} responseText - The text that may contain JSON in code blocks
 * @returns {Object|null} - Parsed JSON object or null if invalid
 */
function extractSpecificJSON(responseText) {
    try {
        // First try to extract JSON from code blocks
        const codeBlockPattern = /```json\s*({[\s\S]*?})\s*```/;
        const codeBlockMatch = responseText.match(codeBlockPattern);
        
        if (codeBlockMatch) {
            const jsonString = codeBlockMatch[1].trim();
            const parsed = JSON.parse(jsonString);
            
            // Validate required fields
            const requiredFields = [
                'time-complexity',
                'space-complexity',
                'formula',
                'reasons-of-time-complexity',
                'reasons-of-space-complexity',
                'improvements'
            ];
            
            const hasAllFields = requiredFields.every(field => field in parsed);
            if (!hasAllFields) return null;
            
            // Validate array fields
            const arrayFields = [
                'reasons-of-time-complexity',
                'reasons-of-space-complexity',
                'improvements'
            ];
            
            const hasValidArrays = arrayFields.every(field => 
                Array.isArray(parsed[field]) && parsed[field].length > 0
            );
            if (!hasValidArrays) return null;
            
            return parsed;
        }
        
        return null;
    } catch (error) {
        console.error("Error extracting JSON:", error.message);
        return null;
    }
}

// Test cases using string literals instead of code block syntax
const testCases = [
    // Test Case 1: JSON in code block
    "Here's the analysis:\n```json\n" +
    JSON.stringify({
        "time-complexity": "O(1)",
        "space-complexity": "O(1)",
        "formula": null,
        "reasons-of-time-complexity": [
            "The function contains a single for loop that iterates a fixed number of times (10 times in this case)."
        ],
        "reasons-of-space-complexity": [
            "The function does not allocate any additional data structures or arrays."
        ],
        "improvements": [
            "The code is already efficient and does not require any further optimizations."
        ]
    }, null, 2) + 
    "\n```",
    
    // Test Case 2: No code block markers
    JSON.stringify({
        "time-complexity": "O(1)",
        "space-complexity": "O(1)",
        "formula": null,
        "reasons-of-time-complexity": ["Example"],
        "reasons-of-space-complexity": ["Example"],
        "improvements": ["None"]
    }, null, 2),
    
    // Test Case 3: Invalid JSON in code block
    "```json\n{invalid json}\n```"
];

// Run tests
testCases.forEach((testCase, index) => {
    console.log(`\nTest Case ${index + 1}:`);
    const result = extractSpecificJSON(testCase);
    console.log('Result:', result ? 'Valid JSON found' : 'No valid JSON found');
    if (result) console.log('Parsed JSON:', result);
});

// Test your specific case
const yourTestCase = `\`\`\`json
{
  "time-complexity": "O(1)",
  "space-complexity": "O(1)",
  "formula": null,
  "reasons-of-time-complexity": [
    "The function contains a single for loop that iterates a fixed number of times (10 times in this case).",      
    "The time taken to execute the loop is constant and does not depend on the input size.",
    "Therefore, the time complexity is O(1), which means the function takes a constant amount of time to execute, regardless of the input."
  ],
  "reasons-of-space-complexity": [
    "The function does not allocate any additional data structures or arrays.",
    "The only space it uses is a constant number of variables (such as the loop variable i) and the space occupied by the loop itself.",
    "This space usage does not depend on the input size, so the space complexity is O(1)."
  ],
  "improvements": [
    "The code is already efficient and does not require any further optimizations."
  ]
}\`\`\``;

console.log('\nYour Test Case:');
const result = extractSpecificJSON(yourTestCase);
console.log('Result:', result ? 'Valid JSON found' : 'No valid JSON found');
if (result) console.log('Parsed JSON:', result);