const key = prompt("Enter API key: ");
let messageHistory = [];

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

        document.getElementById("loadingScreen").classList.remove("hidden");

        // save tom response to message history
        messageHistory.push({
            "role": "assistant",
            "content": await getAIResponse(tomPrompt)
        });
        displayMessages();

        // save daisy response to message history
        let daisyResponse = await getAIResponse(daisyPrompt);
        let endOfGame = false;
        if (daisyResponse.includes("{marker: end}")) {
            daisyResponse = daisyResponse.replace("{marker: end}", "");
            endOfGame = true;
        }

        messageHistory.push({
            "role": "assistant",
            "content": daisyResponse
        });
        displayMessages();

        if (endOfGame) {
            fail();
            return;
        }

        document.getElementById("loadingScreen").classList.add("hidden");
        document.getElementById("userInput").style.display = "block";
    })()
}

async function fail() {
    const dynamicEnding = await getAIResponse(endPrompt);

    const finalGameOverMessage =
        `<h3>&#128721; GAME OVER: THE ILLUSION SHATTERS</h3>
        <p><em>${dynamicEnding}</em></p>
        <p>You drive home to West Egg in defeat, the green light on the dock flickering dimly in the distance, stripped of its colossal significance.</p>
        <p>You chose to fight against time and class, but the system was rigged from the start. You have learned the hard way what Nick Carraway ultimately realized about the elite:</p>
        <blockquote>"They were careless people, Tom and Daisy-they smashed up things and creatures and then retreated back into their money or their vast carelessness..."</blockquote>`;

    document.getElementById("messages").innerHTML += finalGameOverMessage;
}