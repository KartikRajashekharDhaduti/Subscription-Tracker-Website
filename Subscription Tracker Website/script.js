let subs = JSON.parse(localStorage.getItem("subs")) || [];
let chartInstance = null;

function getLogo(name){
    if(name=="Netflix") return "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg";
    if(name=="Spotify") return "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg";
    if(name=="Amazon Prime") return "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png";
    if(name=="Udemy") return "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg";
    if(name=="Adobe") return "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg";/*"https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg";*/
    return "https://cdn-icons-png.flaticon.com/512/565/565547.png";
}

function addSub(){

    let category = document.getElementById("category").value;
    let service = document.getElementById("service").value;
    let cost = document.getElementById("cost").value;
    let date = document.getElementById("date").value;

    if(cost==""||date==""){
        alert("Fill all fields");
        return;
    }

    let sub={
        category,
        service,
        cost:Number(cost),
        date
    };

    subs.push(sub);
    localStorage.setItem("subs",JSON.stringify(subs));

    showSubs();
}

function showSubs(){

    let cards=document.getElementById("cards");
    cards.innerHTML="";
    let total=0;

    subs.forEach((s,index)=>{

        total+=s.cost;

        let today=new Date();
        let renewal=new Date(s.date);
        let diff=(renewal-today)/(1000*60*60*24);

        let warning="";
        if(diff<=3 && diff>=0){
            warning="<p class='warning'>⚠ Renewal Soon!</p>";
        }

        let div=document.createElement("div");
        div.className="card";

        div.innerHTML=`
        <img src="${getLogo(s.service)}">
        <h3>${s.service}</h3>
        <p style="opacity:0.8">${s.category}</p>
        <p>₹${s.cost}</p>
        <p>Renewal: ${s.date}</p>
        ${warning}
        <button onclick="deleteSub(${index})">Delete</button>
        `;

        cards.appendChild(div);
    });

    document.getElementById("total").innerText=total;

    drawChart();
}

function deleteSub(index){
    subs.splice(index,1);
    localStorage.setItem("subs",JSON.stringify(subs));
    showSubs();
}

function drawChart(){

    if(chartInstance){
        chartInstance.destroy();
    }

    let labels=[];
    let data=[];

    subs.forEach(sub=>{
        labels.push(sub.service);
        data.push(sub.cost);
    });

    chartInstance = new Chart(document.getElementById("chart"),{
        type:"doughnut",
        data:{
            labels:labels,
            datasets:[{
                data:data
            }]
        },
        options:{
            plugins:{
                legend:{
                    labels:{
                        color:"#fff"
                    }
                }
            }
        }
    });
}

showSubs();