# Design

This is a very lightweight replacement for other standup slack alternatives that cost money or just flat-out suck. The bot currently supports the following features:

* Create standup:
  * **1)** add `kanbanista` to a channel **2)** config the standup `/standup`
  * users are then reminded at the configured time
* Partake in standup
  * **1)** either do your update at your own leisure `/checkin` or get reminded at the configured time
* Only users in the standup channel are pinged, so adding and removing members is hassle-free
* You can export standup data per team and user by a single command `/export` which aggregates and creates a standup report for users
