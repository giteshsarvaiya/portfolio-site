// Terminal emulator – IIFE, no dependencies
(function () {
  var overlay = document.getElementById("terminalOverlay");
  var toggleBtn = document.getElementById("terminalToggle");
  var closeBtn = document.getElementById("terminalClose");
  var output = document.getElementById("terminalOutput");
  var input = document.getElementById("terminalInput");
  if (!overlay || !toggleBtn || !input || !output) return;

  var history = [];
  var historyIndex = -1;
  var firstOpen = true;

  // ── Helpers ──
  function esc(str) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  function print(html) {
    output.innerHTML += html + "\n";
    output.scrollTop = output.scrollHeight;
  }

  function prompt() {
    return '<span style="color:var(--text-color-alt)">visitor@gitesh</span>:<span style="color:var(--text-color)">~</span>$ ';
  }

  // ── Commands ──
  var commands = {
    help: function () {
      return [
        "Available commands:",
        "",
        "  help        — show this message",
        "  about       — who is gitesh?",
        "  skills      — technical skills",
        "  projects    — featured projects",
        "  experience  — work history",
        "  now         — what i'm doing now",
        "  contact     — reach out",
        "  blog        — read my writing",
        "  neofetch    — system info",
        "  theme       — toggle light/dark",
        "  clear       — clear terminal",
        "",
        'Type a command and press Enter. Try "neofetch"!',
      ].join("\n");
    },

    about: function () {
      return [
        "┌─────────────────────────────────────┐",
        "│  Gitesh Sarvaiya                    │",
        "│  Fullstack Engineer                 │",
        "│  Design Engineer · System Thinker   │",
        "├─────────────────────────────────────┤",
        "│                                     │",
        "│  I build products end-to-end.       │",
        "│  From the schema under the hood     │",
        "│  to the pixel on the screen.        │",
        "│                                     │",
        "│  CS Major · Tech agnostic           │",
        "│  JS/TS ecosystem mostly             │",
        "│  Codes in Claude Code (Zed+Cursor)  │",
        "│                                     │",
        "└─────────────────────────────────────┘",
      ].join("\n");
    },

    skills: function () {
      return [
        "Languages:   JS, TS, Java, Python, Ruby, HTML/CSS, SQL",
        "Frontend:    React, Next.js, Tailwind, Radix, ShadCN, Tiptap",
        "Backend:     Node.js, Express, Rails, Hono, WebSockets",
        "Databases:   PostgreSQL, MongoDB, Prisma, Supabase, CF KV",
        "Infra:       Cloudflare, AWS, Docker, CI/CD, Git",
        "Paradigms:   Local-first (YJS/CRDT), Real-time collab",
      ].join("\n");
    },

    projects: function () {
      return [
        "Featured Projects:",
        "",
        "  Texty         — local-first collaborative text editor (CRDT/YJS)",
        "  AgentFlow     — AI workflow generator across connected apps",
        "  Codegingerai  — AI-powered GitHub PR reviewer",
        "  Pramanit      — verification & trust on blockchain",
        "  Bromine       — minimalist project management tool",
        "",
        "Scroll down on the page to see details, or type 'about'.",
      ].join("\n");
    },

    experience: function () {
      return [
        "Work Experience:",
        "",
        "  Innovun Global    Tech Lead (Contract)     May 2025 – Present",
        "  DIY               Design Engineer          Jun – Aug 2025",
        "  Dreamstudio       Frontend Developer       Jun – Aug 2025",
        "  Planva (YC China) Frontend Developer       2025",
        "  Maura AI          Frontend Developer       Sep 2024 – Jun 2025",
        "  Stealth           Frontend + Backend       Apr – Sep 2024",
        "",
        "Scroll down on the page for full details.",
      ].join("\n");
    },

    now: function () {
      return [
        "What I'm doing now (Feb 2026):",
        "",
        "  · Building Texty — local-first collaborative editor",
        "  · Leading CRM + WhatsApp campaign platform at Innovun",
        "  · Writing about system design on Medium",
        "  · Reading: Refactoring UI, System Design Interview Vol. 1",
      ].join("\n");
    },

    contact: function () {
      return [
        "Get in touch:",
        "",
        "  X/Twitter   — x.com/SarvaiyaGitesh",
        "  GitHub      — github.com/giteshsarvaiya",
        "  LinkedIn    — linkedin.com/in/gitesh-sarvaiya-160b921b3",
        "  Email       — gitesh.sarvaiya28@gmail.com",
      ].join("\n");
    },

    blog: function () {
      window.open("/blogs", "_blank");
      return "Opening blog in a new tab...";
    },

    neofetch: function () {
      var theme = document.documentElement.getAttribute("data-theme") || "light";
      return [
        "  ┌───────┐",
        "  │ G  S  │  visitor@gitesh",
        "  │ > _ < │  ──────────────────",
        "  └───────┘  Role:    Fullstack Engineer",
        "             Stack:   JS/TS · React · Node",
        "  gitesh     Editor:  Claude Code (Zed+Cursor)",
        "  sarvaiya   Shell:   portfolio-terminal v1.0",
        "             Theme:   " + theme,
        "             Reading: Refactoring UI, SDI Vol.1",
      ].join("\n");
    },

    theme: function () {
      var btn = document.getElementById("themeToggle");
      if (btn) btn.click();
      var t = document.documentElement.getAttribute("data-theme") || "light";
      return "Theme switched to " + t;
    },

    clear: function () {
      output.innerHTML = "";
      return null;
    },
  };

  // Easter eggs
  var easterEggs = {
    "sudo rm -rf /": "Nice try. Permission denied. This portfolio is immutable.",
    "sudo": "You don't have sudo privileges here. Try 'help' instead.",
    "exit": "There is no escape. You're trapped in my portfolio forever.\n\n...just kidding. Close with Esc or the X button.",
    "ls": "index.html  index.css  index.js  matrix.js  terminal.js  README.md",
    "pwd": "/home/visitor/gitesh-portfolio",
    "whoami": "visitor (but welcome to be a friend)",
    "cat": "Usage: cat <filename>\n\n...or just scroll the page. It's all there.",
    "vim": "Error: vim not found. This is a portfolio, not a text editor.\n(ironic, since I built one — try 'projects')",
    "cd": "You can't cd out of this portfolio. Try scrolling instead.",
    "rm": "Permission denied. You can't delete my portfolio.",
    "git push": "remote: Permission denied. Fork it first maybe?",
    "hello": "Hey there! Type 'help' to see what I can do.",
    "hi": "Hello! Type 'help' to explore.",
  };

  // ── Execution ──
  function exec(cmd) {
    var trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    print(prompt() + esc(cmd));

    if (easterEggs[trimmed]) {
      print(esc(easterEggs[trimmed]));
    } else if (commands[trimmed]) {
      var result = commands[trimmed]();
      if (result !== null) print(esc(result));
    } else {
      print(esc("command not found: " + trimmed + '. Type "help" for available commands.'));
    }
  }

  // ── Auto-type ──
  function autoType(text, cb) {
    var i = 0;
    input.disabled = true;
    function tick() {
      if (i < text.length) {
        input.value += text[i++];
        setTimeout(tick, 60 + Math.random() * 40);
      } else {
        input.disabled = false;
        if (cb) cb();
      }
    }
    tick();
  }

  // ── Viewport resize (mobile keyboard) ──
  var scrollY = 0;
  var termWindow = document.querySelector(".terminal-window");

  function adjustForKeyboard() {
    if (!termWindow || !overlay.classList.contains("active")) return;
    var vv = window.visualViewport;
    if (vv) {
      termWindow.style.maxHeight = vv.height - 20 + "px";
    }
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", adjustForKeyboard);
  }

  // ── Open / Close ──
  function openTerminal() {
    scrollY = window.scrollY;
    document.body.classList.add("terminal-open");
    document.body.style.top = -scrollY + "px";
    overlay.classList.add("active");
    adjustForKeyboard();
    input.focus();
    if (firstOpen) {
      firstOpen = false;
      print("Welcome to Gitesh's terminal. Type 'help' to get started.\n");
      autoType("help", function () {
        exec("help");
        input.value = "";
      });
    }
  }

  function closeTerminal() {
    overlay.classList.remove("active");
    document.body.classList.remove("terminal-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
    if (termWindow) termWindow.style.maxHeight = "";
  }

  toggleBtn.addEventListener("click", function () {
    if (overlay.classList.contains("active")) {
      closeTerminal();
    } else {
      openTerminal();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeTerminal);
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeTerminal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeTerminal();
    }
  });

  // ── Input handling ──
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var cmd = input.value;
      if (cmd.trim()) {
        history.push(cmd);
        historyIndex = history.length;
      }
      exec(cmd);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = "";
      }
    }
  });

  // Focus input when clicking inside terminal
  if (termWindow) {
    termWindow.addEventListener("click", function () {
      input.focus();
    });
  }
})();
