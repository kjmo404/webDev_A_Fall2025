
// Canvas 
const canvas = document.getElementById('desktopCanvas');
const ctx = canvas.getContext('2d');

// Make canvas fit window
function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
canvas.style.display = 'none';

const titleScreen = document.getElementById('titlescreen');
const bootScreen = document.getElementById('bootScreen');
const BOOT_DURATION = 3000;

// Load Images

const desktopBackground = new Image();
desktopBackground.src = '90s-computer-background.jpg';

const folderClosedImg = new Image();
folderClosedImg.src = 'directory_closed-4.png';

const folderOpenImg = new Image();
folderOpenImg.src = 'directory_open_cool-3.png';

const folderHoverImg = new Image();
folderHoverImg.src = 'directory_open_cool-3.png';


// Start Button
document.getElementById('start').addEventListener('click', () => {
    fadeOut(titleScreen, () => {
        bootScreen.style.display = 'block';
        startBootSequence();
    });
});


// fade transitions

function fadeOut(element, callback){
    let alpha = 1;
    const fade = setInterval(() => {
        alpha -= 0.05;
        element.style.opacity = alpha;
        if(alpha <= 0){
            clearInterval(fade);
            element.style.display = 'none';
            if(callback) callback();
        }
    }, 50);
}


// Boot Sequence

function startBootSequence(){
    bootScreen.style.opacity = 1;
    setTimeout(() => {
        fadeOut(bootScreen, () => {
            canvas.style.display = 'block';
            document.getElementById('taskbar').style.display = 'flex'; // Show taskbar here
            Desktop.init();
            updateClock();
        });
    }, BOOT_DURATION);
}



// Solved phrases
const solvedPhrases = ["Hello?", "Why am I here?", "Please help me", "Is anyone there?", "Lost...","LET ME OUT!"];


// Desktop 
const Desktop = {
    items: [],
    selectedItem: null,
    offsetX:0, offsetY:0,
    hoveredItem:null,
    init() {
        // Multiple folders
        this.items.push(
            {x:100, y:100, width:80, height:80, name:'Puzzle 1', type:'puzzle', open:false, solved:false},
            {x:250, y:100, width:80, height:80, name:'Puzzle 2', type:'puzzle', open:false, solved:false},
            {x:400, y:100, width:80, height:80, name:'Puzzle 3', type:'puzzle', open:false, solved:false},
            {x:550, y:100, width:80, height:80, name:'Documents', type:'folder', open:false},
            {x:700, y:100, width:80, height:80, name:'Music', type:'folder', open:false}
        );

        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

        this.render();
    },
    render() {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Desktop background
        if(desktopBackground.complete){
            ctx.drawImage(desktopBackground, 0,0,canvas.width,canvas.height);
        } else {
            ctx.fillStyle = '#3366cc';
            ctx.fillRect(0,0,canvas.width,canvas.height);
        }

        // Hover detection
        this.hoveredItem = null;
        const rect = canvas.getBoundingClientRect();
        canvas.addEventListener('mousemove', e => {
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            this.hoveredItem = null;
            for(let i=this.items.length-1;i>=0;i--){
                let item = this.items[i];
                if(mouseX>item.x && mouseX<item.x+item.width &&
                   mouseY>item.y && mouseY<item.y+item.height){
                    this.hoveredItem = item;
                    break;
                }
            }
        });

        this.items.forEach(item=>{
            let img = item.open ? folderOpenImg : folderClosedImg;
            if(this.hoveredItem === item) img = folderHoverImg;
            if(img.complete) ctx.drawImage(img,item.x,item.y,item.width,item.height);
            ctx.fillStyle = '#000';
            ctx.fillText(item.name,item.x,item.y+item.height+15);
        });

        requestAnimationFrame(this.render.bind(this));
    },
    onMouseDown(e){
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for(let i=this.items.length-1;i>=0;i--){
            let item = this.items[i];
            if(mouseX>item.x && mouseX<item.x+item.width &&
               mouseY>item.y && mouseY<item.y+item.height){
                this.selectedItem = item;
                this.offsetX = mouseX - item.x;
                this.offsetY = mouseY - item.y;

                if(item.type==='puzzle' && !item.solved) Puzzle.show(item);
                break;
            }
        }
    },
    onMouseMove(e){
        if(this.selectedItem){
            const rect = canvas.getBoundingClientRect();
            this.selectedItem.x = e.clientX - rect.left - this.offsetX;
            this.selectedItem.y = e.clientY - rect.top - this.offsetY;
        }
    },
    onMouseUp(){
        this.selectedItem = null;
    }
};


// Puzzle System - inspo from geeks by geeks
const Puzzle = {
    card:null,
    currentFolder:null,
    init(folder){
        if(this.card) this.card.remove();
        this.currentFolder = folder;

        this.card = document.createElement('div');
        this.card.className='card';
        document.body.appendChild(this.card);

        this.card.innerHTML=`
            <h1>Guess the word</h1>
            <p><b>Hint:</b> Cyber/Tech related</p>
            <p id="displayWord"></p>
            <p>Guess one letter: <input type="text" maxlength="1" id="letter-input"></p>
            <button id="guessBtn">Submit</button>
        `;

        const words = ["virus","patch","glitch","boot","kernel","exploit","cipher","daemon","firewall","payload"];
        folder.selectedWord = words[Math.floor(Math.random()*words.length)];
        folder.guessedList = [];
        this.card.querySelector('#displayWord').textContent = "_ ".repeat(folder.selectedWord.length);

        this.card.querySelector('#guessBtn').addEventListener('click', ()=>{
            let input = this.card.querySelector('#letter-input');
            if(!input.value) return alert("Enter a letter!");
            let letter = input.value.toLowerCase();
            input.value='';
            if(folder.guessedList.includes(letter)) return alert("Already guessed!");
            folder.guessedList.push(letter);

            let updatedDisplay='';
            let complete=true;
            for(let ch of folder.selectedWord){
                if(folder.guessedList.includes(ch)){
                    updatedDisplay+=ch+" ";
                } else {
                    updatedDisplay+="_ ";
                    complete=false;
                }
            }
            this.card.querySelector('#displayWord').textContent = updatedDisplay;

            if(complete){
                alert(`You guessed the word! It was "${folder.selectedWord}"`);
                this.card.style.display='none';
                folder.solved=true;
                folder.name = solvedPhrases[Math.floor(Math.random()*solvedPhrases.length)];
            }
        });
    },
    show(folder){
        this.init(folder);
        this.card.style.display='block';
    }
};

// Taskbar Clock
function updateClock(){
    const clock = document.getElementById('clock');
    const now = new Date();

    let hours = 11
    let minutes = 50 + (Math.floor(Date.now()/60000)%10);
    let seconds = now.getSeconds();

    if(minutes===59 && seconds%2===0) minutes='5'+Math.floor(Math.random()*10);

    clock.textContent = `${hours}:${minutes.toString().padStart(2,'0')}`;
    requestAnimationFrame(updateClock);
}
