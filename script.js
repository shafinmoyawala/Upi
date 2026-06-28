// ===== INPUTS =====
const finalResult = document.getElementById("finalResult");
const upi = document.getElementById("upiID");
const amount = document.getElementById("amount");
const description = document.getElementById("description");

const progress = document.getElementById("progressBar");
const scoreText = document.getElementById("riskScore");
const levelText = document.getElementById("riskLevel");

const upiStatus = document.getElementById("upiStatus");
const bankStatus = document.getElementById("bankStatus");
const amountStatus = document.getElementById("amountStatus");
const keywordStatus = document.getElementById("keywordStatus");

const reasonList = document.getElementById("reasonList");
const recommendation = document.getElementById("recommendationText");

const historyTable = document.getElementById("historyTable");

const btn = document.getElementById("analyzeBtn");

// Analyze only when button is clicked
btn.addEventListener("click", function () {
    analyze();
    saveHistory();
});

// =========================

function analyze(){

let score=0;

let reasons=[];

// UPI Validation

const regex=/^[a-zA-Z0-9._-]{3,}@[a-zA-Z]+$/;

if(regex.test(upi.value)){

upiStatus.innerHTML="✅ Valid";

}else{

upiStatus.innerHTML="❌ Invalid";

score+=30;

reasons.push("Invalid UPI ID");

}

// Bank Detection

let bank="Unknown";

if(upi.value.includes("@oksbi")) bank="SBI";
else if(upi.value.includes("@okhdfcbank")) bank="HDFC";
else if(upi.value.includes("@okicici")) bank="ICICI";
else if(upi.value.includes("@ybl")) bank="PhonePe";
else if(upi.value.includes("@paytm")) bank="Paytm";
else if(upi.value.includes("@ibl")) bank="ICICI";
else if(upi.value.includes("@bob")) bank="Bank of Baroda (BOB)";

bankStatus.innerHTML=bank;

if(bank=="Unknown"){

score+=10;

reasons.push("Unknown UPI Provider");

}

// Amount

const amt=Number(amount.value);

if(amt<1000){

amountStatus.innerHTML="🟢 Low";

}

else if(amt<10000){

amountStatus.innerHTML="🟡 Medium";

score+=10;

}

else if(amt<50000){

amountStatus.innerHTML="🟠 High";

score+=25;

reasons.push("High Amount");

}

else{

amountStatus.innerHTML="🔴 Very High";

score+=40;

reasons.push("Very High Amount");

}

// Scam Keywords

const words=[

"urgent",

"gift",

"refund",

"reward",

"lottery",

"otp",

"verify",

"link",

"investment",

"crypto",

"bitcoin",

"winner",

"kyc",

"click",

"free",

"cashback",

"congratulations"

];

let found=[];

words.forEach(word=>{

if(description.value.toLowerCase().includes(word)){

found.push(word);

score+=8;

}

});

if(found.length>0){

keywordStatus.innerHTML=found.join(", ");

reasons.push("Scam Keywords");

}else{

keywordStatus.innerHTML="None";

}

// Limit

if(score>100) score=100;

// Progress

progress.style.width=score+"%";

// Color

if(score<25){

progress.style.background="lime";

scoreText.style.color="lime";

levelText.innerHTML="🟢 LOW RISK";

recommendation.innerHTML="Transaction appears safe.";

}

else if(score<50){

progress.style.background="orange";

scoreText.style.color="orange";

levelText.innerHTML="🟡 MEDIUM RISK";

recommendation.innerHTML="Verify receiver before payment.";

}

else if(score<75){

progress.style.background="#ff5722";

scoreText.style.color="#ff5722";

levelText.innerHTML="🟠 HIGH RISK";

recommendation.innerHTML="Double-check transaction.";

}

else{

progress.style.background="red";

scoreText.style.color="red";

levelText.innerHTML="🔴 VERY HIGH RISK";

recommendation.innerHTML="Do NOT proceed.";

}

// Score

scoreText.innerHTML=score+"%";

// ===============================
// Final Result
// ===============================

if(score < 30){

    finalResult.innerHTML = "🟢 SAFE TRANSACTION";
    finalResult.style.color = "lime";

}

else if(score < 60){

    finalResult.innerHTML = "🟡 VERIFY BEFORE PAYING";
    finalResult.style.color = "orange";

}

else{

    finalResult.innerHTML = "🔴 SUSPICIOUS TRANSACTION";
    finalResult.style.color = "red";

}

// Reasons

reasonList.innerHTML="";

if(reasons.length==0){

reasonList.innerHTML="<li>✅ No suspicious activity detected.</li>";

}else{

reasons.forEach(r=>{

let li=document.createElement("li");

li.innerHTML="⚠ "+r;

reasonList.appendChild(li);

});

}

}

// ======================
// Save History
// ======================



function saveHistory(){

    if(upi.value.trim()==="" || amount.value.trim()==="")
        return;

    let data = JSON.parse(localStorage.getItem("history")) || [];

    data.push({

        date:new Date().toLocaleString(),
        upi:upi.value,
        amount:amount.value,
        risk:scoreText.innerHTML

    });

    // Keep only latest 3 records
    if(data.length > 3){

        data = data.slice(-3);

    }

    localStorage.setItem("history",JSON.stringify(data));

    loadHistory();

}

function loadHistory() {

    let data = JSON.parse(localStorage.getItem("history")) || [];

    historyTable.innerHTML = "";

    if (data.length === 0) {

        historyTable.innerHTML = `
            <tr>
                <td colspan="4">No History</td>
            </tr>
        `;
        return;
    }

    // Show only the latest 3 transactions
    const lastThree = data.slice(-3).reverse();

    lastThree.forEach(item => {

        historyTable.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.upi}</td>
                <td>₹${item.amount}</td>
                <td>${item.risk}</td>
            </tr>
        `;

    });

}
loadHistory();