PhotoDumpEvent – PWA session fix

Promijenjeno je samo PWA spremanje/prijava:
- pwa-start.html provjerava eventId + ime + userId
- event.js sprema ime i userId i globalno i posebno za svaki event
- script.js obnavlja spremljenu sesiju prije pokretanja aplikacije
- sw.js ima novu cache verziju kako stari kod ne bi ostao aktivan
- dodane su ispravne 192x192 i 512x512 PWA ikone

Ostala poslovna logika aplikacije nije mijenjana.
