
   const str = "The stuff of the earth is one thing... complete, all embracing and whole.";
        const text = document.getElementById("text");
        window.onload = function(){
            for (let i = 0; i < str.length; i++) {
                let span = document.createElement('span');
                span.innerHTML = str[i] 
                text.appendChild(span);
                console.log(str[i])
                span.style.transform = `rotate(${4.8*i}deg)`;
            }
        }
