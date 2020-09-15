let isNavOpen = false;
let btn = document.getElementById("btn-toggle-nav");
let sidebar = document.getElementById("nav-sidebar");
let menuItems = document.getElementsByClassName("menu-item");
let skills = document.getElementById("skills");
let skillsInProgress = document.getElementById("skills-in-progress");
let skillList = document.getElementsByClassName("skill");
let line = document.getElementById("line");
let projectBox = document.getElementsByClassName("project-box");
let contactBox = document.getElementsByClassName("contact-box");
let preloader = document.getElementById("preloader");

setTimeout(() => {
    setTimeout(() => {
        preloader.style.display = "none";
    }, 600);
    preloader.style.opacity = "0";
}, 4000);

let changeColor = (x)=>{
    let wrapper = document.getElementsByClassName("wrapper")[0];
    if(x==='toDark'){
        if(wrapper.style.getPropertyValue('--acc-color') !=='#bdc3c7'){
            document.getElementsByClassName("line-cover")[0].style.opacity = "0";
            document.getElementsByClassName("line-cover")[1].style.opacity = "0";
            wrapper.style.setProperty('--acc-color', '#bdc3c7');
            wrapper.style.setProperty('--main-color', '#2c3e50');     
            setTimeout(() => {
                document.getElementsByClassName("line-cover")[0].style.opacity = "1";
                document.getElementsByClassName("line-cover")[1].style.opacity = "1";
            }, 3100);
        }
    }else{    
        if(wrapper.style.getPropertyValue('--acc-color') !=='#2c3e50'){
            document.getElementsByClassName("line-cover")[0].style.opacity = "0";
            document.getElementsByClassName("line-cover")[1].style.opacity = "0";
            wrapper.style.setProperty('--main-color', '#bdc3c7');
            wrapper.style.setProperty('--acc-color', '#2c3e50');     
            setTimeout(() => {
                document.getElementsByClassName("line-cover")[0].style.opacity = "1";
                document.getElementsByClassName("line-cover")[1].style.opacity = "1";
            }, 3100);
        }
    }
};

let closeMenu = ()=>{
    if(isNavOpen){
        for(let i=0; i<menuItems.length; i++){
            setTimeout(()=>{menuItems[i].style.visibility = "hidden";},
            i*40);
        };
        btn.style.backgroundImage="url('img/hamburger.png')"; 
        setTimeout(()=>{sidebar.style.width = 0;}, menuItems.length*40);
        isNavOpen = false;
    };         
};

let openMenu = ()=>{
    if(!isNavOpen){
        if(document.body.scrollWidth<=767){
            sidebar.style.width = '100%';
        } else {
            sidebar.style.width = '50%';
        }
        btn.style.backgroundImage="url('img/exit.png')";
        setTimeout(()=>{
            for(let i=0; i<menuItems.length; i++){
                setTimeout(()=>{menuItems[i].style.visibility = "visible";},
                i*40);
            };
        }, 40*menuItems.length);
        isNavOpen = true;
    }
};

let displayMenu = function(){
    if(isNavOpen){
        closeMenu();
    }else{
        openMenu();
    }
};

let scrollFunc = function(){
    let about = document.getElementById("about-paragraph");
    /*  pokazywanie/chowanie linii #line dla Skills  */
    let aboutRect = about.getBoundingClientRect();
    let elemTop = aboutRect.top;
    var isAboutVisible = elemTop >= 0;
    
    if(isAboutVisible) {
        line.style.opacity = "0";
        line.style.top = "135vh";
        for(let i=0; i<skillList.length; i++){
            setTimeout(()=>{skillList[i].style.opacity = "0";},
            i*40);
        };
    }
    else{
        line.style.opacity = ".8";
        line.style.top = "35vh";
        for(let i=0; i<skillList.length; i++){
            setTimeout(()=>{skillList[i].style.opacity = "0.3";},
            i*40);
        };
    }

    let scrollProgress = document.documentElement.scrollTop;
    let skillsScrollProgress = skills.scrollTop;
    let skillsInProgressScrollProgress = skillsInProgress.scrollTop;
    let maxSkillsScrollPos = (skills.scrollHeight - skills.clientHeight);
    let maxSkillsInProgressScrollPos = (skillsInProgress.scrollHeight - skillsInProgress.clientHeight);

    var isProjectBoxVisible = projectBox[0].getBoundingClientRect().top >= 0;
    if(isProjectBoxVisible) {
        changeColor('toLight');
    }
    else{
        changeColor('toDark');
    }
    var scrollingUp = this.oldScroll > this.scrollY;  //true jesli przewija do góry, false gdy w dół
    this.oldScroll = this.scrollY;                    //
    /*      DLA skills      */
    //      jesli w trakcie przewijania skillsów, to nie można przewijać strony
    if(0 < skillsScrollProgress && skillsScrollProgress < maxSkillsScrollPos ){ 
        skills.scrollIntoView({behavior: "smooth"});
    }
        // nie mozna przewinac w dol, jesli nie przewinie sie na koniec skillsow
    if(!scrollingUp) { 
        if(scrollProgress>skills.offsetTop && skillsScrollProgress<maxSkillsScrollPos){
            skills.scrollIntoView({behavior: "smooth"});
        }
        //  nie mozna przewinac w dol, jesli nie przewinie sie na poczatek skillsow
    } else {
        if(scrollProgress<skills.offsetTop && skillsScrollProgress>0){
            skills.scrollIntoView({behavior: "smooth"});
        }
    }
    /*      DLA skills-in-progress      */
    //      jesli w trakcie przewijania skillsów, to nie można przewijać strony
    if(0 < skillsInProgressScrollProgress && skillsInProgressScrollProgress < maxSkillsInProgressScrollPos ){ 
        skillsInProgress.scrollIntoView({behavior: "smooth"});
    }
    //      nie mozna przewinac w dol, jesli nie przewinie sie na koniec skillsow
    if(!scrollingUp) { 
        if(scrollProgress>skillsInProgress.offsetTop && skillsInProgressScrollProgress<maxSkillsInProgressScrollPos){
            skillsInProgress.scrollIntoView({behavior: "smooth"});
        }
    //      nie mozna przewinac w dol, jesli nie przewinie sie na poczatek skillsow
    } else {
        if(scrollProgress<skillsInProgress.offsetTop && skillsInProgressScrollProgress>0){
            skillsInProgress.scrollIntoView({behavior: "smooth"});
        }
    }
}
window.addEventListener("scroll", scrollFunc);         
skills.addEventListener("scroll", scrollFunc);    
skillsInProgress.addEventListener("scroll", scrollFunc);
btn.addEventListener("click", displayMenu);

window.addEventListener("click", ()=>{
    if(isNavOpen){
        closeMenu();
        isNavOpen = false;
    }
});

for(let i=0; i<menuItems.length; i++){
    menuItems[i].addEventListener("click", () => {        
        switch(i){
            case 0: //home
            case 1: //about
            case 2: //skills
                skills.scrollTop=0;
                skillsInProgress.scrollTop=0;
                break;
            case 3: //projects
            case 4: //skills in progress
                skills.scrollTop=(skills.scrollHeight - skills.clientHeight);  // maxSkillsScrollPos
                skillsInProgress.scrollTop=0;
                break;
            case 5: //contact
                skills.scrollTop=(skills.scrollHeight - skills.clientHeight);  // maxSkillsScrollPos
                skillsInProgress.scrollTop=(skillsInProgress.scrollHeight - skillsInProgress.clientHeight); //maxSkillsInProgressScrollPos
                break;
            default:
                break;
        }
    })
};

sidebar.addEventListener("click", ()=>{
    if(event.target.className !== 'menu-item-link'){
        event.stopPropagation()}
    });
btn.addEventListener("click", ()=>{event.stopPropagation()});


var isContactZoomed = false;
for(let i=0; i<contactBox.length; i+=3){
        contactBox[i].addEventListener("click", () => {
            if(isContactZoomed){
                contactBox[i].style.transform = "none";
                contactBox[i].style.zIndex = "0";
                contactBox[i].style.opacity = "0.8";
                contactBox[i].textContent = "";
                var node = document.createElement("I");
                switch(i){
                    case 0: 
                        node.className = "fas fa-envelope";
                        break;
                    case 3: 
                        node.className = "fas fa-phone-square-alt";
                        break;
                    default:
                        break;
                }
                contactBox[i].appendChild(node);   
                isContactZoomed = false;
            } else {
                if(document.body.scrollWidth<=767){
                    contactBox[i].style.transform = "scale(2.5)";
                } else {
                    contactBox[i].style.transform = "scale(3.5)";                    
                }
                contactBox[i].style.zIndex = "1";
                contactBox[i].style.opacity = "1";
                switch(i){
                    case 0: 
                        contactBox[i].textContent = "Mail me at: \r\n"+"jjniemiec@wp.pl";
                        break;
                    case 3: 
                        contactBox[i].textContent = "Call me at: \r\n"+"725 188 888";
                        break;
                    default:
                        break;
                }
                isContactZoomed = true;           
            }
        })
};

var isProjectZoomed = false;
for(let i=0; i<projectBox.length; i++){
        projectBox[i].addEventListener("click", () => {
            if(isProjectZoomed){
                projectBox[i].style.transform = "none";
                projectBox[i].style.zIndex = "0";
                projectBox[i].style.opacity = "0.8";
                projectBox[i].textContent = "";
                var node = document.createElement("I");
                switch(i){
                    case 0: 
                        node.className = "fas fa-car";
                        break;
                    case 1: 
                        node.className = "fas fa-shopping-basket";
                        break;
                    case 2: 
                        node.className = "fas fa-file-alt";
                        break;
                    case 3: 
                        node.className = "fas fa-ellipsis-h";
                        break;
                    default:
                        break;
                }
                projectBox[i].appendChild(node);   
                isProjectZoomed = false;
            } else {
                if(document.body.scrollWidth<=767){
                    projectBox[i].style.transform = "scale(2.5)";
                } else {
                    projectBox[i].style.transform = "scale(3.5)";                    
                }
                projectBox[i].style.zIndex = "1";
                projectBox[i].style.opacity = "1";
                switch(i){
                    case 0: 
                        projectBox[i].textContent = "Mobile application on the android platform, which communicates with the car computer via a Bluetooth module connected to the OBDII interface. The application will enable reading and deleting engine errors, as well as displaying current engine parameters.";
                        break;
                    case 1: 
                        projectBox[i].textContent = "A database of products sold in the food wholesale, mobile access application on the android platform for employees and customers.";
                        break;
                    case 2: 
                        projectBox[i].textContent = "This page, which was implemented as a CodersCamp project. You can check the source code by clicking ";
                        var node = document.createElement("a");
                        var linkText = document.createTextNode("this link.");
                        node.appendChild(linkText);
                        node.title = "Github";
                        node.href = "https://github.com/juriakajurek/juriakajurek.github.io/tree/master/Wizyt%C3%B3wka";
                        node.target = "_blank";
                        projectBox[i].appendChild(node);
                        break;
                    case 3: 
                        projectBox[i].textContent = "Still working hard, so new projects are on the way!";
                        break;
                    default:
                        break;
                }
                isProjectZoomed = true;           
            }
        })
};