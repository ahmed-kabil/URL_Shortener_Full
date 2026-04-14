const { Url, GenCount, RedCount } = require("./model");
const { nanoid } = require("nanoid");

const shortenLink = async (req, res) => {
   try{
    console.log("shortening...")
       const shortCode = nanoid(6); // generates a 6-character random string
    const entry = {
        "long_url": req.body.url,
        "shorten_text": shortCode,   // i will make this value random
        "short_url": `${process.env.HOST}/${shortCode}`
        
    };

      let new_shortening = new Url(entry);
      // console.log(new_shortening)
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

      const url_entry = await Url.findOne({ shorten_text: req.params.text });
    //   console.log(url_entry)
      if(!url_entry){
     
         res.status(404).json({status: "fail",data: null})
      }
    //   console.log("hit")
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
    const gencount = await GenCount.findOne({});

    // if not found, return 0 or handle it
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
    const redcount = await RedCount.findOne({});

    // if not found, return 0 or handle it
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