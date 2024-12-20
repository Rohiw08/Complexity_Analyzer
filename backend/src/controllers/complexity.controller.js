import { ComplexityAnalyzer } from "../services/ComplexityAnalyzer.js";

export const handleComplexityAnalysis = async (req, res) => {
    try {
        const { language, code } = req.body;
        
        if (!language || !code) {
            return res.status(400).json({
                success: false,
                message: "Both language and code are required"
            });
        }

        const analyzer = new ComplexityAnalyzer();
        const analysis = await analyzer.analyzeComplexity(language, code);
        
        return res.status(200).json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error("Complexity Analysis Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};