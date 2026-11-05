# Jev Playground pack (26 messages)

For each block: paste **State** into the state box and **Questions** into the questions box, run, and copy the answer JSON into out/jev_playground_answers.json under its key.

## P01 · 2026-05-05 · email · key 4a5c9294fbec

Hand label: kind=edit, edit=captions, video=new arrivals, leaving=false

**State**
```json
{
  "message": "¿Pueden hacer los subtítulos más grandes en the new arrivals video? No se leen bien.",
  "channel": "email",
  "sender_business": "Evergreen Bridal Boutique"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"owner story\"",
      "t1": "The video titled \"bride story\"",
      "t2": "The video titled \"new arrivals\"",
      "t3": "The video titled \"sale promo\"",
      "t4": "The video titled \"try-on day\"",
      "t5": "The video titled \"store tour\"",
      "t6": "The video titled \"styling tips\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P02 · 2026-06-16 · email · key e6e583cb31cd

Hand label: kind=edit, edit=stumble, video=last_shoot, leaving=false

**State**
```json
{
  "message": "Can you remove the bit where I stumble on my words in the one we shot last week?",
  "channel": "email",
  "sender_business": "Prime Pediatrics"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"patient story\"",
      "t1": "The video titled \"flu shot season\"",
      "t2": "The video titled \"meet the team\"",
      "t3": "The video titled \"what to expect visit one\"",
      "t4": "The video titled \"desk posture fix\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P03 · 2026-06-21 · whatsapp · key 300adb83c5a1

Hand label: kind=edit, edit=music, video=last_shoot, leaving=false

**State**
```json
{
  "message": "The music on the one we shot last week is too loud, I can't hear myself.",
  "channel": "whatsapp",
  "sender_business": "Sullivan Family Law PLLC"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"what a consult costs\"",
      "t1": "The video titled \"divorce timeline\"",
      "t2": "The video titled \"wills in 60 seconds\"",
      "t3": "The video titled \"custody myths\"",
      "t4": "The video titled \"meet the attorney\"",
      "t5": "The video titled \"slip and fall rights\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P04 · 2026-06-10 · email · key c340e23e71c3

Hand label: kind=payment, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "Hi, Sofia from Tallgrass Digital. Please bill us (Tallgrass) for Prime Pediatrics and Glow Physical Therapy. We pay monthly.",
  "channel": "email",
  "sender_business": "Tallgrass Digital"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P05 · 2026-07-18 · email · key 8a7319e98abb

Hand label: kind=churn, edit=none, video=none, leaving=true

**State**
```json
{
  "message": "Nolan here. We'll pause after this month. Too many rounds of fixes, and my notes keep getting missed. Nothing personal.",
  "channel": "email",
  "sender_business": "Greenway Wealth Partners"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"client story\"",
      "t1": "The video titled \"why fees matter\"",
      "t2": "The video titled \"meet the advisor\"",
      "t3": "The video titled \"tax season tips\"",
      "t4": "The video titled \"college savings\"",
      "t5": "The video titled \"retirement myths\"",
      "t6": "The video titled \"estate planning basics\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P06 · 2026-09-03 · voice note · key a481c81c4d65

Hand label: kind=info, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "Trent here. In the videos please say Magnolia Chiropractic, the full name, not just Magnolia Chiro. Compliance cares about this.",
  "channel": "voice note",
  "sender_business": "Magnolia Chiropractic"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"what to expect visit one\"",
      "t1": "The video titled \"desk posture fix\"",
      "t2": "The video titled \"patient story\"",
      "t3": "The video titled \"insurance we take\"",
      "t4": "The video titled \"meet the team\"",
      "t5": "The video titled \"walk-ins welcome\"",
      "t6": "The video titled \"back pain myths\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P07 · 2026-09-08 · email · key d0dc7f79f72d

Hand label: kind=followup, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "The videos say \"Magnolia Chiro\" again. I asked for the full name. Not happy.",
  "channel": "email",
  "sender_business": "Magnolia Chiropractic"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"what to expect visit one\"",
      "t1": "The video titled \"desk posture fix\"",
      "t2": "The video titled \"patient story\"",
      "t3": "The video titled \"insurance we take\"",
      "t4": "The video titled \"meet the team\"",
      "t5": "The video titled \"walk-ins welcome\"",
      "t6": "The video titled \"back pain myths\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P08 · 2026-09-29 · website form · key 8a22fb038091

Hand label: kind=churn, edit=none, video=none, leaving=true

**State**
```json
{
  "message": "We would like to talk about our contract and whether we continue.",
  "channel": "website form",
  "sender_business": "Magnolia Chiropractic"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"what to expect visit one\"",
      "t1": "The video titled \"desk posture fix\"",
      "t2": "The video titled \"patient story\"",
      "t3": "The video titled \"insurance we take\"",
      "t4": "The video titled \"meet the team\"",
      "t5": "The video titled \"walk-ins welcome\"",
      "t6": "The video titled \"back pain myths\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P09 · 2026-08-11 · email · key 8f3d58cd1c49

Hand label: kind=payment, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "Cash is tight this month. Can I pay the August sessions together at the start of September?",
  "channel": "email",
  "sender_business": "Faith & Fire Podcast"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P10 · 2026-05-14 · whatsapp · key 6f478d1b9f20

Hand label: kind=referral, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "My friend Dr. Angela Webb at Ironclad Dental wants videos too. I gave her your number!",
  "channel": "whatsapp",
  "sender_business": "Sullivan Dental PLLC"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"whitening before and after\"",
      "t1": "The video titled \"meet the doctor\"",
      "t2": "The video titled \"implants explained\"",
      "t3": "The video titled \"office tour\"",
      "t4": "The video titled \"kids dental tips\"",
      "t5": "The video titled \"invisalign myths\"",
      "t6": "The video titled \"first visit tour\"",
      "t7": "The video titled \"why floss matters\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P11 · 2026-07-28 · email · key 8e55a8ea1336

Hand label: kind=upsell, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "The videos turned out great. Can we do this every month? What would that cost?",
  "channel": "email",
  "sender_business": "Luna Therapy"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"office tour\"",
      "t1": "The video titled \"insurance and cost\"",
      "t2": "The video titled \"meet the therapist\"",
      "t3": "The video titled \"couples tips\"",
      "t4": "The video titled \"family sessions explained\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P12 · 2026-04-10 · whatsapp · key a1d3147e1fae

Hand label: kind=schedule, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "Do we need to bring anything for the shoot?",
  "channel": "whatsapp",
  "sender_business": "Faith & Fire Podcast"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P13 · 2026-08-01 · email · key ca8c74aa535a

Hand label: kind=info, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "Big news: Sunset Fitness is now Sunset Athletics! New email is mateo@sunsetathletics.com.",
  "channel": "email",
  "sender_business": "Sunset Athletics"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"class schedule\"",
      "t1": "The video titled \"trainer intro\"",
      "t2": "The video titled \"member story\"",
      "t3": "The video titled \"nutrition tip\"",
      "t4": "The video titled \"gym tour\"",
      "t5": "The video titled \"30-day challenge\"",
      "t6": "The video titled \"form check squat\"",
      "t7": "The video titled \"open house promo\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P14 · 2026-05-28 · email · key 5cfeb1ca8d0b

Hand label: kind=praise, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "Best content team we've worked with. New patients mention the videos.",
  "channel": "email",
  "sender_business": "Sullivan Dental PLLC"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"whitening before and after\"",
      "t1": "The video titled \"meet the doctor\"",
      "t2": "The video titled \"implants explained\"",
      "t3": "The video titled \"office tour\"",
      "t4": "The video titled \"kids dental tips\"",
      "t5": "The video titled \"invisalign myths\"",
      "t6": "The video titled \"first visit tour\"",
      "t7": "The video titled \"why floss matters\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P15 · 2026-06-12 · email · key 0f309fea3856

Hand label: kind=approval, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "Sale promo looks great. Approved! Post it.",
  "channel": "email",
  "sender_business": "Evergreen Bridal Boutique"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"owner story\"",
      "t1": "The video titled \"bride story\"",
      "t2": "The video titled \"new arrivals\"",
      "t3": "The video titled \"sale promo\"",
      "t4": "The video titled \"try-on day\"",
      "t5": "The video titled \"store tour\"",
      "t6": "The video titled \"styling tips\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P16 · 2026-05-09 · email · key 8ef7b307974a

Hand label: kind=spam, edit=none, video=none, leaving=false

**State**
```json
{
  "message": "We sell 10,000 real followers for $49.",
  "channel": "email",
  "sender_business": "d:acct-dept"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P17 · 2026-05-17 · email · key 4cf3a271aad7

Hand label: kind=followup, edit=none, video=tax season tips, leaving=false

**State**
```json
{
  "message": "Did anyone see my message about tax season tips? It's not fixed.",
  "channel": "email",
  "sender_business": "Greenway Wealth Partners"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"client story\"",
      "t1": "The video titled \"why fees matter\"",
      "t2": "The video titled \"meet the advisor\"",
      "t3": "The video titled \"tax season tips\"",
      "t4": "The video titled \"college savings\"",
      "t5": "The video titled \"retirement myths\"",
      "t6": "The video titled \"estate planning basics\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P18 · 2026-05-28 · email · key e75b2dfc639c

Hand label: kind=followup, edit=none, video=patient story, leaving=false

**State**
```json
{
  "message": "Did anyone see my message about patient story? It's not fixed.",
  "channel": "email",
  "sender_business": "Magnolia Chiropractic"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"what to expect visit one\"",
      "t1": "The video titled \"desk posture fix\"",
      "t2": "The video titled \"patient story\"",
      "t3": "The video titled \"insurance we take\"",
      "t4": "The video titled \"meet the team\"",
      "t5": "The video titled \"walk-ins welcome\"",
      "t6": "The video titled \"back pain myths\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P19 · 2026-06-21 · whatsapp · key 2959a0988c06

Hand label: kind=followup, edit=none, video=sale promo, leaving=false

**State**
```json
{
  "message": "Still not fixed on sale promo. A little frustrated honestly.",
  "channel": "whatsapp",
  "sender_business": "Evergreen Bridal Boutique"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"owner story\"",
      "t1": "The video titled \"bride story\"",
      "t2": "The video titled \"new arrivals\"",
      "t3": "The video titled \"sale promo\"",
      "t4": "The video titled \"try-on day\"",
      "t5": "The video titled \"store tour\"",
      "t6": "The video titled \"styling tips\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P20 · 2026-05-06 · voice note · key d37b20f6775a

Hand label: kind=edit, edit=brand, video=tax season tips, leaving=false

**State**
```json
{
  "message": "On tax season tips, use our brand color pink, not the one you used.",
  "channel": "voice note",
  "sender_business": "Greenway Wealth Partners"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"client story\"",
      "t1": "The video titled \"why fees matter\"",
      "t2": "The video titled \"meet the advisor\"",
      "t3": "The video titled \"tax season tips\"",
      "t4": "The video titled \"college savings\"",
      "t5": "The video titled \"retirement myths\"",
      "t6": "The video titled \"estate planning basics\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P21 · 2026-05-16 · voice note · key 380864462a7b

Hand label: kind=edit, edit=brand, video=patient story, leaving=false

**State**
```json
{
  "message": "On the patient story video, use our brand color purple, not the one you used.",
  "channel": "voice note",
  "sender_business": "Magnolia Chiropractic"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"what to expect visit one\"",
      "t1": "The video titled \"desk posture fix\"",
      "t2": "The video titled \"patient story\"",
      "t3": "The video titled \"insurance we take\"",
      "t4": "The video titled \"meet the team\"",
      "t5": "The video titled \"walk-ins welcome\"",
      "t6": "The video titled \"back pain myths\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P22 · 2026-06-15 · voice note · key 5f1f9456cb79

Hand label: kind=edit, edit=outside, video=office tour, leaving=false

**State**
```json
{
  "message": "For office tour use the other shot, the one outside, not inside.",
  "channel": "voice note",
  "sender_business": "Ironclad Dental"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"kids dental tips\"",
      "t1": "The video titled \"office tour\"",
      "t2": "The video titled \"first visit tour\"",
      "t3": "The video titled \"invisalign myths\"",
      "t4": "The video titled \"implants explained\"",
      "t5": "The video titled \"whitening before and after\"",
      "t6": "The video titled \"meet the doctor\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P23 · 2026-06-13 · instagram · key dc584ebd6e08

Hand label: kind=edit, edit=stumble, video=sale promo, leaving=false

**State**
```json
{
  "message": "Can you remove the bit where I stumble on my words in sale promo?",
  "channel": "instagram",
  "sender_business": "Evergreen Bridal Boutique"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"owner story\"",
      "t1": "The video titled \"bride story\"",
      "t2": "The video titled \"new arrivals\"",
      "t3": "The video titled \"sale promo\"",
      "t4": "The video titled \"try-on day\"",
      "t5": "The video titled \"store tour\"",
      "t6": "The video titled \"styling tips\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P24 · 2026-04-17 · email · key 4a3db5eeb1a3

Hand label: kind=edit, edit=stumble, video=meet the doctor, leaving=false

**State**
```json
{
  "message": "Can you remove the bit where I stumble on my words in the meet the doctor video?",
  "channel": "email",
  "sender_business": "Sullivan Dental PLLC"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"whitening before and after\"",
      "t1": "The video titled \"meet the doctor\"",
      "t2": "The video titled \"implants explained\"",
      "t3": "The video titled \"office tour\"",
      "t4": "The video titled \"kids dental tips\"",
      "t5": "The video titled \"invisalign myths\"",
      "t6": "The video titled \"first visit tour\"",
      "t7": "The video titled \"why floss matters\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P25 · 2026-05-19 · email · key 2424f2d579ca

Hand label: kind=edit, edit=stumble, video=trainer intro, leaving=false

**State**
```json
{
  "message": "Can you remove the bit where I stumble on my words in trainer intro?",
  "channel": "email",
  "sender_business": "Sunset Athletics"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"class schedule\"",
      "t1": "The video titled \"trainer intro\"",
      "t2": "The video titled \"member story\"",
      "t3": "The video titled \"nutrition tip\"",
      "t4": "The video titled \"gym tour\"",
      "t5": "The video titled \"30-day challenge\"",
      "t6": "The video titled \"form check squat\"",
      "t7": "The video titled \"open house promo\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```

## P26 · 2026-04-15 · whatsapp · key 5cdfd2245552

Hand label: kind=edit, edit=spelling, video=crew day, leaving=false

**State**
```json
{
  "message": "On crew day our name is spelled wrong in the caption.",
  "channel": "whatsapp",
  "sender_business": "Redbird & Co Builders"
}
```

**Questions**
```json
{
  "kind": {
    "type": "choice",
    "instructions": "What is the main purpose of this message from a client (or stranger) to a video studio?",
    "criteria": {
      "edit": "Asks us to change something in a video (cut, music, captions, colors, text, shots, a new song or intro).",
      "followup": "Says an earlier request was missed or is still not fixed (\"did anyone see my message\", \"still wrong\", \"second time I ask\").",
      "churn": "Says or hints they may stop, pause, cancel or reconsider working with us, or wants to discuss the contract.",
      "payment": "About paying, invoices or billing: when they will pay, partial payment, who to bill.",
      "referral": "Recommends someone else to us, or says someone else will contact us.",
      "upsell": "Asks about buying more or a new service, or asks for a price.",
      "schedule": "Shoot logistics: times, rescheduling, cancelling a shoot, running late, parking, what to bring.",
      "info": "Updates their business details (name, email, phone) or gives a standing rule for all future videos.",
      "praise": "Thanks us or says the videos worked well, with no request.",
      "approval": "Approves a video for posting.",
      "spam": "Unsolicited marketing, scams or offers from someone who is not a client.",
      "other": "None of the above."
    }
  },
  "edit": {
    "type": "choice",
    "instructions": "If the message asks for a change to a video, which change? Otherwise \"none\".",
    "criteria": {
      "stumble": "Remove a part where the speaker stumbles over words",
      "spelling": "A name is spelled wrong in captions or text",
      "phone": "Add a phone number at the end",
      "prices": "Remove the part where prices are mentioned",
      "calmer": "Use a calmer song or music",
      "music": "The music is too loud; turn it down",
      "captions": "Make captions or subtitles bigger",
      "first3": "Cut the first seconds because the start is slow",
      "brand": "Use a different brand color",
      "walkins": "Add the line 'walk-ins welcome' at the end",
      "outside": "Use a different shot (the outside one)",
      "blur": "Blur someone's face",
      "redo": "They changed their mind: new song and new intro",
      "none": "The message does not ask for a change to a video"
    }
  },
  "video": {
    "type": "choice",
    "instructions": "Which of this client's videos is the message about?",
    "criteria": {
      "t0": "The video titled \"kitchen remodel reveal\"",
      "t1": "The video titled \"client walkthrough\"",
      "t2": "The video titled \"permit tips\"",
      "t3": "The video titled \"crew day\"",
      "t4": "The video titled \"project timeline\"",
      "t5": "The video titled \"owner story\"",
      "t6": "The video titled \"material choices\"",
      "last_shoot": "Does not name the video; says \"the one we shot last week\" or similar",
      "none": "Not about one specific video"
    }
  },
  "leaving": {
    "type": "noul",
    "instructions": "The sender says or hints that they may stop, pause or cancel working with the studio."
  }
}
```
