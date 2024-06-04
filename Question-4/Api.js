const maxCalls = 15;
const interval = 60000; 
let callCount = 0;
let isPenalty = false;
let callQueue = [];

// Simulate the API call
function call_me(input) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API called with input: ${input}`);
      resolve(`Response for ${input}`);
    }, 1000); 
  });
}

// Function to handle API calls with rate limiting
function rateLimitedCall(apiFunction, input) {
  if (isPenalty) {
    console.log('Currently in penalty period. Please wait.');
    return;
  }

  if (callCount < maxCalls) {
    callCount++;
    apiFunction(input)
      .then((response) => console.log(response))
      .catch((error) => console.error('API call failed:', error));
  } else {
    console.log('Rate limit exceeded. Adding call to queue.');
    callQueue.push(() => rateLimitedCall(apiFunction, input));
  }
}

// Function to reset the call count and process the queue
function resetCalls() {
  setInterval(() => {
    if (!isPenalty) {
      callCount = 0;
      while (callQueue.length > 0 && callCount < maxCalls) {
        const queuedCall = callQueue.shift();
        queuedCall();
      }
    }
  }, interval);
}

// Function to apply a penalty
function applyPenalty() {
  console.log('Penalty applied. Waiting for 1 minute.');
  isPenalty = true;
  setTimeout(() => {
    isPenalty = false;
    callCount = 0;
  }, interval);
}

// Start the reset interval
resetCalls();

// Simulate making API calls
for (let i = 0; i < 20; i++) {
  rateLimitedCall(call_me, `input ${i + 1}`);
}

// Simulate exceeding the limit and applying penalty
setTimeout(() => {
  applyPenalty();
}, 70000); // Apply penalty after 70 seconds