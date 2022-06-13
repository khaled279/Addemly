console.log("linked")
const record = document.getElementById('record'); 
const stopRecord = document.getElementById('stopRecord');
const pauseRecord = document.getElementById('pauseRecord'); 
const tools = document.getElementById("recordsBox");
const backButton = document.querySelector(".backButton");
let mediaRecorder = '';
let browserStream = ""; 
const baseUrl = "http://localhost:4000/" ; 
const audioUp = "tasks/me/audio"; 
const notifier = document.querySelector(".notifier");
         
          record.onclick = function () {
            
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.");
            navigator.mediaDevices.getUserMedia(
                {
                  audio: {sampleSize: 16, channelCount: 1, sampleRate: 16000 }
                }
              ).then(function (stream) {
                browserStream = stream ; 
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = function (e) {
                    console.log("I was called")
                    chunks.push(e.data);
                };
                mediaRecorder.onstop = async function (e) {
                    console.log("recorder stopped");
                  
                    const clipName = "Record"
                  
                    const clipContainer = document.createElement("article");
                    const clipLabel = document.createElement("p");
                    const audio = document.createElement("audio");
                    const deleteButton = document.createElement("button");
                  
                    audio.setAttribute("controls", "");
                    clipContainer.appendChild(audio);
                    tools.appendChild(clipContainer);
                    notifier.style.display = "none"; 
                    const blob = new Blob(chunks, { type: "audio/wav; codecs=wav" });
                    chunks = [];
                    const audioURL = window.URL.createObjectURL(blob);
                    audio.src = audioURL;
                    console.log(audioURL);
                    console.log("I was called"); 
                    console.log(browserStream);
                    browserStream.getTracks().forEach(track => track.stop());
                    const formData = new FormData()
                    formData.append("audio",blob,"blob.wav");
                    for (const entries of formData.entries()) {
                          console.log(entries);
                    } 
                    const token =  JSON.parse(localStorage.getItem('user')).token ;
                    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmE0OTA1MGFiNjlkZDlmNDVhN2JjYmMiLCJpYXQiOjE2NTUwNTI4NDV9.yaIX8qmDuhfynLs66ZgEqXllaoK16Sx-6ZYdt-aKO-M"
                    console.log(token);
                    let response = await fetch(baseUrl+audioUp,{
                        method: 'POST', 
                        headers: {
                            'Authorization':token,
                            // 'Content-type' : "multipart/form-data ; boundary:suii--" ,
                            'Accept' : '*/*', 
                            'Connection': 'keep-alive',
                            'Accept-Encoding': 'gzip, deflate, br', 
                           },
          
                        body : formData
                      
                    } )
                    console.log(await response.json());
                }
          
                mediaRecorder.start();
                stopRecord.style.display = 'block';
                pauseRecord.style.display = 'block';
                record.style.display = 'none'
                console.log(mediaRecorder.state);
                console.log("recorder started");
            
              })
          
              .catch(function (err) {
                console.log("The following getUserMedia error occurred: " + err);
              });
          } else {
            console.log("getUserMedia not supported on your browser!");
          }
          };
        
          let chunks = [];
        
       
        
        stopRecord.onclick = function () {
            console.log(mediaRecorder.state);
            mediaRecorder.stop();
            stopRecord.style.display = 'none';
            pauseRecord.style.display = 'none';
            record.style.display = 'block'
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
          };
        
      backButton.addEventListener('click',()=>{
        window.location.href = "../html/tools.html"; 
      })
    


