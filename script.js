const STORAGE_KEY = "campusdesk_students_v1";
let students = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let addedThisSession = 0;
const $ = id => document.getElementById(id);
const form = $("studentForm");

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); render(); }
function toast(message){ const t=$("toast"); t.textContent=message; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }
function escapeHTML(value){ return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

form.addEventListener("submit", e=>{
  e.preventDefault();
  const id=$("editId").value;
  const student={id:id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),name:$("name").value.trim(),roll:$("roll").value.trim(),email:$("email").value.trim(),branch:$("branch").value};
  if(students.some(s=>s.roll.toLowerCase()===student.roll.toLowerCase() && s.id!==id)){toast("That roll number already exists.");return;}
  if(id){students=students.map(s=>s.id===id?student:s);toast("Student details updated.");}
  else{students.unshift(student);addedThisSession++;toast("Student added successfully.");}
  save(); resetForm();
});
function resetForm(){form.reset();$("editId").value="";$("formTitle").textContent="Add a student";$("saveBtn").textContent="Add student";$("cancelBtn").hidden=true;}
$("cancelBtn").addEventListener("click",resetForm);
$("search").addEventListener("input",render);

function editStudent(id){const s=students.find(x=>x.id===id);if(!s)return;$("editId").value=s.id;$("name").value=s.name;$("roll").value=s.roll;$("email").value=s.email;$("branch").value=s.branch;$("formTitle").textContent="Edit student";$("saveBtn").textContent="Save changes";$("cancelBtn").hidden=false;window.scrollTo({top:0,behavior:"smooth"});}
function deleteStudent(id){const s=students.find(x=>x.id===id);if(!s)return;if(confirm(`Delete ${s.name}'s record?`)){students=students.filter(x=>x.id!==id);save();toast("Student record deleted.");}}

function render(){
  const q=$("search").value.toLowerCase();
  const filtered=students.filter(s=>[s.name,s.roll,s.email,s.branch].some(v=>v.toLowerCase().includes(q)));
  $("studentRows").innerHTML=filtered.map(s=>`<tr><td>${escapeHTML(s.name)}<span class="student-email">${escapeHTML(s.email)}</span></td><td>${escapeHTML(s.roll)}</td><td><span class="branch-pill">${escapeHTML(s.branch)}</span></td><td><button class="action-btn" onclick="editStudent('${s.id}')">Edit</button><button class="action-btn delete-btn" onclick="deleteStudent('${s.id}')">Delete</button></td></tr>`).join("");
  $("emptyState").style.display=filtered.length?"none":"block";
  $("emptyState").innerHTML=q?'<div>🔎</div><strong>No matching students</strong><p>Try another search term.</p>':'<div>📚</div><strong>No students yet</strong><p>Add a student using the form to see records here.</p>';
  $("totalCount").textContent=students.length;
  $("branchCount").textContent=new Set(students.map(s=>s.branch)).size;
  $("recentCount").textContent=addedThisSession;
  $("recordBadge").textContent=`${students.length} record${students.length===1?"":"s"}`;
}
render();
