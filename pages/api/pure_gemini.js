const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function POST(req, res) {

    if (req.method === 'POST') {

        const authToken = (req.headers.authorization || '').split("Bearer ").at(1)
        // replace ADMIN_AUTH_TOKEN with your expected token
        if (authToken && authToken === process.env.bearer_token) {

            async function RunGemini() {

                // Parse the JSON data from the incoming request
                const data = req.body

                const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

                // For text-only input, use the gemini-pro model
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const prompt = `${data.prompt}`

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const gemini_result = response.text();

                res.status(200).json(gemini_result)

            }

            RunGemini()

        }

    } else {

        res.status(401).json({ error: "Wrong Http Request" });

    }

}   