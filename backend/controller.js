const { Url, GenCount, RedCount } = require("./model");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");

const shortenLink = async (req, res) => {
   try{

       const shortCode = nanoid(6); // generates a 6-character random string
    const entry = {
        "long_url": req.body.url,
        "shorten_text": shortCode,   // i will make this value random
        "short_url": `${process.env.HOST}/${shortCode}`
        
    };

      let new_shortening = new Url(entry);

      console.log("Shortining ... : ", entry.long_url)
      await new_shortening.save()
     await GenCount.updateOne({}, { $inc: { count: 1 } }, { upsert: true });
     res.status(201).json({status: "success",data: {url: new_shortening}});
      }catch(err){
         res.status(400).json({
         status: "error",
         message: err.message      
   })
  }

}



const redirectLink = async (req, res) => {

   try{
    console.log("redirecting...")
    
    const url_entry = await Url.findOne({ shorten_text: req.params.text }).read("primary");
  
    if(!url_entry){
      
         res.status(404).json({status: "fail",data: null})
        }

      res.redirect(url_entry.long_url);
      await RedCount.updateOne({}, { $inc: { count: 1 } }, { upsert: true });
   }catch(err){
     res.status(400).json({
         status: "error",
         message: err.message
      })
   }
}


const getgencount = async (req, res) => {
  try {
    const gencount = await GenCount.findOne({}).read("secondary");
    if (!gencount) {
      return res.json({ count: 0 });
    }

    res.json({ count: gencount.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getredcount = async (req, res) => {

  try {
    const redcount = await RedCount.findOne({}).read("secondary");
    if (!redcount) {
      return res.json({ count: 0 });
    }

    res.json({ count: redcount.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
shortenLink,
redirectLink,
getgencount,
getredcount
}