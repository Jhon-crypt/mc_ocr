import { GoogleGenerativeAI } from "@google/generative-ai";

import formidable from 'formidable';
import fs from 'fs';
import mv from 'mv';

//const { GoogleGenerativeAI } = require("@google/generative-ai");

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function POST(req, res) {

    if (req.method === 'POST') {

        const authToken = (req.headers.authorization || '').split("Bearer ").at(1)
        // replace ADMIN_AUTH_TOKEN with your expected token
        if (authToken && authToken === process.env.bearer_token) {

            // Access your API key as an environment variable (see "Set up your API key" above)
            const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);

            const form = formidable({});

            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err);
                    return;
                }

                const file = files.image;

                if (!file) {
                    res.status(400).json({ error: 'No file uploaded.' });
                    return;
                } else {

                    var oldPath = files.image[0].filepath
                    var newPath = `./public/uploads/${files.image[0].originalFilename}`;

                    mv(oldPath, newPath, function (err) {
                        if (err) {
                            res.status(500).json({ error: 'Error moving file' });
                        } else {
                            run(fields.prompt,newPath, files.image[0].mimetype, fields, files)
                        }
                    });

                }

            });

            // Converts local file information to a GoogleGenerativeAI.Part object.
            function fileToGenerativePart(path, mimeType) {
                return {
                    inlineData: {
                        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                        mimeType
                    },
                };
            }   

            async function run(user_prompt,imagePath, mimeType, fields, files) {
                // For text-and-image input (multimodal), use the gemini-pro-vision model
                const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
              
                const prompt = `${user_prompt}`;
              
                const imageParts = [
                  fileToGenerativePart(imagePath, mimeType),
                ];
              
                const result = await model.generateContent([prompt, ...imageParts]);
                const response = await result.response;
                const text = response.text();

                res.status(200).json({ status: 'Uploaded Image Successfully', fields, gemini_pro_vision_response: text, files });
            }

        }

    } else {

        res.status(401).json({ error: "Wrong Http Request" });

    }

}