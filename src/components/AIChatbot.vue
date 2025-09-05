<template>
  <div class="ai-chatbot">
    <!-- Chatbot Toggle Button -->
    <button
      @click="toggleChat"
      class="chat-toggle"
      :class="{ active: isOpen }"
      aria-label="Open AI Chat Assistant"
    >
      <span v-if="!isOpen" class="chat-icon">🤖</span>
      <span v-else class="close-icon">✕</span>
    </button>

    <!-- Chat Window -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <div class="chat-avatar">
          <span class="avatar-icon">🤖</span>
        </div>
        <div class="chat-info">
          <h4>AirBook Assistant</h4>
          <span class="chat-status">Online</span>
        </div>
        <button @click="toggleChat" class="minimize-btn">−</button>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.sender]"
        >
          <div class="message-avatar">
            <span v-if="message.sender === 'bot'" class="avatar-icon">🤖</span>
            <span v-else class="avatar-icon">👤</span>
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message bot typing">
          <div class="message-avatar">
            <span class="avatar-icon">🤖</span>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="showQuickActions" class="quick-actions">
        <button
          v-for="action in quickActions"
          :key="action.id"
          @click="selectQuickAction(action)"
          class="quick-action-btn"
        >
          {{ action.label }}
        </button>
      </div>

      <!-- Chat Input -->
      <div class="chat-input">
        <div class="input-container">
          <input
            type="text"
            v-model="userInput"
            @keypress.enter="sendMessage"
            placeholder="Ask me about flights, bookings, or anything else..."
            class="message-input"
            :disabled="isTyping"
          >
          <button
            @click="sendMessage"
            class="send-btn"
            :disabled="!userInput.trim() || isTyping"
          >
            <span class="send-icon">📤</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIChatbot',
  data() {
    return {
      isOpen: false,
      isTyping: false,
      showQuickActions: true,
      userInput: '',
      messages: [
        {
          id: 1,
          sender: 'bot',
          text: 'Hello! I\'m your AirBook assistant. I can help you find flights, check booking status, or answer any questions about our services. How can I assist you today?',
          timestamp: new Date()
        }
      ],
      messageId: 2,
      quickActions: [
        { id: 'search', label: '🔍 Find Cheap Flights' },
        { id: 'booking', label: '🎫 Check My Booking' },
        { id: 'help', label: '❓ Help & FAQ' },
        { id: 'contact', label: '📞 Contact Support' }
      ]
    }
  },
  mounted() {
    // Auto-scroll to bottom when new messages are added
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },

    async sendMessage() {
      if (!this.userInput.trim()) return

      const userMessage = {
        id: this.messageId++,
        sender: 'user',
        text: this.userInput.trim(),
        timestamp: new Date()
      }

      this.messages.push(userMessage)
      this.userInput = ''
      this.showQuickActions = false

      // Show typing indicator
      this.isTyping = true

      // Simulate AI response delay
      setTimeout(() => {
        this.generateResponse(userMessage.text)
      }, 1000 + Math.random() * 2000) // 1-3 second delay
    },

    async generateResponse(userText) {
      this.isTyping = false

      const lowerText = userText.toLowerCase()
      let response = ''

      // Simple keyword-based responses (in a real app, this would use AI/ML)
      if (lowerText.includes('cheap') || lowerText.includes('cheapest') || lowerText.includes('find flight')) {
        response = 'I can help you find the cheapest flights! What\'s your departure city and destination? Also, when are you planning to travel?'
      } else if (lowerText.includes('booking') || lowerText.includes('reservation') || lowerText.includes('check')) {
        response = 'I can help you check your booking status. Please provide your booking reference number (it starts with "AB" followed by 6 digits).'
      } else if (lowerText.includes('cancel') || lowerText.includes('change')) {
        response = 'For booking changes or cancellations, please visit your booking details page or contact our support team. Would you like me to guide you there?'
      } else if (lowerText.includes('payment') || lowerText.includes('pay')) {
        response = 'We accept various payment methods including credit/debit cards, PayPal, and bank transfers. All transactions are secured with SSL encryption.'
      } else if (lowerText.includes('baggage') || lowerText.includes('luggage')) {
        response = 'Our standard baggage allowance is 1 checked bag (23kg) and 1 carry-on (7kg). Additional fees apply for extra baggage. Would you like to know more about our baggage policy?'
      } else if (lowerText.includes('refund') || lowerText.includes('money back')) {
        response = 'Refunds are processed within 5-7 business days after cancellation approval. The refund amount depends on our cancellation policy and how far in advance you cancel.'
      } else if (lowerText.includes('help') || lowerText.includes('faq') || lowerText.includes('question')) {
        response = 'I can help with flight searches, booking assistance, payment questions, baggage policies, and more. What specific question do you have?'
      } else if (lowerText.includes('contact') || lowerText.includes('support') || lowerText.includes('phone')) {
        response = 'You can reach our support team at 1-800-AIRBOOK or email support@airbook.com. We\'re available 24/7 to assist you!'
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        response = 'Hello! Welcome to AirBook. I\'m here to help you with anything related to flights and bookings. What can I assist you with today?'
      } else if (lowerText.includes('thank') || lowerText.includes('thanks')) {
        response = 'You\'re welcome! Is there anything else I can help you with regarding your flight or booking?'
      } else {
        // Default response for unrecognized queries
        response = 'I\'m here to help with flight searches, booking assistance, and general questions about AirBook services. Could you please rephrase your question or let me know what specific information you\'re looking for?'
      }

      const botMessage = {
        id: this.messageId++,
        sender: 'bot',
        text: response,
        timestamp: new Date()
      }

      this.messages.push(botMessage)
    },

    selectQuickAction(action) {
      let message = ''

      switch (action.id) {
        case 'search':
          message = 'I want to find cheap flights'
          break
        case 'booking':
          message = 'I want to check my booking status'
          break
        case 'help':
          message = 'I need help with something'
          break
        case 'contact':
          message = 'How can I contact support?'
          break
      }

      this.userInput = message
      this.sendMessage()
    },

    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      }
    },

    formatTime(date) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.ai-chatbot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: var(--font-family);
}

/* Chat Toggle Button */
.chat-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--primary-color);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: var(--transition);
  color: var(--white);
  font-size: 1.5rem;
}

.chat-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.chat-toggle.active {
  background: var(--danger-color);
}

.close-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

/* Chat Window */
.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chat Header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--primary-color);
  color: var(--white);
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 1.25rem;
}

.chat-info {
  flex: 1;
}

.chat-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.chat-status {
  font-size: 0.75rem;
  opacity: 0.8;
}

.minimize-btn {
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.minimize-btn:hover {
  background: rgba(255,255,255,0.2);
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.bot {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: var(--primary-color);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-text {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: var(--gray-100);
  color: var(--gray-900);
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-text {
  background: var(--primary-color);
  color: var(--white);
}

.message-time {
  font-size: 0.75rem;
  color: var(--gray-500);
  align-self: flex-start;
}

.message.user .message-time {
  align-self: flex-end;
}

/* Typing Indicator */
.typing {
  opacity: 0.7;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 0.75rem 1rem;
  background: var(--gray-100);
  border-radius: 18px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gray-500);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Quick Actions */
.quick-actions {
  padding: 1rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-action-btn {
  padding: 0.5rem 1rem;
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: var(--transition);
  text-align: left;
}

.quick-action-btn:hover {
  background: var(--primary-color);
  color: var(--white);
  border-color: var(--primary-color);
}

/* Chat Input */
.chat-input {
  padding: 1rem;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.input-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: 25px;
  outline: none;
  font-size: 0.875rem;
  transition: var(--transition);
}

.message-input:focus {
  border-color: var(--primary-color);
}

.message-input:disabled {
  background: var(--gray-100);
  cursor: not-allowed;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  color: var(--white);
}

.send-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.send-icon {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 480px) {
  .ai-chatbot {
    bottom: 10px;
    right: 10px;
  }

  .chat-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 120px);
    max-width: 350px;
  }

  .chat-toggle {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .message {
    max-width: 85%;
  }

  .quick-actions {
    padding: 0.75rem;
  }

  .quick-action-btn {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
}

/* Scrollbar Styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--gray-400);
}
</style>
