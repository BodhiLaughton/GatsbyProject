const key = prompt("Enter API key: ");
let messageHistory = [
    /*{
      "role": "assistant",
      "content": "Tom: Daisy loves me over you. You are just a booklegger that showed up one day. Think about all the times that I was amazing to you, Daisy!"
    }*/
];

function displayMessages() {
    let messages = "";

    for (const message of messageHistory) {
        console.log(message.content);
        messages += message.content + "<br><br>";
    }
    document.getElementById("messages").innerHTML = messages;
}

async function getAIResponse(systemPrompt) {
    return callOpenRouter([
        systemPrompt,
        ...messageHistory
    ]);
}

async function callOpenRouter(messages) {
    const apiKey = key;
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const payload = {
        model: 'openai/gpt-oss-120b',
        messages: messages
    };

    try {
        console.log('Sending request to OpenRouter...');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        console.log(aiMessage);
        return aiMessage;
    } catch (error) {
        alert('An error occurred during the API call: ' + error);
    }
}

function submitGatsbyPrompt() {
    if (document.getElementById("gatsbyPrompt").value == "") return;

    (async () => {
        document.getElementById("userInput").style.display = "none";

        // save gatsby response to message history
        messageHistory.push({
            "role": "user",
            "content": "Gatsby: " + document.getElementById("gatsbyPrompt").value
        });
        document.getElementById("gatsbyPrompt").value = "";
        displayMessages();

        // save tom response to message history
        messageHistory.push({
            "role": "assistant",
            "content": await getAIResponse(tomPrompt)
        });
        displayMessages();

        // save daisy response to message history
        messageHistory.push({
            "role": "assistant",
            "content": await getAIResponse(daisyPrompt)
        });
        displayMessages();

        document.getElementById("loadingScreen").classList.add("hidden");

        document.getElementById("userInput").style.display = "block";
    })()
}