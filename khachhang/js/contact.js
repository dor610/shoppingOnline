const contactNav = {
    supportingBtn: document.getElementById("contact-support-btn"),
    cooperatingBtn: document.getElementById("contact-cooperate-btn"),
}

const contact = {
    supportingTab: document.getElementById("contact-support"),
    cooperatingTab: document.getElementById("contact-cooperate"),
}

window.addEventListener('load', () =>{
    console.log("huhu")
    contactNav.cooperatingBtn.addEventListener('click', openCooperatingTab);

    contactNav.supportingBtn.addEventListener('click', openSupportingTab);
});

let openSupportingTab = () =>{
    console.log("hihi")
    if(contactNav.cooperatingBtn.classList.contains("contact-active-btn")){
        contactNav.cooperatingBtn.classList.remove("contact-active-btn");
        contactNav.supportingBtn.classList.add("contact-active-btn");
        contact.cooperatingTab.classList.add('hidden');
        contact.supportingTab.classList.remove('hidden');
    }
}

let openCooperatingTab = () =>{
    console.log("hahah")
    if(contactNav.supportingBtn.classList.contains("contact-active-btn")){
        contactNav.cooperatingBtn.classList.add("contact-active-btn");
        contactNav.supportingBtn.classList.remove("contact-active-btn");
        contact.cooperatingTab.classList.remove('hidden');
        contact.supportingTab.classList.add('hidden');
    }
}