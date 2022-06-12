console.log("linked")
const record = document.getElementById('record'); 
const stopRecord = document.getElementById('stopRecord');
const pauseRecord = document.getElementById('pauseRecord'); 
const tools = document.getElementById("recordsBox");
let mediaRecorder = '';
let browserStream = ""; 
const baseUrl = "http://localhost:4000/" ; 
const audioUp = "tasks/me/audio"; 
         
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
                
                    const blob = new Blob(chunks, { type: "audio/wav; codecs=wav" });
                    chunks = [];
                    const audioURL = window.URL.createObjectURL(blob);
                    audio.src = audioURL;
                    console.log("I was called"); 
                    console.log(browserStream);
                    browserStream.getTracks().forEach(track => track.stop());
                    let formData = new FormData(); 
                    formData.append("audio",blob,"blob.wav");
    
                    const token =  JSON.parse(localStorage.getItem('user')).token ;
                    console.log(token);
                    let response = await fetch(baseUrl+audioUp,{
                        method: 'POST', 
                        credentials: 'same-origin', 
                        headers: {
                            'Authorization':token,
                            'Content-type' : "multipart/form-data; boundary=SUI" ,
                            'Accept' : '*/*', 
                            'Connection': 'keep-alive'
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
        
      
  

