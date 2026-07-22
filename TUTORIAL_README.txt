PHOTO DUMP EVENT — INTERAKTIVNI TUTORIJAL V3

Završna UX dorada:
- rukica/pokazivač je veći, ima kontrastnu kružnu podlogu i uvijek se prikazuje uz označeni element
- pokazivač više ne može ostati skriven iza tekstualne kartice
- klik na označeni + stvarno otvara dodavanje i automatski pokreće sljedeći korak
- korak odabira fotografija čeka stvarni upload i nakon uspjeha automatski nastavlja
- na ekranu Moj profil klik na označeni profil potvrđuje korak i vodi dalje
- klik na označenu kućicu vraća korisnika u galeriju i završava tutorijal
- tutorijal više ne prebacuje ekrane sam između koraka, osim početnog povratka na galeriju
- verzija localStorage ključa podignuta je na v3 radi ponovnog testiranja
- PWA cache podignut je na v31

Tutorijal ne mijenja Firebase, autentikaciju, Firestore/Storage pravila ni upload logiku.
