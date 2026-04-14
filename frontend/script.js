let backend_host;

// Initialize backend host from config
setTimeout(() => {
  backend_host = `${window.backhost.host}`;

  const gen_counter = document.querySelector("#shortened");
  const red_counter = document.getElementById("redirects");

  // Fetch URLs shortened count
  const gen_count_fun = async () => {
    setInterval(async () => {
      await fetch(`${backend_host}/api/gencount`)
        .then(res => res.json())
        .then((data) => {
          let gen_count = data.count;
          gen_counter.innerText = gen_count;
        })
        .catch(err => console.error("Error fetching gen count:", err));
    }, 1000);
  };

  gen_count_fun();

  // Fetch redirects count
  const red_count_fun = async () => {
    setInterval(async () => {
      await fetch(`${backend_host}/api/redcount`)
        .then(res => res.json())
        .then((data) => {
          let red_count = data.count;
          red_counter.innerText = red_count;
        })
        .catch(err => console.error("Error fetching redirect count:", err));
    }, 1000);
  };

  red_count_fun();
}, 800);

    // ✅ دالة لتقصير الرابط (محاكاة)
    function shortenUrl() {
      const input = document.getElementById("longUrl");
      const loading = document.getElementById("loading");
      const shortUrl = document.getElementById("shortUrl");
      const shortLink = document.getElementById("shortLink");
      const result_div = document.getElementById("result_div");
      const copy_btn =document.getElementById("copy_btn");
      const paste_btn =document.getElementById("paste_btn");
      const shorten_btn =document.getElementById("shorten_btn");
  
    //   console.log(input.value);

        if (!input.value.trim()) {
        showToast("⚠️ Please enter a valid URL", "#e53935");
        return;
      }


      let req = {
        "url": input.value
      }
      fetch(`${backend_host}/api/shorten`, {
       method: "POST",
       headers: {
      "Content-Type": "application/json", // tell server it's JSON
    },
    body: JSON.stringify(req), // convert object -> JSON string
  })
  .then(res => res.json())  // get response as JSON
  .then(data => {
    console.log("Server response:", data.data.url.short_url);

 

///

     result_div.style.display = "flex";
     copy_btn.style.display = "block";
      loading.style.display = "block";
      shortUrl.style.display = "none";

      // محاكاة عملية تقصير الرابط
      // setTimeout(() => {
        loading.style.display = "none";
        shortUrl.style.display = "block";
// Ensure the href has a protocol (http or https)   
        const rawUrl = data.data.url.short_url;
        const absoluteUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

        shortLink.textContent = rawUrl; // The text can stay "clean" without the https://
        shortLink.href = absoluteUrl;   // The href MUST have the protocol
        showToast("✅ URL shortened successfully!");

          shorten_btn.style.background = "#4caf50";
          shorten_btn.innerText = "Shortened ...";
          setTimeout(() => {
            shorten_btn.style.background = "#2196f3";
            shorten_btn.innerText = "Shorten URL";
          }, 2000);

      // }, 200);
    }

////

  )
  .catch(err => {
    console.error("Error:", err);
  });

}



    // ✅ دالة للصق من الحافظة
async function pasteUrl() {
   try {
     const text = await navigator.clipboard.readText();
      document.getElementById("longUrl").value = text;
      showToast("📋 URL pasted from clipboard!");
          paste_btn.style.background = "#4caf50";
          paste_btn.innerText = "Pasted...";
          setTimeout(() => {
            paste_btn.style.background = "#2196f3";
            paste_btn.innerText = "📋 Paste";
          }, 2000);
        
     }
      catch (err) {
         showToast("❌ Clipboard access denied.", "#e53935");
         } }
          // ✅ دالة لنسخ الرابط المختصر 
function copyUrl() {
      const shortLink = document.getElementById("shortLink").textContent;
       navigator.clipboard.writeText(shortLink)
        .then(() => {showToast("✅ Short link copied to clipboard!")
          
          copy_btn.style.background = "#4caf50";
          copy_btn.innerText = "Copied...";
          setTimeout(() => {
            copy_btn.style.background = "#2196f3";
            copy_btn.innerText = "📎 Copy";
          }, 2000);
        })
        .catch(() => showToast("❌ Failed to copy link.", "#e53935")); 
      }