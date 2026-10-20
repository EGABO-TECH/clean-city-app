/* ============================================================
   UNWM AI CHATBOT
   Author: Uganda National Waste Management
   Description: Smart assistant that knows everything about the
   public website. Never reveals admin/worker/system internals.
   ============================================================ */

'use strict';

(function () {
  // ============================================================
  // KNOWLEDGE BASE - Public Information Only
  // ============================================================
  const KNOWLEDGE = {
    // ---------- GENERAL ----------
    about: {
      keywords: ['about', 'who are you', 'what is unwm', 'company', 'uganda national waste', 'organization', 'tell me about', 'what do you do'],
      response: `**Uganda National Waste Management (UNWM)** is a nationwide waste management organization committed to keeping Uganda clean and green. 🌿\n\nWe operate in **all 146 districts** of Uganda with **500+ collection stations**, providing:\n• Household & commercial waste collection\n• Recycling and composting programs\n• Hazardous waste disposal\n• Community education\n\nOur mission is simple: **Clean Uganda, Green Future.**`
    },

    services: {
      keywords: ['services', 'what do you offer', 'what services', 'collection types', 'what can you collect', 'service list'],
      response: `We offer **6 core services** across Uganda:\n\n🏠 **Household Collection** - Weekly/bi-weekly pickups for homes\n🏢 **Commercial Waste** - Custom schedules for businesses & markets\n🏭 **Industrial & Hazardous** - Safe handling of medical, chemical, and e-waste\n♻️ **Recycling Program** - Plastics, paper, glass, and metals\n🌱 **Composting Services** - Organic waste to fertilizer\n💻 **E-Waste Management** - Safe disposal of electronics\n\nWould you like me to explain any of these in detail? Just ask!`
    },

    pricing: {
      keywords: ['price', 'pricing', 'cost', 'how much', 'fee', 'rates', 'package', 'payment', 'charge', 'subscription'],
      response: `Here are our **service packages** (as of 2025):\n\n💚 **Household Basic** - UGX 30,000/month\n• Weekly pickup, 1 bin, general waste\n\n⭐ **Family Plus** - UGX 55,000/month *(Most Popular)*\n• Twice weekly, 2 bins, recycling included\n\n🏢 **Business Pro** - UGX 150,000/month\n• Custom schedule, bulk containers, compliance reports\n\nFor industrial or custom solutions, please [contact us](contact.html) for a **free quote**.`
    },

    booking: {
      keywords: ['book', 'booking', 'schedule', 'pickup', 'report waste', 'i have waste', 'how to report', 'request pickup', 'need collection'],
      response: `Booking a pickup is **fast and free** - it takes less than 2 minutes! 🚛\n\n**How it works:**\n1️⃣ Go to the [Book Pickup page](booking.html)\n2️⃣ Fill in your location (district + area)\n3️⃣ Choose the waste type and volume\n4️⃣ Get an **instant ETA**\n\nOur nearest team will call you to confirm. Average response time in major cities is **under 3 hours**.`
    },

    districts: {
      keywords: ['district', 'where do you operate', 'coverage', 'stations', 'regions', 'which areas', 'kampala', 'gulu', 'mbarara', 'jinja', 'do you serve'],
      response: `We operate in **all 146 districts** of Uganda, organized into 4 regions:\n\n🗺️ **Central** - 24 districts (Kampala, Wakiso, Mukono, Masaka...)\n🗺️ **Eastern** - 34 districts (Jinja, Mbale, Soroti, Tororo...)\n🗺️ **Northern** - 30 districts (Gulu, Lira, Arua, Kitgum...)\n🗺️ **Western** - 26 districts (Mbarara, Fort Portal, Kasese...)\n\nTo find your nearest station and phone number, visit the [Districts page](districts.html).`
    },

    contact: {
      keywords: ['contact', 'phone', 'email', 'call', 'reach you', 'hotline', 'talk to someone', 'customer service', 'support number'],
      response: `Here's how to reach us:\n\n📞 **National Hotline:** +256 800 100 200 *(toll-free)*\n📱 **Office:** +256 414 123 456\n🚨 **24/7 Emergency:** +256 772 999 000\n✉️ **Email:** info@unwm.ug\n📍 **Head Office:** Plot 12, Kampala Road, Kampala\n\nFor full details, visit the [Contact page](contact.html).`
    },

    feedback: {
      keywords: ['feedback', 'review', 'complaint', 'rate', 'report issue', 'not happy', 'praise', 'suggestion', 'improve'],
      response: `Your feedback helps us improve! 💬\n\nYou can:\n• Submit a **review** with a star rating\n• Report an **issue** in your area\n• Suggest **improvements**\n• Praise a **team member** who helped you\n\nVisit the [Feedback page](feedback.html) to share your thoughts. Every review is read by our team.`
    },

    // ---------- WASTE EDUCATION ----------
    wasteTypes: {
      keywords: ['types of waste', 'what is waste', 'kinds of waste', 'categories of waste', 'waste classification'],
      response: `Uganda generates **6 main types of waste**:\n\n🗑️ **Household** - Food scraps, packaging, paper\n🏪 **Commercial** - From shops, markets, hotels\n🏭 **Industrial** - Manufacturing by-products\n🏥 **Medical** - Needles, bandages, expired medicines\n💻 **E-Waste** - Computers, phones, appliances\n🌾 **Agricultural** - Crop residues, manure\n\nEach requires **different handling**. Would you like to know how to handle a specific type?`
    },

    segregation: {
      keywords: ['segregate', 'separation', 'sorting', 'separate waste', 'how to sort', 'bin color', 'colour bin'],
      response: `**Waste segregation** is the #1 way to improve recycling! Here's the color code:\n\n🔵 **Blue Bin** → Plastics, glass, metals (dry recyclables)\n🟢 **Green Bin** → Organic waste (food, garden)\n🟡 **Yellow Bin** → Paper and cardboard\n🔴 **Red Bin** → Hazardous (batteries, chemicals, medical)\n⚫ **Black Bin** → General non-recyclable waste\n\n💡 **Tip:** Rinse containers before recycling. Keep organics separate for composting!`
    },

    recycling: {
      keywords: ['recycle', 'recycling', 'how to recycle', 'recycle plastic', 'recyclable', 'reduce reuse'],
      response: `**Recycling** turns waste into new products - saving energy, trees, and jobs! ♻️\n\n**What can be recycled:**\n• Plastics (PET bottles, containers)\n• Paper & cardboard\n• Glass (bottles, jars)\n• Metals (cans, scrap)\n\n**The 3 Rs:**\n1️⃣ **Reduce** - Buy less, choose minimal packaging\n2️⃣ **Reuse** - Repurpose containers, donate, repair\n3️⃣ **Recycle** - Sort and drop off at our stations\n\nOnly about **10-15%** of Uganda's waste is recycled today - let's change that together!`
    },

    composting: {
      keywords: ['compost', 'composting', 'organic waste', 'food waste', 'garden waste', 'manure', 'fertilizer from waste'],
      response: `**Composting** turns food and garden waste into rich fertilizer! 🌱\n\n**How to compost at home:**\n1. Pick a dry, shady spot\n2. Alternate **greens** (food scraps, grass) with **browns** (leaves, cardboard)\n3. Keep it moist - like a wrung-out sponge\n4. Turn every 1-2 weeks\n5. In 2-3 months → nutrient-rich compost!\n\n**Never compost:** meat, dairy, pet waste, diseased plants.`
    },

    hazardous: {
      keywords: ['hazardous', 'dangerous waste', 'medical waste', 'chemical', 'battery', 'toxic', 'e-waste', 'electronic waste'],
      response: `⚠️ **Hazardous waste** requires special handling - never put it in regular bins!\n\n**Examples:**\n• Used batteries & electronics\n• Medical waste (needles, expired medicine)\n• Chemicals, paints, solvents\n• Fluorescent bulbs\n\n**What to do:**\n📞 Call our emergency line: **+256 772 999 000**\nWe'll collect and dispose of it safely per NEMA regulations.`
    },

    environment: {
      keywords: ['environment', 'pollution', 'climate', 'greenhouse', 'plastic pollution', 'why does it matter', 'environmental impact'],
      response: `**Why waste management matters for Uganda:** 🌍\n\n💧 **Water** - Dumped waste pollutes lakes & rivers; plastics block drains causing floods\n🌱 **Soil** - Toxins kill beneficial microorganisms and reduce crop yields\n💨 **Air** - Open burning releases toxic fumes; landfills emit methane\n🐟 **Wildlife** - Plastics kill fish, birds, and animals\n❤️ **Health** - Rotting waste breeds mosquitoes, flies, and disease\n\nEvery proper disposal protects Uganda's future. **Together we keep it clean!**`
    },

    threeRs: {
      keywords: ['3 rs', 'three rs', 'reduce reuse recycle', 'waste hierarchy'],
      response: `**The 3 Rs - foundation of waste management:**\n\n🔻 **REDUCE** - Buy less, avoid single-use plastics. The best waste is waste never created.\n🔄 **REUSE** - Repurpose, donate, repair. Extend product life.\n♻️ **RECYCLE** - Sort and recycle paper, plastic, glass, metal.\n\nStart with **Reduce**, then **Reuse**, and **Recycle** as a last resort before disposal.`
    },

    // ---------- WEBSITE HELP ----------
    learn: {
      keywords: ['learn', 'education', 'teach me', 'learn more', 'training', 'workshop', 'school', 'awareness'],
      response: `Our [Learn page](learn.html) has free educational content:\n\n📚 **Waste Management Basics** - 6 clickable cards with deep dives\n🌿 **The 3 Rs** - Reduce, Reuse, Recycle\n🏠 **Home Segregation Guide** - Practical tips\n❓ **FAQ** - Common questions answered\n\nWe also offer **free community workshops** for schools and organizations. Just ask me about a specific topic!`
    },

    profile: {
      keywords: ['profile', 'my account', 'my info', 'update profile', 'edit account', 'avatar', 'profile picture'],
      response: `Your **profile** lets you manage your account details:\n\n👤 Personal Info (name, phone, DOB, bio)\n🏠 Address (region, district, area)\n🔒 Security (change password)\n📸 Profile Photo (upload or choose color)\n📊 Activity History\n\nGo to your [Profile page](profile.html). If you're not logged in yet, you can [Login](login.html) or [Register](register.html) first.`
    },

    register: {
      keywords: ['register', 'sign up', 'create account', 'new account', 'join', 'how to join'],
      response: `Creating an account is **free and takes 1 minute**! ✍️\n\n1️⃣ Go to the [Register page](register.html)\n2️⃣ Enter your name, email, phone\n3️⃣ Choose your district and account type\n4️⃣ Create a strong password\n\nOnce registered, you can book pickups, track reports, leave feedback, and manage your profile.`
    },

    login: {
      keywords: ['login', 'sign in', 'log in', 'how to login', 'forgot password', 'cannot login'],
      response: `**To login:**\n1️⃣ Go to the [Login page](login.html)\n2️⃣ Enter your email or phone\n3️⃣ Enter your password\n\n**Forgot password?** Click "Forgot password" on the login page, or [contact us](contact.html) at +256 800 100 200 for help.`
    },

    // ---------- GREETINGS ----------
    greeting_morning: {
      keywords: ['good morning', 'morning', 'gm'],
      response: `**Good morning!** ☀️ Hope you're having a great start to your day.\n\nHow can I help you today? I can assist with:\n• Booking a waste pickup\n• Learning about recycling\n• Finding your district station\n• Any question about UNWM`
    },

    greeting_afternoon: {
      keywords: ['good afternoon', 'afternoon'],
      response: `**Good afternoon!** 🌤️ Hope your day is going well.\n\nWhat can I help you with today? Whether it's scheduling a pickup, learning about waste management, or just browsing our services - I'm here to help!`
    },

    greeting_evening: {
      keywords: ['good evening', 'evening'],
      response: `**Good evening!** 🌆 Thanks for stopping by.\n\nHow can I assist you tonight? I can help with bookings, recycling tips, district info, or any question about UNWM.`
    },

    greeting_night: {
      keywords: ['good night', 'night', 'gn'],
      response: `**Good night!** 🌙 Sleep well and remember - a cleaner Uganda starts with small daily actions.\n\nFeel free to come back anytime you need help!`
    },

    greeting_hello: {
      keywords: ['hello', 'hi', 'hey', 'hiya', 'yo', 'hola', 'wasup', "what's up", 'greetings'],
      response: `**Hello!** 👋 Welcome to Uganda National Waste Management.\n\nI'm your AI assistant. I can help you with:\n• 🚛 Booking a waste pickup\n• ♻️ Learning about recycling & composting\n• 📍 Finding your district station\n• 💰 Service pricing\n• 📞 Contacting our team\n\nWhat would you like to know?`
    },

    // ---------- SMALL TALK ----------
    howAreYou: {
      keywords: ['how are you', 'how r u', 'how you doing', 'how do you feel', 'whats up with you'],
      response: `I'm running smoothly - thanks for asking! 😊 \n\nMore importantly, how can I help **you** today? I'm here to answer any questions about UNWM and waste management.`
    },

    thanks: {
      keywords: ['thank', 'thanks', 'thx', 'appreciate', 'grateful', 'asante'],
      response: `You're very welcome! 🙏 Glad I could help.\n\nIs there anything else you'd like to know about UNWM? I'm always here to assist.`
    },

    bye: {
      keywords: ['bye', 'goodbye', 'see you', 'farewell', 'cya', 'later'],
      response: `**Goodbye!** 👋 Thanks for chatting with UNWM.\n\nRemember - every proper waste disposal makes Uganda greener. See you soon! 🌿`
    },

    help: {
      keywords: ['help', 'what can you do', 'how can you help', 'capabilities', 'options', 'menu'],
      response: `I'm your **UNWM AI assistant** 🤖 - here's what I can do:\n\n🚛 **Bookings** - Schedule a waste pickup\n📍 **Districts** - Find your nearest station\n♻️ **Education** - Learn about recycling, composting, segregation\n💰 **Pricing** - Explain our service packages\n📞 **Contact** - Share our phone numbers & emails\n💬 **Feedback** - Guide you to leave a review\n👤 **Account** - Help with login, register, or profile\n\nJust ask me anything in plain English!`
    },

    // ---------- FALLBACK ----------
    fallback: {
      response: `Hmm, I'm not sure I understood that. 🤔\n\nTry asking me something like:\n• *"How do I book a pickup?"*\n• *"What services do you offer?"*\n• *"Which districts do you cover?"*\n• *"How do I recycle plastic?"*\n• *"What are your prices?"*\n\nOr type **help** to see everything I can do.`
    }
  };

  // ============================================================
  // FORBIDDEN TOPICS - Never reveal anything about admin/workers
  // ============================================================
  const FORBIDDEN_KEYWORDS = [
    'admin', 'administrator', 'password', 'secret code', '8787', 'josh',
    'worker dashboard', 'worker portal', 'login credentials', 'lojo',
    'admin panel', 'worker login', 'worker password', 'staff login',
    'internal', 'backend', 'database', 'localstorage', 'api key',
    'engineer id', 'worker id', 'staff id'
  ];

  const FORBIDDEN_RESPONSE = `I'm here to help with **public UNWM information** - things like bookings, our services, waste education, districts, and contacting our team. 🌿\n\nFor anything else, please reach out to us directly:\n📞 **+256 800 100 200**\n✉️ **info@unwm.ug**\n\nWhat can I help you with today?`;

  // ============================================================
  // SUGGESTED FOLLOW-UP QUESTIONS
  // ============================================================
  const QUICK_SUGGESTIONS = [
    'How do I book a pickup?',
    'What services do you offer?',
    'What are your prices?',
    'Which districts do you cover?',
    'How do I recycle?',
    'Contact information'
  ];

  // ============================================================
  // SESSION STATE
  // ============================================================
  let chatHistory = [];
  let isOpen = false;
  let hasGreeted = false;

  // ============================================================
  // TIME-AWARE GREETING
  // ============================================================
  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 5) return 'greeting_night';
    if (hour < 12) return 'greeting_morning';
    if (hour < 17) return 'greeting_afternoon';
    if (hour < 21) return 'greeting_evening';
    return 'greeting_night';
  }

  // ============================================================
  // INTENT MATCHING
  // ============================================================
  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findIntent(message) {
    const text = normalize(message);
    if (!text) return null;

    // Check forbidden topics first
    for (const bad of FORBIDDEN_KEYWORDS) {
      if (text.includes(bad)) {
        return { type: 'forbidden' };
      }
    }

    // Score each intent
    let bestIntent = null;
    let bestScore = 0;

    for (const [key, intent] of Object.entries(KNOWLEDGE)) {
      if (!intent.keywords) continue;

      for (const kw of intent.keywords) {
        const k = kw.toLowerCase();
        let score = 0;

        if (text === k) {
          score = 100; // exact match
        } else if (text.includes(k)) {
          score = 50 + k.length; // substring
        } else {
          // word-level partial match
          const words = text.split(' ');
          for (const word of words) {
            if (word.length < 3) continue;
            if (k.includes(word) || word.includes(k)) {
              score += 5;
            }
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestIntent = { key, ...intent };
        }
      }
    }

    if (bestIntent && bestScore >= 5) {
      return { type: 'answer', intent: bestIntent };
    }

    // Try time-based greeting fallback
    if (text.length < 20) {
      const greetingKey = getTimeGreeting();
      if (text.includes('morning') || text.includes('afternoon') ||
          text.includes('evening') || text.includes('night')) {
        return { type: 'answer', intent: { key: greetingKey, ...KNOWLEDGE[greetingKey] } };
      }
    }

    return { type: 'fallback' };
  }

  // ============================================================
  // FORMAT RESPONSE (Markdown-ish)
  // ============================================================
  function formatResponse(text) {
    // Bold
    let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="chat-link" target="_self">$1 →</a>');
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  // ============================================================
  // BUILD UI
  // ============================================================
  function buildChatbotUI() {
    const root = document.createElement('div');
    root.id = 'unwmChatbot';
    root.innerHTML = `
      <button class="chat-launcher" id="chatLauncher" aria-label="Open chat">
        <i class="fas fa-comments"></i>
        <span class="chat-launcher-badge">1</span>
      </button>

      <div class="chat-window" id="chatWindow" role="dialog" aria-label="UNWM Assistant">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div>
              <div class="chat-title">UNWM Assistant</div>
              <div class="chat-status">
                <span class="chat-status-dot"></span>
                Online · AI-powered
              </div>
            </div>
          </div>
          <button class="chat-close" id="chatClose" aria-label="Close chat">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="chat-messages" id="chatMessages"></div>

        <div class="chat-suggestions" id="chatSuggestions"></div>

        <form class="chat-input-form" id="chatForm">
          <input
            type="text"
            class="chat-input"
            id="chatInput"
            placeholder="Ask me anything..."
            autocomplete="off"
            maxlength="500"
          >
          <button type="submit" class="chat-send" id="chatSend" aria-label="Send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(root);
  }

  // ============================================================
  // MESSAGE RENDERING
  // ============================================================
  function appendMessage(role, html) {
    const container = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message chat-message-${role}`;

    if (role === 'bot') {
      wrapper.innerHTML = `
        <div class="chat-message-avatar"><i class="fas fa-robot"></i></div>
        <div class="chat-message-bubble">${html}</div>
      `;
    } else {
      wrapper.innerHTML = `
        <div class="chat-message-bubble">${html}</div>
      `;
    }

    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
    return wrapper;
  }

  function showTyping() {
    const container = document.getElementById('chatMessages');
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-message chat-message-bot';
    wrapper.id = 'chatTypingIndicator';
    wrapper.innerHTML = `
      <div class="chat-message-avatar"><i class="fas fa-robot"></i></div>
      <div class="chat-message-bubble">
        <div class="chat-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();
  }

  // ============================================================
  // RENDER SUGGESTIONS
  // ============================================================
  function renderSuggestions(list) {
    const container = document.getElementById('chatSuggestions');
    container.innerHTML = '';
    list.slice(0, 4).forEach(text => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-suggestion';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        sendMessage(text);
      });
      container.appendChild(btn);
    });
  }

  // ============================================================
  // CONVERSATION LOGIC
  // ============================================================
  function respondTo(message) {
    // Store history
    chatHistory.push({ role: 'user', text: message });

    // Find intent
    const result = findIntent(message);

    let html;

    if (result.type === 'forbidden') {
      html = formatResponse(FORBIDDEN_RESPONSE);
    } else if (result.type === 'answer') {
      html = formatResponse(result.intent.response);
    } else {
      html = formatResponse(KNOWLEDGE.fallback.response);
    }

    // Delay for AI-feel
    const delay = Math.min(1800, 400 + html.length * 3);

    showTyping();

    setTimeout(() => {
      hideTyping();
      appendMessage('bot', html);
      chatHistory.push({ role: 'bot', text: html });

      // Update suggestions contextually
      updateSuggestionsForIntent(result);
    }, delay);
  }

  function updateSuggestionsForIntent(result) {
    if (result.type === 'forbidden') {
      renderSuggestions(['Contact information', 'What services do you offer?', 'How do I book a pickup?']);
      return;
    }

    if (result.type === 'answer' && result.intent) {
      const key = result.intent.key;

      const map = {
        about: ['What services do you offer?', 'Which districts do you cover?', 'Contact information'],
        services: ['What are your prices?', 'How do I book a pickup?', 'Tell me about recycling'],
        pricing: ['How do I book a pickup?', 'Contact information', 'What services do you offer?'],
        booking: ['What are your prices?', 'Which districts do you cover?', 'Contact information'],
        districts: ['How do I book a pickup?', 'Contact information', 'What services do you offer?'],
        contact: ['How do I book a pickup?', 'What are your prices?', 'What services do you offer?'],
        feedback: ['Contact information', 'What services do you offer?', 'How do I book a pickup?'],
        wasteTypes: ['How do I segregate waste?', 'Tell me about recycling', 'What is hazardous waste?'],
        segregation: ['Tell me about recycling', 'How do I compost?', 'What are the 3 Rs?'],
        recycling: ['How do I compost?', 'What are the 3 Rs?', 'What is hazardous waste?'],
        composting: ['Tell me about recycling', 'What are the 3 Rs?', 'Environmental impact'],
        hazardous: ['Contact information', 'What services do you offer?', 'Tell me about recycling'],
        environment: ['What are the 3 Rs?', 'Tell me about recycling', 'How do I compost?'],
        threeRs: ['Tell me about recycling', 'How do I compost?', 'How do I segregate waste?'],
        learn: ['Tell me about recycling', 'How do I compost?', 'What are the 3 Rs?'],
        profile: ['How do I book a pickup?', 'What services do you offer?', 'Contact information'],
        register: ['How do I book a pickup?', 'What services do you offer?', 'What are your prices?'],
        login: ['Contact information', 'How do I register?', 'What services do you offer?'],
        help: QUICK_SUGGESTIONS,
        greeting_hello: QUICK_SUGGESTIONS,
        greeting_morning: QUICK_SUGGESTIONS,
        greeting_afternoon: QUICK_SUGGESTIONS,
        greeting_evening: QUICK_SUGGESTIONS,
        greeting_night: QUICK_SUGGESTIONS,
        howAreYou: QUICK_SUGGESTIONS,
        thanks: QUICK_SUGGESTIONS,
        bye: QUICK_SUGGESTIONS
      };

      renderSuggestions(map[key] || QUICK_SUGGESTIONS);
    } else {
      renderSuggestions(QUICK_SUGGESTIONS);
    }
  }

  // ============================================================
  // SEND MESSAGE
  // ============================================================
  function sendMessage(text) {
    if (!text || !text.trim()) return;

    const input = document.getElementById('chatInput');
    input.value = '';

    appendMessage('user', escapeHtml(text));
    respondTo(text);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================================
  // OPEN / CLOSE
  // ============================================================
  function openChat() {
    isOpen = true;
    document.getElementById('chatWindow').classList.add('open');
    document.getElementById('chatLauncher').classList.add('hidden');
    document.querySelector('.chat-launcher-badge').style.display = 'none';

    // Greet once
    if (!hasGreeted) {
      hasGreeted = true;
      const greetingKey = getTimeGreeting();
      const greeting = KNOWLEDGE[greetingKey].response;

      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
          appendMessage('bot', formatResponse(greeting));
          renderSuggestions(QUICK_SUGGESTIONS);
        }, 800);
      }, 400);
    }

    setTimeout(() => document.getElementById('chatInput').focus(), 200);
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('chatWindow').classList.remove('open');
    document.getElementById('chatLauncher').classList.remove('hidden');
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    buildChatbotUI();

    document.getElementById('chatLauncher').addEventListener('click', openChat);
    document.getElementById('chatClose').addEventListener('click', closeChat);

    document.getElementById('chatForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const value = document.getElementById('chatInput').value.trim();
      sendMessage(value);
    });

    // ESC to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();