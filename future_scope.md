# Future Scope

## WhatsApp CMS

### Concept
Control and update portfolio content by sending WhatsApp messages with structured commands.

### Architecture (Recommended: Cloudflare Workers + KV)

```
You (WhatsApp) --> Twilio/Meta API --> Webhook (CF Worker) --> Cloudflare KV --> Portfolio
```

1. Set up a **Twilio WhatsApp Sandbox** or **Meta WhatsApp Business API**
2. Create a **Cloudflare Worker** as webhook receiver
3. Parse WhatsApp messages with structured commands
4. Store content in **Cloudflare KV** or **D1 (SQLite)**
5. Portfolio fetches from KV at load time via JS fetch

### Command Reference

| Command | Action |
|---|---|
| `#now <text>` | Update "Now" section |
| `#status <text>` | Update header status |
| `#blog <title> \| <url>` | Add blog post |
| `#project <name> \| <desc> \| <url>` | Add project |
| `#reading <book>` | Update bookshelf |
| `#remove <section> <id>` | Remove an entry |
| `#photo` + image | Update profile/project images |

### Alternative Approaches

- **Option B:** WhatsApp -> n8n/Make.com -> GitHub (auto-deploy, fully static)
- **Option C:** WhatsApp -> Supabase -> Portfolio (gives free admin dashboard)
