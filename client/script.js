import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textcontent = '';

    loadInterval = setInterval(() => {
        element.textcontent += '.';

        if(element.textcontent === '....'){
            element.textcontent = '';
        }
    }, 300)
}

function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if(index < text.length) {
         element.innerHTML += text.charAt(index);
         index++;
        } else {
            clearInterval(interval);
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
return (
    `
    <div class="wrapper ${isAi && 'ai'}">
     <div class="chat">
       <div class="profile">
        <img 
        src="${isAi ? bot : user}"
        alt="${isAi ? 'bot' : 'user'}"
        />
       </div>
       <div class="message" id=${uniqueId}>${value}</div>
     </div>
    </div>
    `
)
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();
    // bot chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, "", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // fetch data from server
    const response = await fetch('https://mindblowingai-r7jx.onrender.com/', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if(response.ok) {
        const data = await response.json();
        const perseData = data.bot.trim();

        typeText(messageDiv, perseData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = 'something went wrong, if continue to happen please fell free to contact mansur at 08136009118';
    }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        handleSubmit(e);
    }
}) 