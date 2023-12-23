export default function POST(req, res) {

    // Check if the request method is POST
    if (req.method === 'POST') {

        // Extract the authToken from the Authorization header
        const authToken = (req.headers.authorization || '').split("Bearer ").at(1);

        // Replace ADMIN_AUTH_TOKEN with your expected token
        if (authToken && authToken === process.env.bearer_token) {

            // Function to convert image to text
            async function ConvertImageToText() {
                try {
                    // Extract the incoming request body
                    const incoimg_request = req.body;

                    // Prepare data for the image-to-text API
                    const imageUrlData = {
                        image_url: incoimg_request.image_url
                    };

                    // Send a request to the image-to-text API
                    const response = await fetch('https://mc-ocr.onrender.com/api/img-to-text', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.bearer_token}`
                        },
                        body: JSON.stringify(imageUrlData)
                    });

                    // Extract data from the response
                    const data = await response.json();

                    // Call the second function with the extracted text
                    await ConvertToAiStructuredJson(data.extracted_text);
                } catch (error) {
                    // Handle errors related to image-to-text conversion
                    res.status(401).json({ error: error });
                }
            }

            // Function to convert extracted text to AI structured JSON
            async function ConvertToAiStructuredJson(extracted_text) {
                try {
                    // Prepare data for the Gemini AI JSON API
                    const extractedTextData = {
                        extracted_text: extracted_text
                    };

                    // Send a request to the Gemini AI JSON API
                    const response = await fetch('https://mc-ocr.onrender.com/api/geminiAi_json', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.bearer_token}`
                        },
                        body: JSON.stringify(extractedTextData)
                    });

                    // Extract data from the response
                    const data = await response.json();

                    // Respond with the data from the Gemini AI JSON API
                    res.status(200).json(data);
                } catch (error) {
                    // Handle errors related to converting to AI structured JSON
                    res.status(401).json({ error: error });
                }
            }

            // Call the first function to start the process
            ConvertImageToText();

        } else {
            // Respond with an error if the provided auth token is invalid
            res.status(401).json({ Auth_status: false, error: "Invalid Auth Token" });
        }

    } else {
        // Respond with an error if the request method is not POST
        res.status(401).json({ error: "Wrong Http Request" });
    }
}
