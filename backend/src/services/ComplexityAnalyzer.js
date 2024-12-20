import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

class ComplexityAnalyzer {
    constructor() {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("Missing Google AI API key");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    /**
     * Generates a comprehensive prompt for complexity analysis
     * @param {string} language Programming language of the code
     * @param {string} code Code snippet to analyze
     * @returns {string} Detailed prompt for the AI
     */
    createPrompt(language, code) {
        return `
        ALGORITHMIC COMPLEXITY ANALYSIS
        
        Perform a comprehensive Time and Space Complexity analysis for the following ${language} code:
        
        CODE SNIPPET:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        REQUIREMENTS FOR JSON RESPONSE:
        Provide a VALID, PARSEABLE JSON object with this structure:
        {
            "time-complexity": "Precise Big O notation", 
            "space-complexity": "Precise Big O notation",
            "formula": "Computational formula (if applicable, else null)",
            "space-complexity-formula": "Computational formula (if applicable, else null)",
            "reasons-of-time-complexity": ["Detailed explanations"],
            "reasons-of-space-complexity": ["Detailed explanations"],
            "improvements": ["Potential optimization strategies"]
        }
        
        ANALYSIS GUIDELINES:
        - Determine worst-case time complexity
        - Consider both algorithmic and language-specific optimizations
        - Analyze space complexity including:
          * Auxiliary space
          * Input space
          * Recursive call stack (if applicable)
        
        COMPLEXITY FORMULA EXAMPLES:
        - Create formula if and only there is only one variable in time-complexity i.e. O(n), O(nlogn), etc.
        - If there are multiple variables in same complexity then give null as formula
        - Here are some example how to Create a formula:
        - O(1): formula = 1
        - O(log N): formula = Math.log2(n)
        - O(N): formula = n
        - O(N log N): formula = n * Math.log2(n)
        - O(2^N): formula = 2 ** n
        - Multiple variables: formula = null
        
        CRITICAL INSTRUCTIONS:
        - Respond ONLY in VALID JSON format
        - Be precise and technical
        - Avoid any markdown or code block formatting
        `;
    }

    /**
     * Validate the structure of the complexity analysis response
     * @param {Object} response Parsed complexity analysis
     */
    validateResponse(obj) {
        const requiredFields = [
            'time-complexity',
            'space-complexity',
            'formula',
            'space-complexity-formula',
            'reasons-of-time-complexity',
            'reasons-of-space-complexity',
            'improvements'
        ];
        
        // Check all required fields exist
        const hasAllFields = requiredFields.every(field => field in obj);
        if (!hasAllFields) return false;
        
        // Validate array fields
        const arrayFields = [
            'reasons-of-time-complexity',
            'reasons-of-space-complexity',
            'improvements'
        ];
        
        return arrayFields.every(field => Array.isArray(obj[field]));
    }

    extractJSON(responseText) {
        try {
            // More flexible regex pattern that allows for variations in formatting
            const pattern = /{[^{]*?"time-complexity"[^{]*?"space-complexity"[^{]*?"formula"[^{]*?"reasons-of-time-complexity"[^{]*?"reasons-of-space-complexity"[^{]*?"improvements"[^}]*?}/gs;
            const matches = [...responseText.matchAll(pattern)];
        
            if (matches.length === 0) {
                throw new Error("No matching complexity analysis JSON found");
            }

            for (const match of matches) {
                try {
                    const cleanedJSON = match[0]
                        .replace(/\n\s*/g, ' ')  // Normalize whitespace
                        .replace(/,\s*}/g, '}')  // Remove trailing commas
                        .trim();
                
                    const parsed = JSON.parse(cleanedJSON);
                    if (!this.validateResponse(parsed)) continue;
                
                    return parsed;
                } catch (parseError) {
                    console.debug(`Skipping invalid JSON match: ${parseError.message}`);
                    continue;
                }
            }
            throw new Error("No valid complexity analysis JSON found in matches");
        } catch (error) {
            console.error("JSON Extraction Error:", error.message);
            return null;
        }
    }

    async analyzeComplexity(language, code) {
        try {
            if (!language || !code) {
                throw new Error("Both language and code must be provided");
            }

            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = this.createPrompt(language, code);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            try {
                const parsedResponse = this.extractJSON(responseText);
                return parsedResponse;
            } catch (parseError) {
                console.error("JSON Parsing Error:", parseError);
                console.error("Cleaned Response:", cleanedResponse);
                
                throw new Error(`Failed to parse complexity analysis: ${parseError.message}`);
            }
        } catch (error) {
            console.error("Complexity Analysis Error:", error);
            throw error;
        }
    }
}

export { ComplexityAnalyzer };

/*
{
  "language": "C++",
  "code": [
"    #define all(nums) nums.begin(), nums.end()",
"class Solution {",
"    int isValid(int size, const vector<int>& nums, const int &maxOperations) {",
"        int operation = 0;",
"        for(const int num : nums) {",
"            operation += ((num + size - 1) / size) - 1;",
"            if(operation > maxOperations) return false;",
"        }",
"        return true;",
"    }",
"public:",
"    int minimumSize(vector<int>& nums, int maxOperations) {",
"        auto maxNum = *max_element(all(nums));",
"        int left = 1, right = maxNum;",
"        while(left < right) {",
"            int mid = left + (right - left) / 2;",
"            if(isValid(mid, nums, maxOperations)) right = mid;",
"            else left = mid + 1;",
"        }",
"        return left;",
"    }",
"};"
  ]
}

*/