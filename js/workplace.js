console.log("linked")
const record = document.getElementById('record'); 
const stopRecord = document.getElementById('stopRecord');
const tools = document.getElementById("recordsBox");
const backButton = document.querySelector(".backButton");
let mediaRecorder = '';
let browserStream = ""; 
const baseUrl = "http://localhost:4000/" ; 
const audioUp = "tasks/me/audio"; 
const notifier = document.querySelector(".notifier");
const addSectionBtn = document.getElementById("addSectionBtn");
const sectionTitle = document.getElementById("sectionTitle");
const sectionTime = document.getElementById("sectionTime");
const sectionCont = document.getElementById("sectionsContainer"); 
const recordCounter = document.getElementById("recordCounter"); 
const resultContainer = document.getElementById("Results");
const sections = [];     
let timer = ''; 
let counter = '';
let counted = 0 ;
let currentSec = 0 ; 
let audios = []; 
let responses = []; 
let records =0; 
let fullTime = 0 ;


function countDown(){
  if(sections.length == 0) return ; 
  let section = sections[currentSec];
  totalSecs = section.totalSecs;   
  let htmlsection =document.getElementById(`${section.id}`); 
  htmlsection.classList.add('active');
  timer = setInterval(function(){
      let hours = Math.floor(totalSecs/3600); 
      let mins = Math.floor((totalSecs-hours*3600)/60); 
      let secs = totalSecs - mins*60 - hours*3600; 
      htmlsection.querySelector('.timeParagraph').innerText= `${hours.toString().padStart(2,"00")}:${mins.toString().padStart(2,"00")}:${secs.toString().padStart(2,"00")}`;
      totalSecs--;
      if (totalSecs < 0) {
          currentSec++;
          clearInterval(timer);
          htmlsection.classList.remove('active');
          if(currentSec<sections.length){
          countDown();
        }else{
          currentSec = 0;
        }
      }
  }, 1000);

}
function countUp(){
    counter = setInterval(()=>{
      counted++;
      let hours = Math.floor(counted/3600); 
      let mins = Math.floor((counted-hours*3600)/60); 
      let secs = counted - mins*60 - hours*3600; 
      recordCounter.innerText = `${hours.toString().padStart(2,"00")}:${mins.toString().padStart(2,"00")}:${secs.toString().padStart(2,"00")}`;
    },1000);
}


addSectionBtn.addEventListener('click',()=>{
  let secId = "section"+sections.length ;  

 const sectionHeader= document.createElement('p'); 
 const time = document.createElement('p') ; 
 sectionHeader.innerText = `${sections.length +1}. `+ sectionTitle.value
 sectionHeader.style.textAlign ='center';
 time.style.textAlign ='center'
 let mins =  parseFloat(sectionTime.value) ;
 console.log(mins);

 let secs = Math.floor((mins-Math.floor(mins))*60) ; 
 let hours = Math.floor(Math.floor(mins)/60); 
 mins = Math.floor(mins-hours*60) ;
 time.innerText =`${hours.toString().padStart(2,"00")}:${mins.toString().padStart(2,"00")}:${secs.toString().padStart(2,"00")}`; 
 time.classList.add('timeParagraph')
 const section = document.createElement('div') ; 
 section.classList.add('timerSection'); 
 section.append(sectionHeader); 
 section.append(time); 
 section.id = secId; 
 sectionCont.append(section); 
 
 sections.push({title : sectionTitle.value, 
  min : mins,
  sec: secs,
  hour: hours,
  totalSecs: sectionTime.value*60,
  id : secId
}); 
fullTime +=  sectionTime.value*60; 
})        
record.onclick = function () {
  recordCounter.innerText = `00:00:00`;
  countDown(); 
  countUp(); 
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
                    clipContainer.id = `article${records}`; 
                    clipContainer.style.display = 'flex'; 
                    clipContainer.style.alignContent = 'center';
                    const clipLabel = document.createElement("p");
                    const audio = document.createElement("audio");
                    const deleteButton = document.createElement("button");
                    audio.setAttribute("controls", "");
                    clipContainer.appendChild(audio);
                    tools.appendChild(clipContainer);
                    notifier.style.display = "none"; 
                    const blob = new Blob(chunks, { type: "audio/wav; codecs=PCM" });
                    chunks = [];
                    const audioURL = window.URL.createObjectURL(blob);
                    audio.src = audioURL;
                    // console.log(audioURL);
                    // console.log("I was called"); 
                    // console.log(browserStream);
                    browserStream.getTracks().forEach(track => track.stop());
                    const formData = new FormData()
                    formData.append("audio",blob,"blob.wav");
                    for (const entries of formData.entries()) {
                          console.log(entries);
                    } 
                    const token =  JSON.parse(localStorage.getItem('user')).token ;
                    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmE0OTA1MGFiNjlkZDlmNDVhN2JjYmMiLCJpYXQiOjE2NTUwNTI4NDV9.yaIX8qmDuhfynLs66ZgEqXllaoK16Sx-6ZYdt-aKO-M"
                    // console.log(token);
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
                      }).
                    then(async (response)=>{
                      const flipButton =document.createElement('a')
                      flipButton.id = records ; 
                      flipButton.innerText = 'See Results';
                      flipButton.classList.add('authButton')
                      flipButton.style.fontSize = '1rem';
                      flipButton.href = "../html/result.html"+`?${records}`; 
                      flipButton.target = "__blank"
                      flipButton.rel = "noopener noreferrer"
                      let jsonRes = await response.json(); 
                      console.log(jsonRes);
                      responses.push({response: jsonRes
                        ,time : counted , 
                        targetTime : fullTime
                  }); 
                      localStorage.setItem('responses', JSON.stringify(responses));
                      console.log(responses[records-1].time
                           );
              
                      flipButton.onclick= ()=>{
                       
                        const resultsParagraph = document.createElement('p'); 
                        resultsParagraph.innerText = `Total Words counts: ${jsonRes.WordCount} Metronome: ${jsonRes.WordCount/responses[flipButton.id-1].time} word/s`
                        resultContainer.appendChild(resultsParagraph); 
                      } ; 
                      clipContainer.appendChild(flipButton);
                      counted = 0;
                      
                      console.log('Records count' , records) 
                     
                    })
                   
                }
          
                mediaRecorder.start();
                stopRecord.style.display = 'block';
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
            record.style.display = 'block'
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            clearInterval(timer);
            currentSec= 0 ; 
            clearInterval(counter); 
            records++ ; 
          };
        
      backButton.addEventListener('click',()=>{
        window.location.href = "../html/tools.html"; 
      })
    

