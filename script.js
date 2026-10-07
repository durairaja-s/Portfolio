// ==========================================================================
// DURAIRAJA S — CINEMATIC DARK LUXURY PORTFOLIO ENGINE
// Includes:
// 1. Dynamic Dark Accent Theme Switcher (Dark Obsidian, Cyber Dark, Emerald, Sunset)
// 2. Deep Black Wallpaper Canvas (Constellations, Stardust Sparkles, Mouse Aura)
// 3. Kinetic Animated Typing Subtitle
// 4. 3D Holographic Profile Photo Tilt & Real-time Glare & Clean Photo Switcher
// 5. Custom Cyber Cursor with Smooth Interpolation
// 6. Dynamic Mouse-following Border Glow for Cards
// 7. Scroll Progress Indicator & EmailJS Form Handler
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Dark / Light Mode Switcher ---
    const themes = [
        { id: "default", name: "Dark",  swatch: "linear-gradient(135deg, #e2a45a, #8ee0c4)" },
        { id: "light",   name: "Light", swatch: "linear-gradient(135deg, #333333, #888888)" }
    ];

    let currentThemeIndex = 0;
    let savedTheme = localStorage.getItem("ds_portfolio_theme");
    // Migrate any legacy accent theme to dark default
    const legacyThemes = ["cyber", "emerald", "sunset", "prism"];
    if (savedTheme && legacyThemes.includes(savedTheme)) {
        savedTheme = "default";
        localStorage.setItem("ds_portfolio_theme", "default");
    }
    if (savedTheme) {
        const found = themes.findIndex((t) => t.id === savedTheme);
        if (found !== -1) currentThemeIndex = found;
    }

    const themeBtn = document.getElementById("theme-btn");
    const themeLabel = document.getElementById("theme-label");
    const themeSwatch = document.getElementById("theme-swatch");

    const applyTheme = (themeObj) => {
        if (themeObj.id === "default") {
            document.body.removeAttribute("data-theme");
        } else {
            document.body.setAttribute("data-theme", themeObj.id);
        }
        if (themeLabel) themeLabel.textContent = themeObj.name;
        if (themeSwatch) themeSwatch.style.background = themeObj.swatch;
        localStorage.setItem("ds_portfolio_theme", themeObj.id);
    };

    applyTheme(themes[currentThemeIndex]);

    themeBtn?.addEventListener("click", () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        applyTheme(themes[currentThemeIndex]);
    });

    // --- 2. Scroll Progress Indicator ---
    const scrollProgress = document.getElementById("scroll-progress");
    window.addEventListener("scroll", () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / (docHeight || 1)) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
        }
    }, { passive: true });

    // --- 3. Custom Cyber Cursor ---
    const cursorDot = document.getElementById("cursor-dot");
    const cursorRing = document.getElementById("cursor-ring");
    const isFinePointer = window.matchMedia("(pointer:fine)").matches;

    if (isFinePointer && cursorDot && cursorRing) {
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const updateCursor = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(updateCursor);
        };
        requestAnimationFrame(updateCursor);

        // Hover effect on interactive elements
        const interactiveElements = "a, button, input, textarea, .panel, .skill-card, .project, .cert, .float-chip, .photo-badge";
        document.querySelectorAll(interactiveElements).forEach((el) => {
            el.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
            el.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
        });

        document.addEventListener("mouseleave", () => {
            cursorDot.style.opacity = "0";
            cursorRing.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursorDot.style.opacity = "1";
            cursorRing.style.opacity = "0.7";
        });
    }

    // --- 4. Kinetic Animated Typing Subtitle in Hero ---
    const typingEl = document.getElementById("typing-text");
    if (typingEl) {
        const phrases = [
            "feel alive.",
            "scale seamlessly.",
            "look cinematic.",
            "captivate users.",
            "blend design & code."
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const typeLoop = () => {
            const currentPhrase = phrases[phraseIdx];
            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 45;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 95;
            }

            if (!isDeleting && charIdx === currentPhrase.length) {
                typingSpeed = 2200; // Pause at full word
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 450; // Pause before new word
            }

            setTimeout(typeLoop, typingSpeed);
        };
        setTimeout(typeLoop, 800);
    }

    // --- 5. 3D Holographic Profile Photo Tilt & Real-time Glare & Clean Photo Switcher ---
    const stage = document.querySelector("[data-tilt-stage]");
    const photoBadge = document.querySelector("[data-photo-tilt]");
    const portraitImg = document.getElementById("hero-portrait-img");
    const photoSwitchBtn = document.getElementById("photo-switch-btn");

    // Dynamic Specular Glare & Parallax Tilt
    if (stage && photoBadge && isFinePointer) {
        stage.addEventListener("pointermove", (event) => {
            const rect = stage.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            photoBadge.style.animation = "none";
            photoBadge.style.transform = `rotateX(${(-y * 18).toFixed(2)}deg) rotateY(${(x * 24).toFixed(2)}deg) translateZ(22px)`;

            // Update Glare Position
            const glareX = ((x + 0.5) * 100).toFixed(1);
            const glareY = ((y + 0.5) * 100).toFixed(1);
            photoBadge.style.setProperty("--glare-x", `${glareX}%`);
            photoBadge.style.setProperty("--glare-y", `${glareY}%`);
        });

        stage.addEventListener("pointerleave", () => {
            photoBadge.style.transform = "";
            photoBadge.style.animation = "";
            photoBadge.style.removeProperty("--glare-x");
            photoBadge.style.removeProperty("--glare-y");
        });
    }

    // Portrait Photo Switcher - Smooth Natural Crossfade with Zero Color Distortion
    if (portraitImg && photoSwitchBtn) {
        const portraits = ["photo-hero.jpg", "photoD.jpg"];
        let currentPhotoIdx = 0;

        photoSwitchBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentPhotoIdx = (currentPhotoIdx + 1) % portraits.length;
            
            // Clean opacity transition
            portraitImg.style.transition = "opacity 0.22s ease";
            portraitImg.style.opacity = "0.2";

            setTimeout(() => {
                portraitImg.src = portraits[currentPhotoIdx];
                portraitImg.style.opacity = "1";
            }, 180);
        });
    }

    // --- 6. Mouse-tracking Gradient Border Glow for Cards ---
    document.querySelectorAll(".panel, .skill-card, .project, .cert, .job").forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 3D Tilt for all Cards with data-tilt
    if (isFinePointer) {
        document.querySelectorAll("[data-tilt]").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rx = (0.5 - y) * 10;
                const ry = (x - 0.5) * 14;
                card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(10px)`;
            });
            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    // --- 7. Deep Black Animated Wallpaper Canvas ---
    const canvas = document.getElementById("wall-canvas");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canvas && !reduceMotion) {
        const ctx = canvas.getContext("2d");
        let nodes = [];
        let sparkles = [];
        let mouseNode = { x: -1000, y: -1000, r: 160 };

        const palette = [
            "rgba(240, 194, 123, ", // Warm Champagne Gold
            "rgba(142, 224, 196, ", // Mint
            "rgba(255, 255, 255, ", // Crystal Starlight White
            "rgba(0, 245, 212, ",   // Electric Cyan
            "rgba(226, 164, 90, "   // Soft Amber
        ];

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            initNodes();
            initSparkles();
        };

        const initNodes = () => {
            nodes = [];
            const count = window.innerWidth < 768 ? 40 : 75;
            for (let i = 0; i < count; i++) {
                nodes.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    r: Math.random() * 1.5 + 0.6,
                    colorBase: palette[i % palette.length],
                    alpha: Math.random() * 0.35 + 0.35
                });
            }
        };

        const initSparkles = () => {
            sparkles = [];
            for (let i = 0; i < 30; i++) {
                sparkles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    r: Math.random() * 1.2 + 0.4,
                    colorBase: palette[Math.floor(Math.random() * palette.length)],
                    phase: Math.random() * Math.PI * 2,
                    speed: Math.random() * 0.025 + 0.015
                });
            }
        };

        window.addEventListener("resize", resize);
        resize();

        window.addEventListener("mousemove", (e) => {
            mouseNode.x = e.clientX;
            mouseNode.y = e.clientY;
        }, { passive: true });

        window.addEventListener("mouseleave", () => {
            mouseNode.x = -1000;
            mouseNode.y = -1000;
        });

        const tick = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // Subtle Mouse Starlight Glow
            if (mouseNode.x > 0 && mouseNode.y > 0) {
                const mouseGrad = ctx.createRadialGradient(mouseNode.x, mouseNode.y, 0, mouseNode.x, mouseNode.y, mouseNode.r);
                mouseGrad.addColorStop(0, "rgba(226, 164, 90, 0.09)");
                mouseGrad.addColorStop(0.6, "rgba(142, 224, 196, 0.04)");
                mouseGrad.addColorStop(1, "transparent");
                ctx.fillStyle = mouseGrad;
                ctx.beginPath();
                ctx.arc(mouseNode.x, mouseNode.y, mouseNode.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Twinkling Stardust Sparkles
            for (let s of sparkles) {
                s.phase += s.speed;
                const twinkleAlpha = (Math.sin(s.phase) + 1) * 0.3 + 0.15;
                ctx.fillStyle = `${s.colorBase}${twinkleAlpha})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Constellation Nodes & Connective Laser Lines
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
                if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

                // Mouse interaction - gentle drift & fine line
                const mdx = node.x - mouseNode.x;
                const mdy = node.y - mouseNode.y;
                const mDist = Math.hypot(mdx, mdy);
                if (mDist < mouseNode.r) {
                    const force = (1 - mDist / mouseNode.r) * 0.07;
                    node.x += mdx * force;
                    node.y += mdy * force;

                    ctx.strokeStyle = `rgba(226, 164, 90, ${(1 - mDist / mouseNode.r) * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(mouseNode.x, mouseNode.y);
                    ctx.stroke();
                }

                // Draw Star Node
                ctx.beginPath();
                ctx.fillStyle = `${node.colorBase}${node.alpha})`;
                ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
                ctx.fill();

                // Inter-node connections
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 120) {
                        const lineAlpha = (1 - dist / 120) * 0.18;
                        ctx.strokeStyle = `rgba(240, 194, 123, ${lineAlpha})`;
                        ctx.lineWidth = 0.9;
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(tick);
        };
        tick();
    }

    // --- 8. Navigation & Mobile Menu ---
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    menuBtn?.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        menuBtn.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    links.forEach((link) => {
        link.addEventListener("click", () => {
            navLinks?.classList.remove("open");
            menuBtn?.classList.remove("open");
            menuBtn?.setAttribute("aria-expanded", "false");
        });
    });

    // Active Section Intersection Observer
    const sections = [...document.querySelectorAll("section[id]")];
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = `#${entry.target.id}`;
                links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === id));
            });
        },
        { threshold: 0.35 }
    );
    sections.forEach((section) => observer.observe(section));

    // Smooth Scroll targets
    document.querySelectorAll("[data-target]").forEach((card) => {
        card.addEventListener("click", () => {
            document.querySelector(card.dataset.target)?.scrollIntoView({ behavior: "smooth" });
        });
    });

    // --- 9. Contact Form with EmailJS ---
    const statusEl = document.querySelector(".form-status");
    let emailServiceReady = false;
    if (typeof emailjs !== "undefined" && typeof emailjs.init === "function") {
        try {
            emailjs.init("hPjAhNpBgSmhLmC6w");
            emailServiceReady = typeof emailjs.send === "function";
        } catch (error) {
            console.error("EmailJS initialization failed.", error);
        }
    }

    document.getElementById("contact-form")?.addEventListener("submit", async function (event) {
        event.preventDefault();
        const button = this.querySelector('button[type="submit"]');
        const formData = new FormData(this);
        const name = String(formData.get("from_name") || "").trim();
        const email = String(formData.get("from_email") || "").trim();
        const note = String(formData.get("user_message") || "").trim();
        const details =
            `New portfolio enquiry\n` +
            `----------------------\n` +
            `Visitor name: ${name}\n` +
            `Visitor email: ${email}\n` +
            `Reply to: ${email}\n\n` +
            `Message:\n${note}`;

        if (!emailServiceReady || !button) {
            if (statusEl) statusEl.textContent = "Email service is unavailable. Please email me directly at durairajass45@gmail.com.";
            return;
        }

        button.disabled = true;
        if (statusEl) statusEl.textContent = "Sending your message…";

        try {
            await emailjs.send("service_91cjzfp", "template_zmyp1pj", {
                from_name: name,
                from_email: email,
                name,
                email,
                reply_to: email,
                user_name: name,
                user_email: email,
                visitor_name: name,
                visitor_email: email,
                to_name: "Durairaja S",
                to_email: "durairajass45@gmail.com",
                subject: `Portfolio message from ${name} (${email})`,
                title: `Portfolio message from ${name}`,
                message: details,
                user_message: note
            });
            if (statusEl) statusEl.textContent = "✓ Sent successfully! I'll reply to your email soon.";
            this.reset();
        } catch (error) {
            console.error("EmailJS could not send the contact message.", error);
            if (statusEl) statusEl.textContent = "Could not send automatically. Please email me at durairajass45@gmail.com.";
        } finally {
            button.disabled = false;
        }
    });
});
