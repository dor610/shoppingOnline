const container = document.getElementById("container");
let page = '1';

const navigator = {
    nav: document.getElementById("navigator"),
    page1: document.getElementById("page-1"),
    page2: document.getElementById("page-2"),
    page3: document.getElementById("page-3"),
}

const toProductBtn = document.getElementById('to-product-btn');
const toManProductBtn = document.getElementById('to-man-product-btn');
const toWomanProductBtn = document.getElementById('to-woman-product-btn');

const scrollHandle = (event) =>{
    document.removeEventListener('wheel', scrollHandle);
    switch (page) {
        case '1':
            if(event.deltaY > 0){
                openPage2();
                navigator.nav.classList.add("nav-page-2");
                navigator.nav.classList.remove("nav-page-1");
            }
            break;
        case '2':
            if(event.deltaY > 0) {
                openPage3();
                navigator.nav.classList.add("nav-page-3");
                navigator.nav.classList.remove("nav-page-2")
            }
            else{
                openPage1();
                navigator.nav.classList.add("nav-page-1");
                navigator.nav.classList.remove("nav-page-2");
            }
            container.classList.remove("page-2");
            break;
        case '3':
            if(event.deltaY < 0){
               openPage2();
               navigator.nav.classList.add("nav-page-2");
               navigator.nav.classList.remove("nav-page-3");
               container.classList.remove("page-3");
            }
            break;
        default:
           break;
    }
    setTimeout(() =>{
        document.addEventListener('wheel', scrollHandle);
    }, 500);
}

document.addEventListener('wheel', scrollHandle);

let openPage1 = () =>{
    page = '1';
    navigator.nav.classList.add("nav-page-1");
}

let openPage2 = () =>{
    container.classList.add('page-2');
    page = '2';
    navigator.nav.classList.add("nav-page-2");
}
 let openPage3 = () =>{
     container.classList.add('page-3');
     page = '3';
     navigator.nav.classList.add("nav-page-3");
 }

 window.addEventListener('load', () =>{
     toProductBtn.addEventListener("click", () =>{
        setData('nextPage', '');
        location.href = '../html/product.html';
     });
     toManProductBtn.addEventListener("click", () =>{
         setData('nextPage', 'nam');
         location.href = '../html/product.html';
     });
     toWomanProductBtn.addEventListener("click", () =>{
         setData('nextPage', 'nu');
         location.href = '../html/product.html';
     });

     navigator.page1.addEventListener('click', () =>{
        if(page === '2'){
            openPage1();
            container.classList.remove("page-2");
            navigator.nav.classList.remove("nav-page-2");
        }
        if(page === '3'){
            openPage1();
            container.classList.remove('page-3');
            navigator.nav.classList.remove('nav-page-3');
        }
     });

     navigator.page2.addEventListener('click', () =>{
         if(page === '1'){
             openPage2();
             navigator.nav.classList.remove("nav-page-1");
         }
         if(page === '3'){
             openPage2();
             container.classList.remove('page-3');
             navigator.nav.classList.remove('nav-page-3');
         }
     });

     navigator.page3.addEventListener('click', () =>{
        if(page === '1'){
            openPage3();
            navigator.nav.classList.remove('nav-page-1');
        }
        if(page === '2'){
            openPage3();
            container.classList.remove('page-2');
            navigator.nav.classList.remove('nav-page-2');
        }
     });
 })