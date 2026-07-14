PhotoDumpEvent — produkcijski HR / EN / DE paket
================================================

PROMJENE
1. Višejezičnost
   - Hrvatski, English i Deutsch na svim HTML stranicama.
   - Odabir jezika pamti se globalno i posebno za svaki event.
   - Jezični dropdown koristi zastave iz assets/lang/.
   - Event i app imaju hamburger meni: instalacija, moderator i jezik.
   - Javna početna, login i administracijske stranice također imaju odabir jezika.

2. Upload fotografija
   - Najviše 15 fotografija po jednom odabiru.
   - Ako korisnik odabere više, aplikacija jasno javlja da prenosi prvih 15.
   - Paralelni upload ostaje ograničen na 2, kao i u produkcijskoj verziji.

3. Install modal
   - X je zamijenjen SVG ikonom i precizno centriran.
   - Sadržaj install modala prevodi se na odabrani jezik.

4. Service worker
   - Cache verzija: photodump-v9-i18n-production.
   - U cache su dodani i18n.js, i18n.css i zastave jezika.

VAŽNO O EVENT TEKSTOVIMA
- Sučelje aplikacije prevodi se automatski.
- Naziv eventa, imena mladenaca, ručno unesene posvete i posebni tekstovi eventa
  ostaju točno onako kako ih organizator upiše. To sprječava neželjeno prevođenje
  osobnih imena i sadržaja gostiju.
- Za evente s posebnim tekstom na tri jezika kasnije je moguće dodati posebna polja
  title_hr/title_en/title_de i subtitle_hr/subtitle_en/subtitle_de.

DODAVANJE NOVOG JEZIKA
1. Dodati zastavu u assets/lang/.
2. U i18n.js dodati jezik u objekt LANGUAGES.
3. Dodati novi prijevodni objekt uz en i de.
4. Povećati verziju cachea u sw.js.

PREPORUČENI PRODUKCIJSKI TEST NAKON DEPLOYA
- Napraviti hard refresh i zatvoriti stare tabove.
- Na iPhoneu/Safariju i Androidu/Chromeu provjeriti HR, EN i DE.
- Ponovno otvoriti stranicu i potvrditi da je odabrani jezik zapamćen.
- U konkretnom eventu provjeriti hamburger: instalacija, moderator, jezik.
- Odabrati 16+ fotografija i potvrditi da se prenosi najviše 15.
- Provjeriti instalacijski modal i centrirani X.

NIJE DIRANO
Firebase konfiguracija, Firestore/Storage putanje, autentikacija, pravila pristupa,
struktura eventa, upload backend logika, moderator funkcionalnost i postojeći PWA session tok.
