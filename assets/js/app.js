const API_KEY = localStorage.getItem("API_KEY")
const submitButton = document.getElementById("submit")
const inputElement = document.querySelector("input")
const bot = document.getElementById("bot")

function getMessage() {
    console.log("Click ok ma gueule");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
        console.log("Micro à l'écoute, envoie ton flow baby");
        bot.classList.replace("neutral", "listening")
    };

    recognition.onspeechend = () => {
        console.log("ouch merci !");
        bot.classList.replace("listening", "computing")
        recognition.stop();
    };

    recognition.onresult = (result) => {
        console.log(result.results[0][0].transcript)
        let postResult = result.results[0][0].transcript
        speechResponse(postResult)
    }
    recognition.start();
}

async function speechResponse(postResult) {
    console.log("shearch in API")
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: postResult }],
            max_tokens: 1000
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data)
        bot.classList.replace("computing", "speaking")
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.lang = 'fr-FR';
            speech.text = data.choices[0].message.content
            speechSynthesis.speak(speech);
            speech.onend = () => {
                bot.classList.replace("speaking", "neutral");
            };
        } else {
            console.log('L\'API Web Speech n\'est pas supportée par ce navigateur.');
        }
        if (data.choices[0].message.content) {
            console.log(data.choices[0].message.content)
        }

    } catch (error) {
        console.error(error)
    }
}
submitButton.addEventListener("click", getMessage)