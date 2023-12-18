import { Bard } from "googlebard";

export default async function GET(req, res) {

    if (req.method === 'GET') {

        const authToken = (req.headers.authorization || '').split("Bearer ").at(1)
        // replace ADMIN_AUTH_TOKEN with your expected token
        if (authToken && authToken === process.env.mc_ocr_bearer_token) {

            let cookies = `__Secure-1PSID=eQh9hngym_kvhlTVBl0QX5tjYgFIOxSKgscPSe12rFouCbFnvV9cMKk1YEyZkhk4_qYLOQ.`;
            let bot = new Bard(cookies);

            let conversationId = "9i438998"; // optional: to make it remember the conversation

            let response = await bot.ask("Give me updates on what's currently happening?", conversationId); // conversationId is optional
            //console.log(response);
            res.status(200).json({ bard_response: response})


        }

    }

}