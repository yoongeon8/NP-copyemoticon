let emojiArray = JSON.parse(localStorage.getItem("emoticon") || "[]");
function saveemoji(){
    const emoticon = document.getElementById("emoticon").value;
    //입력한 것이 특수문자나 유니코드인지 판단, 또한 특수문자 유니코드 아스키아트안에 글자,숫자가 들어갈때만 저장되게 함.
    if (/[^\w\sㄱ-ㅎ가-힣]/.test(emoticon.replace(/\n/g,''))){
        if(/[\^oO0xX;:=@*\(\)\[\]\{\}￣ー▽≧≦Tㅜㅠ눈‿☆★⌒｀・゚]/.test(emoticon) || /^[\x20-\x7E\r\n\t]+$/.test(emoticon)){
            const todoObj = {text:emoticon,group:"ascll",count:0, rank:null,checkmark:true};
            emojiArray.push(todoObj);
        }else if(/[\u2580-\u259F\u25A0-\u25FF\u2800-\u28FF\u2B00-\u2BFF]/.test(emoticon)){
            const todoObj = {text:emoticon,group:"unicode",count:0, rank:null,checkmark:true};
            emojiArray.push(todoObj);
        }
        localStorage.setItem("emoticon", JSON.stringify(emojiArray));
        document.getElementById("emoticon").value = "";
        makeemoji();
    } else{
        alert("한글,영어,숫자,공백은 안됩니다.");
        document.getElementById("emoticon").value = "";
    }
}
function bookmark(makediv,index){
    //button
    const markBtn = document.createElement("button");
    markBtn.classList.add("bookmark_toggle");
    // markBtn.setAttribute("aria-hidden", "true");
    //yellowdiv
    const yellowdiv = document.createElement("div");
    yellowdiv.classList.add("icon30", "yellow");
    yellowdiv.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.825 22L7.45 14.975L2 10.25L9.2 9.625L12 3L14.8 9.625L22 10.25L16.55 14.975L18.175 22L12 18.275L5.825 22Z" fill="#F4DC03"/>
    </svg>`;
    //whitediv
    const whitediv = document.createElement("div");
    whitediv.classList.add("icon30", "white");
    whitediv.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.825 22L7.45 14.975L2 10.25L9.2 9.625L12 3L14.8 9.625L22 10.25L16.55 14.975L18.175 22L12 18.275L5.825 22Z" fill="#FFFAFA"/>
    </svg>`;

    markBtn.appendChild(yellowdiv);
    markBtn.appendChild(whitediv);

    if(emojiArray[index]?.checkmark){
        yellowdiv.style.display = "none";
        whitediv.style.display = "block";
    }else{
        yellowdiv.style.display = "block";
        whitediv.style.display = "none";
    }

    markBtn.addEventListener("click", function(){
        const yellowVisible = yellowdiv.style.display !== "none";
            if(yellowVisible){
                yellowdiv.style.display = "none";
                whitediv.style.display = "block";
                emojiArray[index].checkmark = true;
            }
            else{
                yellowdiv.style.display = "block";
                whitediv.style.display = "none";
                emojiArray[index].checkmark = false;
            }
            localStorage.setItem("emoticon", JSON.stringify(emojiArray));
            bookmark_makeemoji();
    });
    makediv.appendChild(markBtn);
}
function bookmark_makeemoji(){
    const bookdiv = document.getElementById("bookmarkdiv");
    bookdiv.innerHTML = "";
    emojiArray.forEach((element, index) => {
        if(element.checkmark === false){
            const wapper = document.createElement("div");
            wapper.classList.add("emoji-line");
    
            const pre = document.createElement("pre");
            pre.dataset.index = index;
            pre.textContent = element.text;
    
            const btn = document.createElement("button");
            btn.innerText = '삭제';
            btn.classList.add("emoji-btn");
    
            bookmark(wapper,index);
            wapper.appendChild(pre);
            wapper.appendChild(btn);
            bookdiv.appendChild(wapper);
            btn.addEventListener("click", function(){
                emojiArray.splice(index,1);
                localStorage.setItem("emoticon", JSON.stringify(emojiArray));
                makeemoji();
                emojiRank();
                bookmark_makeemoji();
            });
        }
    });
}
function makeemoji(){
    const makediv = document.getElementById("makediv");
    makediv.innerHTML = "";

    const parms = new URLSearchParams(location.search);
    const group = parms.get("group");
    emojiArray.forEach((element, index) => {
        if(group === null || element.group === group){
            const wapper = document.createElement("div");
            wapper.classList.add("emoji-line");
    
            const pre = document.createElement("pre");
            pre.dataset.index = index;
            pre.textContent = element.text;
    
            const btn = document.createElement("button");
            btn.innerText = '삭제';
            btn.classList.add("emoji-btn");
    
            bookmark(wapper,index);
            wapper.appendChild(pre);
            wapper.appendChild(btn);
            makediv.appendChild(wapper);
            btn.addEventListener("click", function(){
                emojiArray.splice(index,1);
                localStorage.setItem("emoticon", JSON.stringify(emojiArray));
                makeemoji();
                emojiRank();
            });
        }
    });
}
function emojiRank(){
    const bestEmoji = document.getElementById("bestEmoji");
    if(!bestEmoji) return;
    bestEmoji.innerHTML = "";
    const sorts = [...emojiArray].sort((a,b) => b.count - a.count);
    
    for(let i = 0; i < sorts.length; i++){
        for(let j = 0; j < emojiArray.length; j++){
            if(emojiArray[j].text === sorts[i].text && emojiArray[j].count !== 0){
                emojiArray[j].rank = i+1;
                break;
            }
        }
    }
    for(let r = 0; r < emojiArray.length; r++){
        if(emojiArray[r].rank != null && emojiArray[r].rank === 1){
            const wapper = document.createElement("div");
            wapper.classList.add("emoji-line");
            const pre = document.createElement("pre");
            pre.textContent = emojiArray[r].text;
            wapper.appendChild(pre);
            bestEmoji.appendChild(wapper);
        }
    }
}
document.getElementById("makediv").addEventListener("click",function(e){
    if(e.target.tagName.toLowerCase() === 'pre'){
        const emojis = e.target.innerText;

        navigator.clipboard.writeText(emojis)
        .then(() => {
            alert("복사됨");
            const findemoji = emojiArray.find(obj => obj.text === emojis);
            if (findemoji) {
                findemoji.count +=1;
                emojiRank();
                localStorage.setItem("emoticon", JSON.stringify(emojiArray));
                console.log(`${emojis} count:`, findemoji.count);
            } else {
                console.log("존재하지 않는 이모티콘");
            }
        })
        .catch(err => {
            console.error('복사실패', err);
        });
    }
});
document.getElementById("bestEmoji").addEventListener("click",function(e){
    if(e.target.tagName.toLowerCase() === 'pre'){
        const emojis = e.target.innerText;

        navigator.clipboard.writeText(emojis)
        .then(() => {
            alert("복사됨");
            const findemoji = emojiArray.find(obj => obj.text === emojis);
            if (findemoji) {
                findemoji.count += 1;
                localStorage.setItem("emoticon", JSON.stringify(emojiArray));
                emojiRank();
                console.log(`${emojis} count:`, findemoji.count);
            } else {
                console.log("존재하지 않는 이모티콘");
            }
        })
        .catch(err => {
            console.error('복사실패', err);
        });
    }
});
makeemoji();
emojiRank();