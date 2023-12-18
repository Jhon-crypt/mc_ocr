import { createWorker } from 'tesseract.js';

export default async function POST(req, res) {

  if (req.method === 'POST') {

    const authToken = (req.headers.authorization || '').split("Bearer ").at(1)
    // replace ADMIN_AUTH_TOKEN with your expected token
    if (authToken && authToken === process.env.mc_ocr_bearer_token) {

      // Parse the JSON data from the incoming request
      const data = req.body

      const worker = await createWorker('eng');
      const ret = await worker.recognize(data.image_url);
      await worker.terminate();

      res.status(200).json({ Auth_status: true, img_url: data.image_url, extracted_text: ret.data.text })


    } else {

      res.status(401).json({ Auth_status: false, error: "Invalid Auth Token" });

    }

  } else {

    res.status(401).json({ error: "Wrong Http Request" });

  }

}

/*
      
      */
