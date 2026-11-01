// =============================================================================
// MARC'S PROFILE: the ONLY things the assistant knows about you.
// Anything you write here can be repeated to any visitor, so only include what
// you're happy for a stranger or recruiter to read.
//
// Replace every "[FILL IN ...]" with your own words, or delete the line.
// Lines that still contain "[FILL IN" are skipped automatically.
// After editing, redeploy:  npx wrangler deploy
// =============================================================================

export const PROFILE = `
## Basics
- Full name: Marc Anthony Marquez
- Based in: Abu Dhabi, UAE (UTC+4)
- Current focus: moving from IT operations into cloud/infrastructure operations, DevOps/SRE and AI automation
- Open to: cloud and infrastructure operations, DevOps, and AI automation roles in the UAE and international remote positions. Available immediately.
- Contact: email marc@malmarquez.com, or the CV download, GitHub and LinkedIn links on the site

## Work background (from the portfolio)
- 18 years in IT infrastructure and operations across the Philippines, Saudi Arabia and the UAE
- NOC Engineer (L1/L2) at Momentum Corporate Services, Abu Dhabi (Sep 2025 to Oct 2026): 24/7 incident response across Azure, AWS and on-premise; rebuilt the team's Grafana dashboards; wrote runbooks; ran Datadog and Dynatrace proof-of-concept tests
- Shamal Holding, Dubai (2020 to 2025): Microsoft 365 for about 2,000 users, Entra ID Connect, VMware, full MFA rollout, ServiceDesk Plus setup, a Copilot Studio self-service bot, senior on a team of three support engineers
- Meraas Holding, Dubai (2015 to 2020): Microsoft 365 for about 3,000 users, field and executive IT support, standard Windows image
- Earlier: Unlimited IT, Tata Consultancy Services, Arabic Computer System (Saudi Aramco project), Festival Supermall, Trend Micro (started in 2008)
- Education: BSc Electronics and Communications Engineering, Mapua Institute of Technology, Manila
- Certifications: Azure Solutions Architect Expert, Azure Administrator Associate, Azure Fundamentals, CompTIA Security+, ITIL v4 Foundation

## Projects (from the portfolio)
- Project SIGNAL: an eight-VM home lab (RHEL 9.5 + Windows Server 2022 on VMware) running a small game service, deployed with Ansible and monitored with Prometheus, Grafana and ELK. Marc writes up what breaks and how he fixed it.
- Project CLAP: a Python desktop assistant that wakes on a double clap or "Hey CLAP" and gives a spoken daily briefing, using a local model through Ollama
- Project VITAL: an offline-first Android health tracker built with Flutter
- This chat assistant: runs on Cloudflare Workers AI and answers only from a profile Marc wrote himself

## About Marc as a person
- In a few words: Marc is calm, patient and a good listener.
- Hobbies and interests: Marc is an active person outside work. He plays basketball and enjoys running, cycling and walking.
- Strava: visitors are welcome to follow Marc's runs and rides on Strava at https://www.strava.com/athletes/99784963
- Outside IT: Marc keeps a daily health routine and takes it seriously.
- Languages: English, Tagalog and basic Arabic.
- Favorite food: menudo, the Filipino pork and tomato stew.
- Favorite quote / the rule he lives by: "Do not do unto others what you would not want others to do unto you." For Marc it means treating people the way he'd want to be treated, at work and outside it.
- Fun facts: Marc was born in Marinduque in the Philippines and grew up moving between different cities there. He also recently lost 20 kg through his health routine.

## Work style
- What he enjoys most: the moment a problem is finally resolved, and seeing a customer leave happy. He likes being the person people can rely on for tech help.
- How colleagues would describe him: a strong collaborator who fits in easily. He has spent most of his career in multinational teams across the Philippines, Saudi Arabia and the UAE and works well with people from many backgrounds.

## Goals and values
- What he's learning now: Linux (RHEL), Ansible automation, Prometheus/Grafana/ELK monitoring and incident analysis in his home lab, Python for automation and AI tools, and Azure AI (working toward the Microsoft Azure AI Fundamentals certification).
- Why SRE/DevOps: after years of fixing incidents by hand, Marc wants to work on the other side of the problem: automating the repetitive work, building better monitoring, and making systems reliable so incidents happen less often. His NOC and infrastructure background gives him a strong operations foundation for that move.
- Career goal (next 3-5 years): to grow into a Site Reliability or DevOps engineer working on cloud platforms, owning automation and observability, and bringing AI automation into day-to-day operations.
- Bigger life goal: financial freedom, and being present for his kids as they grow up, guiding and supporting them.
- What matters to him in a team: open communication, respect across cultures, sharing knowledge, calm problem-solving under pressure, and learning from incidents instead of blaming people.
## For recruiters and employers
- Why he left Momentum: Marc is happy to discuss that directly. Suggest emailing him.
- Work arrangement: Marc prefers remote work but is open to on-site or hybrid roles.
- Relocation: open to relocating anywhere.
- Shifts and on-call: comfortable with 24/7 rotating shifts and on-call, which is what he did as a NOC engineer.
- Type of company: open to any industry. He is most at home in teams that run real production systems around the clock, where uptime matters and monitoring and automation are taken seriously.
- Biggest strength: he stays steady when things go wrong. When a system is down and everyone is under pressure, Marc slows things down just enough to understand what is actually happening, keeps people informed and works the problem step by step. He also listens properly, which helps when the person reporting the issue is upset or not technical.
- A weakness he is working on: Marc finds it hard to let go of an unsolved problem, and he used to carry it into his off-hours. He has learned to write a clear handover, trust the next shift, and come back to it fresh, which usually gets it fixed faster anyway.
- Proudest achievement: bringing structure and modernization to IT operations at the Dubai holding groups. He organized an undocumented environment by building asset records and standardizing system images so hardware could be swapped quickly. Later he built and deployed an internal Teams bot with Copilot Studio that answered policy questions and common IT issues like "my laptop is slow". It reduced repetitive tickets and let the field team focus on critical on-site support.
- Handling tough incidents: as a NOC engineer Marc regularly handled P1 incidents, including outages that blocked revenue. In those moments he confirms the impact fast, gets the right engineers involved early, escalates with clear evidence (graphs, logs, timelines) rather than guesses, and keeps stakeholders updated so nobody is left asking for status. Once the service is back he makes sure the timeline is written down and the runbook is updated, so the next person handles it faster.
- What makes him different: Marc has worked almost every layer of IT over 18 years, from the help desk and field support to Microsoft 365, identity, VMware and cloud monitoring. So when something breaks, he understands both the system and the person affected by it. He also learns by building: he runs his own eight-VM lab, breaks it, and writes up honestly what went wrong and how he fixed it.
`;
