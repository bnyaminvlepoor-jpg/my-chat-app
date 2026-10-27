 const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const resizeChat = document.getElementById('resizeChat');
        const closeChat = document.getElementById('closeChat');
        const chatForm = document.getElementById('chatForm');
        const userInput = document.getElementById('userInput');
        const chatMessages = document.getElementById('chatMessages');
        const typingIndicator = document.getElementById('typingIndicator');
        const startCollaboration = document.getElementById('startCollaboration');
        const collabModal = document.getElementById('collabModal');
        const closeCollab = document.getElementById('closeCollab');
        const collabForm = document.getElementById('collabForm');
        const telegramUsername = document.getElementById('telegramUsername');
        const collabStatus = document.getElementById('collabStatus');

        startCollaboration.addEventListener('click', () => {
            collabStatus.classList.add('hidden');
            collabModal.showModal();
            telegramUsername.focus();
        });

        closeCollab.addEventListener('click', () => collabModal.close());

        collabModal.addEventListener('click', (event) => {
            if (event.target === collabModal) collabModal.close();
        });

        collabForm.addEventListener('submit', (event) => {
            event.preventDefault();
            collabStatus.textContent = 'آیدی تلگرام واردشده آماده است، اما برای ارسال واقعی درخواست باید مقصد تلگرام یا سرویس ثبت اطلاعات تنظیم شود.';
            collabStatus.classList.remove('hidden');
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
                messageBubble.className = "bg-slate-900 border border-slate-800 text-slate-100 p-3 rounded-2xl rounded-tr-none leading-relaxed";
                messageBubble.textContent = text;
                wrapper.append(avatar, messageBubble);
            }
            
            chatMessages.appendChild(wrapper);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }








        