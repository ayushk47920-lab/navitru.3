'use strict';

const DIRECTORY = [
  {token:'R1OPDP1',department:'OPD',sub:'Pediatric',room:'Cabin 1',doctor:'Dr. Aarav Sharma',floor:'First Floor'},
  {token:'R1OPDP2',department:'OPD',sub:'Pediatric',room:'Cabin 2',doctor:'Dr. Neha Verma',floor:'First Floor'},
  {token:'R1OPDR1',department:'OPD',sub:'Respiratory',room:'Cabin 1',doctor:'Dr. Kabir Mehta',floor:'First Floor'},
  {token:'R1OPDD1',department:'OPD',sub:'Dermatology',room:'Cabin 1',doctor:'Dr. Isha Kapoor',floor:'First Floor'},
  {token:'R1OPDG1',department:'OPD',sub:'General',room:'Cabin 1',doctor:'Dr. Rohan Gupta',floor:'First Floor'},
  {token:'R1ODS1',department:'Other Department',sub:'Sub Branch',room:'Room 1',doctor:'Dr. Ananya Singh',floor:'Ground Floor'},
  {token:'R1ODS2',department:'Other Department',sub:'Sub Branch',room:'Room 2',doctor:'Dr. Vikram Joshi',floor:'Ground Floor'},
  {token:'R1BOOP1',department:'Board OPD',sub:'Orthopedics',room:'Cabin 1',doctor:'Dr. Priya Malhotra',floor:'First Floor'},
  {token:'R1BOOM1',department:'Board OPD',sub:'Ophthalmology',room:'Cabin 1',doctor:'Dr. Kunal Bhatia',floor:'First Floor'},
  {token:'R1BOOT1',department:'Board OPD',sub:'Surgery',room:'Cabin 1',doctor:'Dr. Sana Khan',floor:'First Floor'},
  {token:'R1RDGX',department:'Radiology',sub:'X-Ray',room:'X-Ray Room',doctor:'Dr. Nikhil Das',floor:'Ground Floor'},
  {token:'R1RDGCT',department:'Radiology',sub:'CT Scan',room:'CT Room',doctor:'Dr. Pooja Iyer',floor:'Ground Floor'},
  {token:'R1RDGMRI',department:'Radiology',sub:'MRI',room:'MRI Room',doctor:'Dr. Sameer Kulkarni',floor:'Ground Floor'},
  {token:'R1RDGU',department:'Radiology',sub:'Ultrasound',room:'Ultrasound Room',doctor:'Dr. Kavya Menon',floor:'Ground Floor'},
  {token:'R1CBNC101',department:'All Cabins',sub:'Cabin',room:'Cabin 101',doctor:'Dr. Amit Shah',floor:'First Floor'},
  {token:'R1CBNC102',department:'All Cabins',sub:'Cabin',room:'Cabin 102',doctor:'Dr. Riya Roy',floor:'First Floor'}
];
const STORAGE = {appointments:'navitruAppointments',queue:'navitruQueue'};
function readStore(key, fallback){try{const value=localStorage.getItem(key);return value?JSON.parse(value):fallback;}catch(error){return fallback;}}
function writeStore(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch(error){console.warn('Local storage is unavailable.',error);}}
function getQueue(){return readStore(STORAGE.queue,{serving:1,consult:5});}
function saveAppointment(record){const records=readStore(STORAGE.appointments,[]);if(!records.some(item=>item.token===record.token)){records.unshift(record);writeStore(STORAGE.appointments,records.slice(0,50));}}

// Patient page
const patientForm=document.getElementById('patient-form');
if(patientForm){
 const tokenInput=document.getElementById('token-input');
 const departmentSelect=document.getElementById('department-select');
 const subSelect=document.getElementById('subdepartment-select');
 const result=document.getElementById('appointment-result');
 const message=document.getElementById('patient-message');
 function showAppointment(record){
  message.textContent='';const queue=getQueue();const queueNumber=Number(String(record.token).replace(/\D/g,''))||8;const waiting=Math.max(0,queueNumber-queue.serving);const waitMinutes=waiting*queue.consult;
  result.innerHTML=`<div class="result-content"><span class="result-kicker">APPOINTMENT FOUND</span><h2 class="result-title">You're all set.</h2><p class="result-subtitle">Here are the details for your hospital visit.</p><div class="result-token"><div><small>YOUR TOKEN NUMBER</small><strong>${record.token}</strong></div><span class="waiting-tag">● ${waiting===0?'Your turn':'Waiting'}</span></div><div class="detail-grid"><div class="detail-item"><small>DEPARTMENT</small><b>${record.department}</b></div><div class="detail-item"><small>SUB-DEPARTMENT</small><b>${record.sub}</b></div><div class="detail-item"><small>DOCTOR</small><b>${record.doctor}</b></div><div class="detail-item"><small>ROOM / CABIN</small><b>${record.room}</b></div></div><div class="direction-box"><h3>⌖ &nbsp; Where should you go?</h3><p>Go to the <b>${record.floor}</b> and follow the hospital signs for <b>${record.department}</b>. Your destination is <b>${record.room}</b>. Ask the reception desk if you need help finding the room.</p></div><p class="queue-info">Estimated wait: <b>${waitMinutes} minutes</b> · Based on the demo queue settings.</p></div>`;
  saveAppointment({token:record.token,patient:'Demo Patient',department:record.department,room:record.room,doctor:record.doctor,status:'Waiting'});
 }
 function findToken(value){const token=value.trim().toUpperCase();if(!token){message.textContent='Please enter a token number.';return;}const record=DIRECTORY.find(item=>item.token===token);if(!record){message.textContent='Token not found. Try one of the sample tokens shown above.';return;}tokenInput.value=record.token;showAppointment(record);}
 patientForm.addEventListener('submit',event=>{event.preventDefault();findToken(tokenInput.value);});
 document.querySelectorAll('[data-token]').forEach(button=>button.addEventListener('click',()=>{tokenInput.value=button.dataset.token;findToken(button.dataset.token);}));
 departmentSelect.addEventListener('change',()=>{const department=departmentSelect.value;const choices=[...new Set(DIRECTORY.filter(item=>item.department===department).map(item=>item.sub))];subSelect.innerHTML='<option value="">Choose sub-department</option>'+choices.map(choice=>`<option value="${choice}">${choice}</option>`).join('');subSelect.disabled=!department||choices.length===0;});
 document.getElementById('department-search').addEventListener('click',()=>{const department=departmentSelect.value;const sub=subSelect.value;if(!department||!sub){message.textContent='Please select both a department and a sub-department.';return;}const record=DIRECTORY.find(item=>item.department===department&&item.sub===sub);if(record){tokenInput.value=record.token;showAppointment(record);}else{message.textContent='No demo appointment is available for this selection.';}});
}

// Admin page
const loginForm=document.getElementById('admin-login-form');
if(loginForm){
 const loginPanel=document.getElementById('admin-login');const dashboard=document.getElementById('admin-dashboard');
 const loginMessage=document.getElementById('login-message');
 loginForm.addEventListener('submit',event=>{event.preventDefault();const username=document.getElementById('admin-username').value.trim();const password=document.getElementById('admin-password').value;if(username==='admin'&&password==='demo1234'){loginPanel.hidden=true;dashboard.hidden=false;renderDashboard();}else{loginMessage.textContent='Incorrect username or password. Please try again.';}});
 document.getElementById('admin-logout').addEventListener('click',()=>{dashboard.hidden=true;loginPanel.hidden=false;loginForm.reset();loginMessage.textContent='';});
 document.getElementById('queue-form').addEventListener('submit',event=>{event.preventDefault();const serving=Number(document.getElementById('serving-input').value);const consult=Number(document.getElementById('consult-input').value);if(!Number.isInteger(serving)||serving<1||serving>999||!Number.isInteger(consult)||consult<1||consult>60){document.getElementById('queue-message').textContent='Enter a valid token (1–999) and time (1–60 minutes).';return;}writeStore(STORAGE.queue,{serving,consult});document.getElementById('queue-message').textContent='Queue settings saved successfully.';renderDashboard();});
 function renderDashboard(){const records=readStore(STORAGE.appointments,[]);const queue=getQueue();document.getElementById('total-appointments').textContent=records.length;document.getElementById('serving-stat').textContent=String(queue.serving).padStart(2,'0');document.getElementById('serving-input').value=queue.serving;document.getElementById('consult-input').value=queue.consult;document.getElementById('record-count').textContent=`${records.length} record${records.length===1?'':'s'}`;const table=document.getElementById('appointment-table');if(!records.length){table.innerHTML='<tr><td colspan="5" class="table-empty">No appointments saved yet. Search a token on the patient page to add a demo record.</td></tr>';return;}table.innerHTML=records.map(record=>`<tr><td><b>${record.token}</b></td><td>${record.patient}</td><td>${record.department}</td><td>${record.room}</td><td><span class="status-chip">${record.status}</span></td></tr>`).join('');}
}
