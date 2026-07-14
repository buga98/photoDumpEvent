PhotoDumpEvent — Header/Menu fix

Ovaj paket je napravljen iz zadnje HR/EN/DE produkcijske verzije.

Promijenjeno samo:
- index.html
- event.html
- app.html
- i18n.js
- i18n.css
- install-help.js
- sw.js

Što je popravljeno:
1. Hamburger na event.html i app.html sada radi i na rutama bez .html nastavka.
2. Veliki jezični gumb je uklonjen iz event/app headera.
3. Hamburger sadrži Moderator, Jezik (podizbornik HR/EN/DE) i Instalaciju.
4. Install stavka otvara postojeći modal s uputama.
5. Index sada ima mali jezični selector na desktopu i jezični selector unutar mobilnog menija.
6. Service worker cache verzija podignuta je na photodump-v10-header-menu-fix.

Nisu mijenjani:
- Firebase konfiguracija
- upload logika
- limit 15 fotografija
- galerija
- PWA session/pamćenje eventa i imena
- admin lozinke i moderator logika
- event podaci

Nakon deploya napravi hard refresh ili izbriši podatke stranice zbog starog service workera.
