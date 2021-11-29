const totalOrderToday = document.getElementById("total-order-today");
const totalSoldItemToday = document.getElementById("total-sold-item-today");
const todayIncome = document.getElementById("today-income");

const itemBox = document.getElementById("item-box");

let chart1 = [0,0];
let chart2 = [0,0,0,0,0];
let months = [0,0,0,0,0];
let maxValue = 0;

window.addEventListener('load', ()=>{
    getTotalSoldItemToday();
    getToDayIncome();
    getTotalOrderToDay();
    getTopSellingItem();
    getTotalOrdersByMonth();
});

function getTotalOrderToDay(){
    let data = "type=totalOrderToday";
    sendPostRequest("../php/dashboard.php", data, res=>{
        chart1[0] = parseInt(res);
        totalOrderToday.innerHTML = chart1[0];
        getTodayDeliveredOrder();
    });
}
function getTodayDeliveredOrder(){
    let data = "type=todayDeliveredOrder";
    sendPostRequest("../php/dashboard.php", data, res => {
        console.log(res);
       chart1[1] = parseInt(res);
       setChart1();
    });
}

function  getTotalOrdersByMonth(){
    let date = new Date();
    let month = date.getMonth() +1;
    let year = date.getFullYear();
    months[4] = month;
    for(let i = 3; i >= 0; i--){
        if(month > 1){
            month -= 1;
        }else {
            month = 12;
        }
        months[i] = month;
    }
    console.log(months);

    for(let i = 0; i < 5; i++){
        let data = "month="+months[i]+"&year="+year+"&type=totalOrderByMonth";
        sendPostRequest("../php/dashboard.php", data, res =>{
           chart2[i] = parseInt(res);
           if(maxValue < chart2[i]) maxValue = chart2[i];
        });
    }

    setTimeout(() => {
        setChart2();
    }, 500);
}

function getTotalSoldItemToday(){
    let data = "type=totalSoldItemToday";
    sendPostRequest("../php/dashboard.php", data, res =>{
       totalSoldItemToday.innerHTML = parseInt(res);
    });
}

function getToDayIncome(){
    let data = "type=todayIncome";
    sendPostRequest("../php/dashboard.php", data, res =>{
       todayIncome.innerHTML = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(res);
    });
}

function getTopSellingItem(){
    let data = "type=topSellingItem";
    sendPostRequest("../php/dashboard.php", data, res=>{
        //console.log(res);
        itemBox.innerHTML = "";
        let items = JSON.parse(res);
        items.forEach(i =>{
           let item = JSON.parse(i);
            let div =  createItemElement(item);
            itemBox.appendChild(div);
        });
    });
}

function createItemElement(data){
    let parent = document.createElement("div");
    let imgBox = document.createElement("div");
    let img = document.createElement("img");
    sendPostRequest("../php/product.php", "mshh="+data.mshh+"&type=getItemImage", res =>{
        //console.log(res);
        let hinh = JSON.parse(res);
        img.src = "../../khachhang/img/product/"+hinh.tenHinh+".png";
    });
    imgBox.appendChild(img);

    let name = document.createElement("div");
    name.innerHTML = data.Tenhh;

    let quantity = document.createElement("div");
    quantity.innerHTML = "Số lượng đã bán: "+data.soluong;

    parent.appendChild(imgBox);
    parent.appendChild(name);
    parent.appendChild(quantity);

    return parent;
}

function setChart1(){
    let xValues = ['Đã tạo', 'Đã giao'];
    let barColors = ['deepskyblue', 'pink'];
    let chart = new Chart("chart1", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: chart1
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Đơn Hàng Trong Ngày"
            },
            scales: {
                yAxes: [{
                    display: true,
                    stacked: true,
                    ticks: {
                        min: 0,
                        max: chart1[0]>chart1[1]?chart1[0]+2:chart1[1]+2,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Số lượng'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Loại',
                    }
                }]
            }
        }
    });
}

function setChart2(){
    let yValues = chart2;
    let xValues = months;
    let chart = new Chart("chart2", {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                lineTension: 0.1,
                backgroundColor: "deepskyblue",
                borderColor: "#87CEEB80",
                data: yValues
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Đơn Hàng Trong 5 Tháng Vừa Qua"
            },
            scales: {
                yAxes: [{
                    display: true,
                    stacked: true,
                    ticks: {
                        min: 0,
                        max: maxValue + 2,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Số lượng'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Tháng',
                    }
                }]
            }
        }
    });
}