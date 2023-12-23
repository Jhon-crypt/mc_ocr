const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function GET(req, res) {

  if (req.method === 'POST') {

    const authToken = (req.headers.authorization || '').split("Bearer ").at(1)
    // replace ADMIN_AUTH_TOKEN with your expected token
    if (authToken && authToken === process.env.bearer_token) {

      async function RunGemini() {

        // Parse the JSON data from the incoming request
        const data = req.body
        
        const genAI = new GoogleGenerativCneAI(process.env.gemini_api_key);

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `convert to well structured json, no spaces at all, i repeat remove all the spaces,no slashes in between the key and its values i don want there to be spaces in between the json data like this {name:John,birth:1986-12-14,city:New York} just the it, ${data.extracted_text}`

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const gemini_result = response.text();

        var final = gemini_result.replace(/\\/g, "");

        res.status(200).json(JSON.parse(final))
        

      }

      RunGemini()


    }

  }

}
