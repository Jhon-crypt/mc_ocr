import { GoogleGenerativeAI } from "@google/generative-ai";

import formidable from 'formidable';
import fs from 'fs';
import mv from 'mv';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function POST(req, res) {

    if (req.method === 'POST') {
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
                        run(fields.prompt, newPath, files.image[0].mimetype, fields, files)
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

        async function run(user_prompt, imagePath, mimeType, fields, files) {
            // For text-and-image input (multimodal), use the gemini-pro-vision model
            const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

            const prompt = "convert the bank account number and bank name in the image to well structured json, no spaces at all, i repeat remove all the spaces,no slashes in between the key and its values i don want there to be spaces in between the json data like this {account_number:,bank_name:} just the it";

            const imageParts = [
                fileToGenerativePart(imagePath, mimeType),
            ];

            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = response.text();

            var final = text.replace(/\\/g, "");

            res.status(200).json(JSON.parse(final))

        }


    } else {

        res.status(401).json({ error: "Wrong Http Request" });

    }

}