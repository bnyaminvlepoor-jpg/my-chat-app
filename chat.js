const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const resizeChat = document.getElementById('resizeChat');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const voiceInput = document.getElementById('voiceInput');
const voiceStatus = document.getElementById('voiceStatus');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const startCollaboration = document.getElementById('startCollaboration');
const collabModal = document.getElementById('collabModal');
const closeCollab = document.getElementById('closeCollab');
const collabForm = document.getElementById('collabForm');
const collabName = document.getElementById('collabName');
const collabResult = document.getElementById('collabResult');
const collabSummary = document.getElementById('collabSummary');
const collabStatus = document.getElementById('collabStatus');
const copyCollabSummary = document.getElementById('copyCollabSummary');
const shareTelegram = document.getElementById('shareTelegram');
const shareLinkedIn = document.getElementById('shareLinkedIn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'fa-IR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.addEventListener('result', (event) => {
        const transcript = Array.from(event.results)
            .slice(event.resultIndex)
            .map((result) => result[0].transcript)
            .join(' ')
            .trim();

        if (transcript) {
            userInput.value = [userInput.value.trim(), transcript].filter(Boolean).join(' ');
            voiceStatus.textContent = 'متن گفتار به کادر پیام اضافه شد.';
            voiceStatus.classList.remove('hidden');
            userInput.focus();
        }
    });

    recognition.addEventListener('error', (event) => {
        const messages = {
            'not-allowed': 'برای استفاده از میکروفون، اجازهٔ دسترسی را در مرورگر فعال کنید.',
            'no-speech': 'گفتاری شنیده نشد. دوباره تلاش کنید.',
            'audio-capture': 'میکروفونی برای ضبط صدا پیدا نشد.'
        };
        voiceStatus.textContent = messages[event.error] || 'تشخیص گفتار با خطا روبه‌رو شد. دوباره تلاش کنید.';
        voiceStatus.classList.remove('hidden');
    });

    recognition.addEventListener('end', () => {
        setVoiceListening(false);
    });
}

voiceInput.addEventListener('click', () => {
    if (!recognition) {
        voiceStatus.textContent = 'مرورگر شما از ورود پیام با گفتار پشتیبانی نمی‌کند.';
        voiceStatus.classList.remove('hidden');
        return;
    }

    if (isListening) {
        recognition.stop();
        return;
    }

    try {
        recognition.start();
        setVoiceListening(true);
        voiceStatus.textContent = 'در حال گوش‌دادن...';
        voiceStatus.classList.remove('hidden');
    } catch (error) {
        voiceStatus.textContent = 'شروع ضبط صدا ممکن نشد. دوباره تلاش کنید.';
        voiceStatus.classList.remove('hidden');
        console.error('Speech recognition could not be started:', error);
    }
});

function setVoiceListening(listening) {
    isListening = listening;
    voiceInput.setAttribute('aria-pressed', String(listening));
    voiceInput.setAttribute('aria-label', listening ? 'توقف ورود پیام صوتی' : 'شروع ورود پیام صوتی');
    voiceInput.title = listening ? 'توقف تشخیص گفتار' : 'ورود پیام با گفتار';
    voiceInput.classList.toggle('bg-red-600', listening);
    voiceInput.classList.toggle('hover:bg-red-500', listening);
    voiceInput.classList.toggle('bg-slate-800', !listening);
    voiceInput.classList.toggle('hover:bg-slate-700', !listening);
    voiceInput.querySelector('i').className = `fa-solid ${listening ? 'fa-stop' : 'fa-microphone'} text-xs`;
}

startCollaboration.addEventListener('click', () => {
    collabStatus.classList.add('hidden');
    collabModal.showModal();
    collabName.focus();
});

closeCollab.addEventListener('click', () => collabModal.close());

collabModal.addEventListener('click', (event) => {
    if (event.target === collabModal) collabModal.close();
});

collabForm.addEventListener('input', () => {
    collabResult.classList.add('hidden');
    collabStatus.classList.add('hidden');
});

collabForm.addEventListener('change', () => {
    collabResult.classList.add('hidden');
    collabStatus.classList.add('hidden');
});

collabForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(collabForm);
    const summary = [
        'درخواست شروع همکاری',
        `نام: ${formData.get('name').trim()}`,
        `راه ارتباطی: ${formData.get('contact').trim()}`,
        `نوع پروژه: ${formData.get('projectType')}`,
        `بودجهٔ حدودی: ${formData.get('budget')}`,
        `زمان‌بندی: ${formData.get('timeline')}`,
        `توضیحات: ${formData.get('details').trim()}`
    ].join('\n');

    collabSummary.textContent = summary;
    shareTelegram.href = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(summary)}`;
    shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    collabResult.classList.remove('hidden');
    collabStatus.classList.add('hidden');
    collabResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

copyCollabSummary.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(collabSummary.textContent);
        collabStatus.textContent = 'بریف کپی شد؛ حالا می‌توانی آن را هرجا خواستی بفرستی.';
        collabStatus.classList.remove('hidden');
    } catch (error) {
        collabStatus.textContent = 'کپی خودکار انجام نشد. متن بریف را انتخاب و دستی کپی کن.';
        collabStatus.classList.remove('hidden');
        console.error('Could not copy the collaboration brief:', error);
    }
});

// باز و بسته کردن پنجره چت
chatToggle.addEventListener('click', () => {
    const isOpening = chatWindow.classList.contains('opacity-0');
    chatWindow.classList.toggle('opacity-0', !isOpening);
    chatWindow.classList.toggle('pointer-events-none', !isOpening);
    chatWindow.classList.toggle('scale-95', !isOpening);
    chatWindow.setAttribute('aria-hidden', isOpening ? 'false' : 'true');
    chatToggle.setAttribute('aria-expanded', String(isOpening));

    if (isOpening) {
        userInput.focus();
    } else {
        chatToggle.focus();
    }
});

closeChat.addEventListener('click', () => {
    setChatExpanded(false);
    chatWindow.classList.add('opacity-0');
    chatWindow.classList.add('pointer-events-none');
    chatWindow.classList.add('scale-95');
    chatWindow.setAttribute('aria-hidden', 'true');
    chatToggle.setAttribute('aria-expanded', 'false');
    chatToggle.focus();
});

resizeChat.addEventListener('click', () => {
    setChatExpanded(!chatWindow.classList.contains('chat-window-expanded'));
});

chatMessages.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const promptButton = event.target.closest('[data-chat-prompt]');
    if (!promptButton) return;

    userInput.value = promptButton.dataset.chatPrompt;
    chatForm.requestSubmit();
});

// ارسال پیام جدید
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // ۱. اضافه کردن پیام کاربر به صفحه
    appendMessage(message, 'user');
    userInput.value = '';

    // ۲. فعال کردن انیمیشن تایپ کردن دستیار
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // ۳. ارتباط واقعی با کارخانه هوش مصنوعی n8n شما
        // (در مسیر تمرینی n8n از webhook-test و در نسخه نهایی از webhook استفاده کنید)
        const response = await fetch("https://brv1234.app.n8n.cloud/webhook/966c118e-2424-48f8-8bf1-cedca5c2c85a", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_request: message,
                name_user: "مشتری وب‌سایت"
            })
        });

        const data = await response.json();

        // غیرفعال کردن انیمیشن تایپ
        typingIndicator.classList.add('hidden');

        // ۴. اضافه کردن جواب دریافتی به صفحه چت
        if (data.output) {
            appendMessage(data.output, 'ai');
        } else {
            appendMessage("متاسفانه نتونستم پاسخ رو دریافت کنم. دوباره تلاش کنید.", 'ai');
        }

    } catch (error) {
        typingIndicator.classList.add('hidden');
        // برای تست لوکال، در صورت نبود اینترنت یا خطا، یک شبیه‌سازی انجام می‌دهد:
        setTimeout(() => {
            appendMessage("سلام! اتصال من به کارخانه n8n قطع شده، اما طرحِ زیبای چت رو درست اجرا کردی. 😍 حالا باید n8n رو روشن کنی تا پاسخ‌های هوش مصنوعی رو زنده ببینی!", 'ai');
        }, 1000);
    }
});

// تابع ساختن حباب‌های چت در صفحه
function setChatExpanded(isExpanded) {
    chatWindow.classList.toggle('chat-window-expanded', isExpanded);
    resizeChat.setAttribute('aria-pressed', String(isExpanded));
    resizeChat.setAttribute('aria-label', isExpanded ? 'بازگشت به اندازه قبلی' : 'تمام‌صفحه کردن گفت‌وگو');
    resizeChat.title = isExpanded ? 'بازگشت به اندازه قبلی' : 'تمام‌صفحه کردن';
    resizeChat.querySelector('i').className = `fa-solid ${isExpanded ? 'fa-compress' : 'fa-expand'} text-sm`;
}

function appendMessage(text, sender) {
    const wrapper = document.createElement('div');

    if (sender === 'user') {
        wrapper.className = "flex gap-2 items-start justify-end max-w-[85%] self-end mr-auto";
        const messageBubble = document.createElement('div');
        messageBubble.className = "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white p-3 rounded-2xl rounded-tl-none leading-relaxed";
        messageBubble.textContent = text;
        wrapper.appendChild(messageBubble);
    } else {
        wrapper.className = "flex gap-2 items-start justify-start max-w-[85%]";
        const avatar = document.createElement('div');
        avatar.className = "w-7 h-7 bg-purple-600/20 rounded-lg border border-purple-500/20 flex items-center justify-center shrink-0";
        const icon = document.createElement('i');
        icon.className = "fa-solid fa-robot text-xs text-purple-400";
        avatar.appendChild(icon);

        const messageBubble = document.createElement('div');

        messageBubble.className = "bg-slate-900 border border-slate-800 text-slate-100 p-3 rounded-2xl rounded-tr-none leading-relaxed [&_ul]:list-disc [&_ul]:mr-6 [&_ol]:list-decimal [&_ol]:mr-6 [&_li]:mb-2";



        messageBubble.innerHTML = marked.parse(text);
        wrapper.append(avatar, messageBubble);
    }

    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
