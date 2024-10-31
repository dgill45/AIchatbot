document.addEventListener("DOMContentLoaded", () => {
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const chatBox = document.getElementById('chat-box') as HTMLElement;
const messageInput = document.getElementById('message-input') as HTMLInputElement;

let canSendRequest = true;
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;  // Replace with your OpenAI API key
console.log("API Key:", apiKey)

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = messageInput.value.trim();

  if (!userMessage || !canSendRequest) return;

  // Append the user's message to the chat box
  appendMessage('user', userMessage);
  canSendRequest = false;

  setTimeout(() => {
    canSendRequest = true;
  }, 2000);

  // Send the user's message to OpenAI and get the response
  const botResponse = await getBotResponse(userMessage);

  // Append the bot's response to the chat box
  appendMessage('bot', botResponse);

  messageInput.value = '';
});

// Function to append message to the chat box
function appendMessage(sender: 'user' | 'bot', message: string) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message');
  messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
  messageDiv.textContent = `${sender === 'user' ? 'You' : 'Bot'}: ${message}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to the bottom
}

// Function to get bot response from OpenAI API
async function getBotResponse(message: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    }),
  });

  if (!response.ok) {
    return 'Error: Unable to contact OpenAI.';
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
})