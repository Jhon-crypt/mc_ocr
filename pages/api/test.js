import { createWorker } from 'tesseract.js';


export default async function GET(req, res) {

  if (req.method === 'GET') {

    const authToken = (req.headers.authorization || '').split("Bearer ").at(1)
    // replace ADMIN_AUTH_TOKEN with your expected token
    if (authToken && authToken === process.env.mc_ocr_bearer_token) {


      const worker = await createWorker('eng');
      const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
      await worker.terminate();
      
      res.status(200).json({ Auth_status: true,extracted_text: ret.data.text })


    }else{

      res.status(401).json({ Auth_status:false,error: "Invalid Auth Token" });

    }
    
  } else {

    res.status(401).json({ error: "Wrong Http Request" });

  }

}

/*
      
      */
